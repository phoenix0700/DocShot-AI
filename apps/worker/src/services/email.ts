import nodemailer from 'nodemailer';
import { logger } from '../lib/logger';

interface EmailOptions {
  to: string[];
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    // Use environment variables for email configuration
    const emailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    };

    if (!emailConfig.auth.user || !emailConfig.auth.pass) {
      logger.warn('Email service not configured. Missing SMTP credentials.');
      return;
    }

    try {
      this.transporter = nodemailer.createTransport(emailConfig);
      logger.info('Email service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize email service', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async sendEmail(options: EmailOptions, retries: number = 3): Promise<boolean> {
    if (!this.transporter) {
      logger.warn('Email service not configured. Skipping email send.');
      return false;
    }

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const mailOptions = {
          from: process.env.SMTP_FROM || 'DocShot AI <notifications@docshot.ai>',
          to: options.to.join(', '),
          subject: options.subject,
          html: options.html,
          text: options.text || this.stripHtml(options.html),
        };

        const info = await this.transporter.sendMail(mailOptions);
        logger.info('Email sent successfully', {
          messageId: info.messageId,
          to: options.to,
          attempt,
        });
        return true;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt === retries) {
          logger.error('Failed to send email after all retries', {
            error: lastError.message,
            to: options.to,
            attempts: retries,
          });
        } else {
          logger.warn(`Email send attempt ${attempt} failed, retrying...`, {
            error: lastError.message,
            to: options.to,
          });

          // Wait before retry (exponential backoff)
          await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
        }
      }
    }

    return false;
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }

  /**
   * Deprecated instance helper kept for legacy tests. Prefer using the static
   * `generateDiffDetectedEmail` moving forward.
   */
  generateDiffEmail(
    data: Parameters<typeof EmailService.generateDiffDetectedEmail>[0]
  ) {
    return EmailService.generateDiffDetectedEmail(data);
  }

  static generateDiffEmail(...args: Parameters<typeof EmailService.generateDiffDetectedEmail>) {
    return EmailService.generateDiffDetectedEmail(...(args as [any]));
  }

  // Email templates
  static generateScreenshotCapturedEmail(data: {
    projectName: string;
    screenshotName: string;
    url: string;
    imageUrl?: string;
  }): { subject: string; html: string } {
    const subject = `[DocShot AI] Screenshot captured: ${data.screenshotName}`;
    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f4f4f4; }
    .button { display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Screenshot Captured Successfully</h1>
    </div>
    <div class="content">
      <h2>Project: ${data.projectName}</h2>
      <p><strong>Screenshot:</strong> ${data.screenshotName}</p>
      <p><strong>URL:</strong> <a href="${data.url}">${data.url}</a></p>
      
      ${
        data.imageUrl
          ? `
      <p style="margin-top: 20px;">
        <a href="${data.imageUrl}" class="button">View Screenshot</a>
      </p>
      `
          : ''
      }
      
      <p style="margin-top: 20px; color: #666;">
        This screenshot has been captured and is ready for review in your DocShot AI dashboard.
      </p>
    </div>
    <div class="footer">
      <p>DocShot AI - Automated Screenshot Management</p>
      <p>You received this email because you have notifications enabled for this project.</p>
    </div>
  </div>
</body>
</html>
    `;
    return { subject, html };
  }

  static generateDiffDetectedEmail(data: {
    projectName: string;
    screenshotName: string;
    percentageDiff: number;
    diffUrl?: string;
    approvalUrl?: string;
    screenshotUrl?: string;
    pixelDiff?: number;
    totalPixels?: number;
  }): { subject: string; html: string } {
    const subject = `[DocShot AI] Changes detected: ${data.screenshotName}`;
    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #F59E0B; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f4f4f4; }
    .button { display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 5px; }
    .warning { background-color: #FEF3C7; padding: 15px; border-left: 4px solid #F59E0B; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Visual Changes Detected</h1>
    </div>
    <div class="content">
      <h2>Project: ${data.projectName}</h2>
      
      <div class="warning">
        <strong>⚠️ Changes Detected</strong><br>
        Screenshot: ${data.screenshotName}<br>
        ${data.screenshotUrl ? `URL: ${data.screenshotUrl}<br>` : ''}
        Difference: ${data.percentageDiff.toFixed(2)}%
        ${data.pixelDiff && data.totalPixels ? `<br>Pixels changed: ${data.pixelDiff.toLocaleString()} of ${data.totalPixels.toLocaleString()}` : ''}
      </div>
      
      <p>Visual differences have been detected in your screenshot. Please review the changes and approve or reject them.</p>
      
      <p style="text-align: center; margin-top: 30px;">
        ${data.diffUrl ? `<a href="${data.diffUrl}" class="button">View Differences</a>` : ''}
        ${data.approvalUrl ? `<a href="${data.approvalUrl}" class="button">Review & Approve</a>` : ''}
      </p>
    </div>
    <div class="footer">
      <p>DocShot AI - Automated Screenshot Management</p>
      <p>You received this email because you have notifications enabled for this project.</p>
    </div>
  </div>
</body>
</html>
    `;
    return { subject, html };
  }

  static generateScreenshotFailedEmail(data: {
    projectName: string;
    screenshotName: string;
    url: string;
    error: string;
  }): { subject: string; html: string } {
    const subject = `[DocShot AI] Screenshot failed: ${data.screenshotName}`;
    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #EF4444; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f4f4f4; }
    .error { background-color: #FEE2E2; padding: 15px; border-left: 4px solid #EF4444; margin: 20px 0; }
    .button { display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Screenshot Failed</h1>
    </div>
    <div class="content">
      <h2>Project: ${data.projectName}</h2>
      
      <div class="error">
        <strong>❌ Capture Failed</strong><br>
        Screenshot: ${data.screenshotName}<br>
        URL: ${data.url}<br>
        Error: ${data.error}
      </div>
      
      <p>We were unable to capture this screenshot. This could be due to:</p>
      <ul>
        <li>The page took too long to load</li>
        <li>Authentication issues</li>
        <li>Invalid URL or selector</li>
        <li>Network connectivity problems</li>
      </ul>
      
      <p style="margin-top: 20px;">
        Please check your configuration and try again. If the problem persists, contact support.
      </p>
    </div>
    <div class="footer">
      <p>DocShot AI - Automated Screenshot Management</p>
      <p>You received this email because you have notifications enabled for this project.</p>
    </div>
  </div>
</body>
</html>
    `;
    return { subject, html };
  }

  static generateProjectSummaryEmail(data: {
    projectName: string;
    summary: {
      totalScreenshots: number;
      changesDetected: number;
      pendingApproval: number;
      failed: number;
    };
    dashboardUrl?: string;
    period?: string;
  }): { subject: string; html: string } {
    const subject = `[DocShot AI] ${data.period || 'Daily'} summary: ${data.projectName}`;
    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f4f4f4; }
    .stats { display: flex; flex-wrap: wrap; gap: 15px; margin: 20px 0; }
    .stat { background: white; padding: 15px; border-radius: 8px; flex: 1; min-width: 120px; text-align: center; }
    .stat-number { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
    .stat-label { font-size: 12px; color: #666; text-transform: uppercase; }
    .green { color: #22C55E; }
    .orange { color: #F59E0B; }
    .red { color: #EF4444; }
    .blue { color: #3B82F6; }
    .button { display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Project Summary</h1>
    </div>
    <div class="content">
      <h2>Project: ${data.projectName}</h2>
      <p>Here's your ${data.period || 'daily'} project summary:</p>
      
      <div class="stats">
        <div class="stat">
          <div class="stat-number blue">${data.summary.totalScreenshots}</div>
          <div class="stat-label">Total Screenshots</div>
        </div>
        <div class="stat">
          <div class="stat-number orange">${data.summary.changesDetected}</div>
          <div class="stat-label">Changes Detected</div>
        </div>
        <div class="stat">
          <div class="stat-number orange">${data.summary.pendingApproval}</div>
          <div class="stat-label">Pending Approval</div>
        </div>
        <div class="stat">
          <div class="stat-number red">${data.summary.failed}</div>
          <div class="stat-label">Failed</div>
        </div>
      </div>
      
      ${
        data.summary.changesDetected > 0
          ? `
      <div style="background-color: #FEF3C7; padding: 15px; border-left: 4px solid #F59E0B; margin: 20px 0;">
        <strong>Action Required:</strong> You have ${data.summary.changesDetected} screenshot(s) with detected changes that need review.
      </div>
      `
          : `
      <div style="background-color: #D1FAE5; padding: 15px; border-left: 4px solid #22C55E; margin: 20px 0;">
        <strong>All Good:</strong> No significant changes detected in your screenshots.
      </div>
      `
      }
      
      ${
        data.dashboardUrl
          ? `
      <p style="text-align: center; margin-top: 30px;">
        <a href="${data.dashboardUrl}" class="button">View Dashboard</a>
      </p>
      `
          : ''
      }
    </div>
    <div class="footer">
      <p>DocShot AI - Automated Screenshot Management</p>
      <p>You received this email because you have notifications enabled for this project.</p>
    </div>
  </div>
</body>
</html>
    `;
    return { subject, html };
  }

  static generateBulkChangesEmail(data: {
    projectName: string;
    changes: Array<{
      screenshotName: string;
      percentageDiff: number;
      url?: string;
    }>;
    approvalUrl?: string;
  }): { subject: string; html: string } {
    const subject = `[DocShot AI] Multiple changes detected: ${data.projectName}`;
    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #F59E0B; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f4f4f4; }
    .change-list { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .change-item { padding: 10px 0; border-bottom: 1px solid #eee; }
    .change-item:last-child { border-bottom: none; }
    .change-name { font-weight: bold; }
    .change-diff { color: #F59E0B; font-size: 14px; }
    .change-url { color: #666; font-size: 12px; }
    .button { display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠️ Multiple Changes Detected</h1>
    </div>
    <div class="content">
      <h2>Project: ${data.projectName}</h2>
      
      <p><strong>${data.changes.length} screenshot(s)</strong> have detected changes that require your attention:</p>
      
      <div class="change-list">
        ${data.changes
          .map(
            (change) => `
          <div class="change-item">
            <div class="change-name">${change.screenshotName}</div>
            <div class="change-diff">${change.percentageDiff.toFixed(2)}% changed</div>
            ${change.url ? `<div class="change-url">${change.url}</div>` : ''}
          </div>
        `
          )
          .join('')}
      </div>
      
      <p>Please review these changes and approve or reject them in your dashboard.</p>
      
      ${
        data.approvalUrl
          ? `
      <p style="text-align: center; margin-top: 30px;">
        <a href="${data.approvalUrl}" class="button">Review All Changes</a>
      </p>
      `
          : ''
      }
    </div>
    <div class="footer">
      <p>DocShot AI - Automated Screenshot Management</p>
      <p>You received this email because you have notifications enabled for this project.</p>
    </div>
  </div>
</body>
</html>
    `;
    return { subject, html };
  }
}

// Factory to maintain backward compatibility with legacy imports
export function createEmailService(): EmailService {
  return new EmailService();
}

// Email templates
