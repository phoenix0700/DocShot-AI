#!/usr/bin/env tsx

// Simple test script to verify screenshot capture functionality
import { captureScreenshot } from './lib/puppeteer';
import { createStorageService } from '@docshot/shared';
import * as fs from 'fs';
import * as path from 'path';

async function testScreenshot() {
  console.log('🧪 Testing screenshot capture functionality...\n');

  try {
    // Test 1: Basic screenshot of a simple website
    console.log('Test 1: Capturing screenshot of example.com');
    const result1 = await captureScreenshot({
      url: 'https://example.com',
      viewport: { width: 1280, height: 720 },
    });

    console.log(`✅ Screenshot captured successfully!`);
    console.log(`   Size: ${result1.buffer.length} bytes`);
    console.log(`   Duration: ${result1.metadata.duration}ms`);
    console.log(
      `   Viewport: ${result1.metadata.viewport.width}x${result1.metadata.viewport.height}\n`
    );

    // Save to local file for inspection
    const outputDir = path.join(__dirname, '../test-output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const filename1 = path.join(outputDir, 'test-example-com.png');
    fs.writeFileSync(filename1, result1.buffer);
    console.log(`📁 Screenshot saved to: ${filename1}\n`);

    // Test 2: Screenshot with element selector
    console.log('Test 2: Capturing element screenshot from GitHub');
    const result2 = await captureScreenshot({
      url: 'https://github.com',
      selector: 'header',
      viewport: { width: 1280, height: 720 },
    });

    console.log(`✅ Element screenshot captured successfully!`);
    console.log(`   Size: ${result2.buffer.length} bytes`);
    console.log(`   Duration: ${result2.metadata.duration}ms`);
    console.log(`   Selector: ${result2.metadata.selector}\n`);

    const filename2 = path.join(outputDir, 'test-github-header.png');
    fs.writeFileSync(filename2, result2.buffer);
    console.log(`📁 Element screenshot saved to: ${filename2}\n`);

    // Test 3: Test storage upload (if configured)
    try {
      console.log('Test 3: Testing storage upload...');
      const storage = createStorageService();
      const uploadResult = await storage.uploadScreenshot(
        'test-project',
        'test-screenshot',
        result1.buffer,
        {
          url: 'https://example.com',
          selector: '',
          viewport: JSON.stringify(result1.metadata.viewport),
          timestamp: Date.now().toString(),
        }
      );

      console.log(`✅ Storage upload successful!`);
      console.log(`   Key: ${uploadResult.key}`);
      console.log(`   Public URL: ${uploadResult.publicUrl}\n`);
    } catch (storageError) {
      console.log(
        `⚠️  Storage test skipped (not configured):`,
        storageError instanceof Error ? storageError.message : 'Unknown error'
      );
    }

    console.log('🎉 All screenshot tests passed successfully!');
  } catch (error) {
    console.error('❌ Screenshot test failed:', error);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testScreenshot().catch(console.error);
}

export { testScreenshot };
