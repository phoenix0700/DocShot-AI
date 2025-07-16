#!/usr/bin/env tsx

// Test script to verify visual diff functionality
import { compareImages, compareImageUrls } from './lib/pixelmatch';
import { captureScreenshot } from './lib/puppeteer';
import * as fs from 'fs';
import * as path from 'path';

async function testVisualDiff() {
  console.log('🧪 Testing visual diff functionality...\n');
  
  try {
    const testDir = path.join(__dirname, '../test-output');
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    
    // Create two slightly different HTML files for comparison
    const htmlContent1 = `
<!DOCTYPE html>
<html>
<head>
    <title>DocShot AI Diff Test - Version 1</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
        }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: rgba(255, 255, 255, 0.3); padding: 15px; border-radius: 5px; }
        .content { background: rgba(255, 255, 255, 0.2); padding: 20px; margin: 20px 0; border-radius: 8px; }
        .button { background: #ff6b6b; color: white; padding: 10px 20px; border: none; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 DocShot AI - Version 1</h1>
        </div>
        <div class="content">
            <h2>✅ Original Content</h2>
            <p>This is the original version of the page for diff testing.</p>
            <button class="button">Click Me</button>
        </div>
    </div>
</body>
</html>`;

    const htmlContent2 = `
<!DOCTYPE html>
<html>
<head>
    <title>DocShot AI Diff Test - Version 2</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
        }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: rgba(255, 255, 255, 0.3); padding: 15px; border-radius: 5px; }
        .content { background: rgba(255, 255, 255, 0.2); padding: 20px; margin: 20px 0; border-radius: 8px; }
        .button { background: #4ecdc4; color: white; padding: 15px 25px; border: none; border-radius: 8px; }
        .new-section { background: rgba(255, 255, 255, 0.15); padding: 15px; margin: 15px 0; border-radius: 6px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 DocShot AI - Version 2</h1>
        </div>
        <div class="content">
            <h2>🔄 Modified Content</h2>
            <p>This version has been modified to test visual diff detection.</p>
            <button class="button">Updated Button</button>
        </div>
        <div class="new-section">
            <h3>🆕 New Section</h3>
            <p>This is a completely new section added to the page.</p>
        </div>
    </div>
</body>
</html>`;
    
    const htmlFile1 = path.join(testDir, 'test-v1.html');
    const htmlFile2 = path.join(testDir, 'test-v2.html');
    fs.writeFileSync(htmlFile1, htmlContent1);
    fs.writeFileSync(htmlFile2, htmlContent2);
    
    // Test 1: Capture screenshots of both versions
    console.log('Test 1: Capturing screenshots of both versions');
    const screenshot1 = await captureScreenshot({
      url: `file://${htmlFile1}`,
      viewport: { width: 1280, height: 720 },
      waitForTimeout: 500,
    });
    
    const screenshot2 = await captureScreenshot({
      url: `file://${htmlFile2}`,
      viewport: { width: 1280, height: 720 },
      waitForTimeout: 500,
    });
    
    // Save individual screenshots
    fs.writeFileSync(path.join(testDir, 'diff-v1.png'), screenshot1.buffer);
    fs.writeFileSync(path.join(testDir, 'diff-v2.png'), screenshot2.buffer);
    
    console.log(`✅ Screenshots captured:`);
    console.log(`   Version 1: ${screenshot1.buffer.length} bytes`);
    console.log(`   Version 2: ${screenshot2.buffer.length} bytes\n`);
    
    // Test 2: Compare the two screenshots
    console.log('Test 2: Visual diff comparison');
    const diffResult = await compareImages(
      screenshot1.buffer,
      screenshot2.buffer,
      {
        threshold: 0.1,
        diffColor: [255, 0, 0], // Red for differences
        diffColorAlt: [255, 255, 0], // Yellow for anti-aliasing
      },
      0.5 // 0.5% significance threshold
    );
    
    console.log(`✅ Diff analysis complete:`);
    console.log(`   Pixels changed: ${diffResult.pixelDiff.toLocaleString()}`);
    console.log(`   Total pixels: ${diffResult.totalPixels.toLocaleString()}`);
    console.log(`   Percentage changed: ${diffResult.percentageDiff.toFixed(2)}%`);
    console.log(`   Significant change: ${diffResult.significant ? 'YES' : 'NO'}`);
    console.log(`   Image dimensions: ${diffResult.dimensions.width}x${diffResult.dimensions.height}\n`);
    
    // Save diff image
    if (diffResult.diffImageBuffer) {
      fs.writeFileSync(path.join(testDir, 'diff-comparison.png'), diffResult.diffImageBuffer);
      console.log(`📁 Diff image saved: ${path.join(testDir, 'diff-comparison.png')}\n`);
    }
    
    // Test 3: Test identical images (no diff)
    console.log('Test 3: Comparing identical images');
    const identicalDiff = await compareImages(
      screenshot1.buffer,
      screenshot1.buffer,
      { threshold: 0.1 },
      0.1
    );
    
    console.log(`✅ Identical comparison:`);
    console.log(`   Pixels changed: ${identicalDiff.pixelDiff}`);
    console.log(`   Percentage changed: ${identicalDiff.percentageDiff.toFixed(2)}%`);
    console.log(`   Significant change: ${identicalDiff.significant ? 'YES' : 'NO'}\n`);
    
    // Test 4: Test with different thresholds
    console.log('Test 4: Testing different sensitivity thresholds');
    const sensitiveThresholds = [0.1, 0.5, 1.0, 2.0];
    
    for (const threshold of sensitiveThresholds) {
      const thresholdResult = await compareImages(
        screenshot1.buffer,
        screenshot2.buffer,
        { threshold: 0.1 },
        threshold
      );
      
      console.log(`   ${threshold}% threshold: ${thresholdResult.significant ? 'SIGNIFICANT' : 'not significant'} (${thresholdResult.percentageDiff.toFixed(2)}%)`);
    }
    
    console.log('\n🎉 All visual diff tests completed successfully!');
    console.log(`📂 Test files saved in: ${testDir}`);
    
    // Summary
    console.log('\n📊 Test Summary:');
    console.log(`├── Version 1 screenshot: ${(screenshot1.buffer.length / 1024).toFixed(1)} KB`);
    console.log(`├── Version 2 screenshot: ${(screenshot2.buffer.length / 1024).toFixed(1)} KB`);
    console.log(`├── Diff analysis: ${diffResult.percentageDiff.toFixed(2)}% changed`);
    console.log(`├── Change significance: ${diffResult.significant ? '🔴 SIGNIFICANT' : '🟢 Minor'}`);
    console.log(`└── Diff image: ${diffResult.diffImageBuffer ? (diffResult.diffImageBuffer.length / 1024).toFixed(1) + ' KB' : 'N/A'}`);
    
  } catch (error) {
    console.error('❌ Visual diff test failed:', error);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testVisualDiff().catch(console.error);
}

export { testVisualDiff };