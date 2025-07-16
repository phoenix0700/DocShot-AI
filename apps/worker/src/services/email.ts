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
      this.transporter = nodemailer.createTransporter(emailConfig);
      logger.info('Email service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize email service', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      logger.warn('Email service not configured. Skipping email send.');
      return false;
    }

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
      });
      return true;
    } catch (error) {
      logger.error('Failed to send email', {
        error: error instanceof Error ? error.message : String(error),
        to: options.to,
      });
      return false;
    }
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
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
      
      ${data.imageUrl ? `
      <p style="margin-top: 20px;">
        <a href="${data.imageUrl}" class="button">View Screenshot</a>
      </p>
      ` : ''}
      
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
        Difference: ${data.percentageDiff.toFixed(2)}%
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
}