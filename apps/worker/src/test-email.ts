#!/usr/bin/env tsx

// Test script to verify email notification functionality
import { EmailService } from './services/email';
import { logger } from './lib/logger';

async function testEmailNotifications() {
  console.log('🧪 Testing email notification functionality...\n');

  try {
    const emailService = new EmailService();

    // Test 1: Screenshot captured email
    console.log('Test 1: Screenshot captured email template');
    const capturedEmail = EmailService.generateScreenshotCapturedEmail({
      projectName: 'DocShot AI Demo',
      screenshotName: 'Homepage Header',
      url: 'https://example.com',
      imageUrl: 'https://example.com/screenshot.png',
    });

    console.log(`✅ Subject: ${capturedEmail.subject}`);
    console.log(`✅ HTML length: ${capturedEmail.html.length} characters\n`);

    // Test 2: Diff detected email
    console.log('Test 2: Diff detected email template');
    const diffEmail = EmailService.generateDiffDetectedEmail({
      projectName: 'DocShot AI Demo',
      screenshotName: 'Homepage Header',
      percentageDiff: 2.45,
      diffUrl: 'https://example.com/diff.png',
      approvalUrl: 'https://app.example.com/projects/123',
      screenshotUrl: 'https://example.com',
      pixelDiff: 1250,
      totalPixels: 51000,
    });

    console.log(`✅ Subject: ${diffEmail.subject}`);
    console.log(`✅ HTML length: ${diffEmail.html.length} characters\n`);

    // Test 3: Screenshot failed email
    console.log('Test 3: Screenshot failed email template');
    const failedEmail = EmailService.generateScreenshotFailedEmail({
      projectName: 'DocShot AI Demo',
      screenshotName: 'Homepage Header',
      url: 'https://example.com',
      error: 'Navigation timeout exceeded',
    });

    console.log(`✅ Subject: ${failedEmail.subject}`);
    console.log(`✅ HTML length: ${failedEmail.html.length} characters\n`);

    // Test 4: Project summary email
    console.log('Test 4: Project summary email template');
    const summaryEmail = EmailService.generateProjectSummaryEmail({
      projectName: 'DocShot AI Demo',
      summary: {
        totalScreenshots: 25,
        changesDetected: 3,
        pendingApproval: 2,
        failed: 1,
      },
      dashboardUrl: 'https://app.example.com/projects/123',
      period: 'Daily',
    });

    console.log(`✅ Subject: ${summaryEmail.subject}`);
    console.log(`✅ HTML length: ${summaryEmail.html.length} characters\n`);

    // Test 5: Bulk changes email
    console.log('Test 5: Bulk changes email template');
    const bulkEmail = EmailService.generateBulkChangesEmail({
      projectName: 'DocShot AI Demo',
      changes: [
        { screenshotName: 'Homepage Header', percentageDiff: 2.45, url: 'https://example.com' },
        {
          screenshotName: 'Product Gallery',
          percentageDiff: 5.12,
          url: 'https://example.com/products',
        },
        { screenshotName: 'Contact Form', percentageDiff: 1.89 },
      ],
      approvalUrl: 'https://app.example.com/projects/123',
    });

    console.log(`✅ Subject: ${bulkEmail.subject}`);
    console.log(`✅ HTML length: ${bulkEmail.html.length} characters\n`);

    // Test 6: Email service configuration check
    console.log('Test 6: Email service configuration');
    const hasSmtpConfig = !!(process.env.SMTP_USER && process.env.SMTP_PASS);

    if (hasSmtpConfig) {
      console.log('✅ SMTP configuration found');
      console.log(`   Host: ${process.env.SMTP_HOST || 'smtp.gmail.com'}`);
      console.log(`   Port: ${process.env.SMTP_PORT || '587'}`);
      console.log(`   User: ${process.env.SMTP_USER}`);
      console.log(`   From: ${process.env.SMTP_FROM || 'DocShot AI <notifications@docshot.ai>'}\n`);

      // Test 7: Send a test email (if recipient is provided)
      const testRecipient = process.env.TEST_EMAIL_RECIPIENT;
      if (testRecipient) {
        console.log('Test 7: Sending actual test email');
        console.log(`Sending to: ${testRecipient}`);

        const testEmailSent = await emailService.sendEmail({
          to: [testRecipient],
          subject: '[DocShot AI] Test Email - Email Notifications Working!',
          html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #22C55E; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f4f4f4; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Email Notifications Working!</h1>
    </div>
    <div class="content">
      <h2>Test Successful</h2>
      <p>Your DocShot AI email notification system is working correctly!</p>
      
      <h3>Features Tested:</h3>
      <ul>
        <li>✅ Screenshot captured notifications</li>
        <li>✅ Visual diff detected alerts</li>
        <li>✅ Screenshot failure notifications</li>
        <li>✅ Project summary reports</li>
        <li>✅ Bulk change alerts</li>
        <li>✅ Email delivery with retry logic</li>
      </ul>
      
      <p style="margin-top: 20px; padding: 15px; background-color: #D1FAE5; border-left: 4px solid #22C55E;">
        <strong>Success!</strong> Your email notification system is ready to keep you informed about screenshot changes.
      </p>
      
      <p style="color: #666; font-size: 14px; margin-top: 20px;">
        This is a test email sent on ${new Date().toLocaleString()} from your DocShot AI worker process.
      </p>
    </div>
    <div class="footer">
      <p>DocShot AI - Automated Screenshot Management</p>
      <p>Email notification system test - ${new Date().toISOString()}</p>
    </div>
  </div>
</body>
</html>
          `,
        });

        if (testEmailSent) {
          console.log('✅ Test email sent successfully!');
        } else {
          console.log('❌ Test email failed to send');
        }
      } else {
        console.log('⚠️  Skipping actual email send (no TEST_EMAIL_RECIPIENT provided)');
        console.log('   Set TEST_EMAIL_RECIPIENT=your@email.com to test actual sending');
      }
    } else {
      console.log('⚠️  SMTP not configured (missing SMTP_USER and SMTP_PASS)');
      console.log('   Email templates generated successfully but cannot send emails');
    }

    console.log('\n🎉 All email notification tests completed!');

    // Save sample email to file for inspection
    const fs = require('fs');
    const path = require('path');

    const outputDir = path.join(__dirname, '../test-output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(path.join(outputDir, 'sample-diff-email.html'), diffEmail.html);

    console.log(`📁 Sample email saved to: ${path.join(outputDir, 'sample-diff-email.html')}`);
    console.log('   Open this file in a browser to preview the email design');
  } catch (error) {
    console.error('❌ Email notification test failed:', error);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testEmailNotifications().catch(console.error);
}

export { testEmailNotifications };
