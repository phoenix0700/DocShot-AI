import { Job } from 'bullmq';
import { NotificationJobDataSchema } from '@docshot/shared';
import { createSupabaseClient } from '@docshot/database';
import { EmailService } from '../services/email';
import { logger } from '../lib/logger';

// Create Supabase client lazily to ensure environment variables are loaded
const getSupabaseClient = () => {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_KEY || ''
  );
};

const emailService = new EmailService();

export const notificationProcessor = async (job: Job) => {
  const data = NotificationJobDataSchema.parse(job.data);

  try {
    logger.info(`Processing notification: ${data.type} for project ${data.projectId}`);

    // Fetch project and user details
    const supabase = getSupabaseClient();
    
    // First get the project to know the user_id
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('name, user_id, config')
      .eq('id', data.projectId)
      .single();

    if (projectError || !project) {
      logger.error(`Project lookup failed:`, { projectId: data.projectId, error: projectError });
      throw new Error(`Project not found: ${data.projectId}`);
    }

    // Set user context for RLS
    await supabase.setUserContext(project.user_id);

    // Check if email notifications are enabled in config
    const emailRecipients = project.config?.integrations?.email?.recipients || [];

    if (emailRecipients.length === 0) {
      logger.info('No email recipients configured for project', { projectId: data.projectId });
      return { success: true, skipped: true };
    }

    // Fetch screenshot details if needed
    let screenshot: any = null;
    if (data.screenshotId) {
      const { data: screenshotData } = await supabase
        .from('screenshots')
        .select('*')
        .eq('id', data.screenshotId)
        .single();
      screenshot = screenshotData;
    }

    // Generate and send email based on notification type
    let emailContent: { subject: string; html: string } | null = null;

    switch (data.type) {
      case 'screenshot_captured':
        if (screenshot) {
          emailContent = EmailService.generateScreenshotCapturedEmail({
            projectName: project.name,
            screenshotName: screenshot.name,
            url: screenshot.url,
            imageUrl: screenshot.image_url,
          });
        }
        break;

      case 'diff_detected':
        if (screenshot) {
          // Extract diff data from the notification data or screenshot
          const diffData = data.diffData || screenshot.diff_data || { percentageDiff: 0 };
          emailContent = EmailService.generateDiffDetectedEmail({
            projectName: project.name,
            screenshotName: screenshot.name,
            percentageDiff: diffData.percentageDiff || 0,
            diffUrl: data.diffImageUrl || screenshot.diff_image_url,
            approvalUrl: `${process.env.NEXT_PUBLIC_APP_URL}/projects/${data.projectId}`,
            screenshotUrl: screenshot.url,
            pixelDiff: diffData.pixelDiff,
            totalPixels: diffData.totalPixels,
          });
        }
        break;

      case 'screenshot_failed':
        if (screenshot) {
          emailContent = EmailService.generateScreenshotFailedEmail({
            projectName: project.name,
            screenshotName: screenshot.name,
            url: screenshot.url,
            error: data.message || 'Unknown error',
          });
        }
        break;

      case 'project_summary':
        if (data.summary) {
          emailContent = EmailService.generateProjectSummaryEmail({
            projectName: project.name,
            summary: data.summary,
            dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/projects/${data.projectId}`,
            period: data.period || 'Daily',
          });
        }
        break;

      case 'bulk_changes':
        if (data.changes && data.changes.length > 0) {
          emailContent = EmailService.generateBulkChangesEmail({
            projectName: project.name,
            changes: data.changes,
            approvalUrl: `${process.env.NEXT_PUBLIC_APP_URL}/projects/${data.projectId}`,
          });
        }
        break;

      default:
        logger.warn(`Unknown notification type: ${data.type}`);
    }

    if (emailContent) {
      const sent = await emailService.sendEmail({
        to: emailRecipients,
        subject: emailContent.subject,
        html: emailContent.html,
      });

      if (sent) {
        logger.info('Notification email sent successfully', {
          type: data.type,
          projectId: data.projectId,
          recipients: emailRecipients.length,
        });
      }
    }

    return { success: true };
  } catch (error) {
    logger.error(`Notification failed:`, {
      error: error instanceof Error ? error.message : String(error),
      data,
    });
    throw error;
  }
};
