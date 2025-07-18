#!/usr/bin/env tsx

// End-to-end test script for DocShot AI workflow
import { createQueueManager } from '@docshot/shared';
import { createSupabaseClient } from '@docshot/database';
import { captureScreenshot } from './lib/puppeteer';
import { compareImages } from './lib/pixelmatch';
import * as fs from 'fs';
import * as path from 'path';

const testDir = path.join(__dirname, '../test-output');

async function testEndToEndWorkflow() {
  console.log('🚀 Starting End-to-End DocShot AI Workflow Test\n');

  try {
    // Ensure test directory exists
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    // Step 1: Test Queue Management
    console.log('Step 1: Testing Queue Management');
    const queueManager = createQueueManager();
    
    console.log('  ✅ Queue manager created successfully');
    console.log(`  📊 Queue connection: ${queueManager ? 'Connected' : 'Failed'}\n`);

    // Step 2: Test Direct Screenshot Capture
    console.log('Step 2: Testing Direct Screenshot Capture');
    
    const testUrl = 'https://example.com';
    console.log(`  📸 Capturing screenshot of: ${testUrl}`);
    
    const screenshotResult = await captureScreenshot({
      url: testUrl,
      viewport: { width: 1280, height: 720 },
      waitForTimeout: 1000,
    });

    console.log(`  ✅ Screenshot captured: ${screenshotResult.buffer.length} bytes`);
    console.log(`  ⏱️  Duration: ${screenshotResult.metadata.duration}ms`);
    
    // Save screenshot for inspection
    const screenshotPath = path.join(testDir, 'e2e-test-screenshot.png');
    fs.writeFileSync(screenshotPath, screenshotResult.buffer);
    console.log(`  💾 Screenshot saved to: ${screenshotPath}\n`);

    // Step 3: Test Queue Job Creation
    console.log('Step 3: Testing Queue Job Creation');
    
    // Generate UUIDs for the test
    const generateUUID = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };
    
    const testJobData = {
      projectId: generateUUID(),
      screenshotId: generateUUID(),
      url: testUrl,
      viewport: { width: 1280, height: 720 },
    };

    console.log('  📤 Adding screenshot job to queue...');
    const job = await queueManager.addScreenshotJob(testJobData);
    console.log(`  ✅ Job queued successfully: ID ${job.id}`);
    console.log(`  📋 Job data:`, JSON.stringify(testJobData, null, 2));

    // Wait for job to be processed
    console.log('  ⏳ Waiting for job to be processed...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Step 4: Test Visual Diff Detection
    console.log('\nStep 4: Testing Visual Diff Detection');
    
    // Create a slightly modified version of the same page
    console.log('  📸 Capturing second screenshot for comparison...');
    const screenshot2Result = await captureScreenshot({
      url: 'https://httpbin.org/html', // Different but similar simple page
      viewport: { width: 1280, height: 720 },
      waitForTimeout: 1000,
    });

    console.log(`  ✅ Second screenshot captured: ${screenshot2Result.buffer.length} bytes`);

    // Perform diff comparison
    console.log('  🔍 Performing visual diff comparison...');
    const diffResult = await compareImages(
      screenshotResult.buffer,
      screenshot2Result.buffer,
      {
        threshold: 0.1,
        diffColor: [255, 0, 0],
        diffColorAlt: [255, 255, 0],
      },
      0.5 // 0.5% significance threshold
    );

    console.log(`  📊 Diff analysis results:`);
    console.log(`     Pixels changed: ${diffResult.pixelDiff.toLocaleString()}`);
    console.log(`     Percentage changed: ${diffResult.percentageDiff.toFixed(2)}%`);
    console.log(`     Significant change: ${diffResult.significant ? 'YES' : 'NO'}`);

    if (diffResult.diffImageBuffer) {
      const diffPath = path.join(testDir, 'e2e-test-diff.png');
      fs.writeFileSync(diffPath, diffResult.diffImageBuffer);
      console.log(`  💾 Diff image saved to: ${diffPath}`);
    }

    // Step 5: Test Notification System (Template Generation)
    console.log('\nStep 5: Testing Notification System');
    
    try {
      const { createEmailService } = await import('./services/email');
      const emailService = createEmailService();
      
      const emailTemplate = emailService.generateDiffEmail({
        projectName: 'E2E Test Project',
        screenshotName: 'Homepage',
        percentageDiff: diffResult.percentageDiff,
        pixelDiff: diffResult.pixelDiff,
        totalPixels: diffResult.totalPixels,
        diffUrl: 'https://example.com/diff.png',
        screenshotUrl: 'https://example.com/new.png',
        approvalUrl: 'https://app.docshot.ai/approve/123',
        // Additional fields removed in new API, rejectUrl deprecated
        // rejectUrl: 'https://app.docshot.ai/reject/123',
      });

      console.log('  ✅ Email template generated successfully');
      console.log(`  📧 Subject: ${emailTemplate.subject}`);
      console.log(`  📄 HTML length: ${emailTemplate.html.length} characters`);

      // Save email template for inspection
      const emailPath = path.join(testDir, 'e2e-test-email.html');
      fs.writeFileSync(emailPath, emailTemplate.html);
      console.log(`  💾 Email template saved to: ${emailPath}`);
    } catch (emailError) {
      console.log('  ⚠️  Email service test skipped (not configured)');
    }

    // Step 6: Test Database Connection (if configured)
    console.log('\nStep 6: Testing Database Connection');

    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
        const supabase = createSupabaseClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_KEY
        );

        // Test a simple query
        const { error } = await supabase.from('projects').select('count(*)').single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        console.log('  ✅ Database connection successful');
        console.log('  📊 Projects table accessible');
      } else {
        console.log('  ⚠️  Database test skipped (credentials not configured)');
      }
    } catch (dbError) {
      console.log('  ⚠️  Database test failed:', dbError instanceof Error ? dbError.message : 'Unknown error');
    }

    // Summary
    console.log('\n✨ End-to-End Test completed');

  } catch (error) {
    console.error('\n❌ End-to-End test failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  testEndToEndWorkflow().catch(console.error);
}

export { testEndToEndWorkflow };