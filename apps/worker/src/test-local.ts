#!/usr/bin/env tsx

// Simple local test to verify Puppeteer setup without internet
import { captureScreenshot } from './lib/puppeteer';
import * as fs from 'fs';
import * as path from 'path';

async function testLocalScreenshot() {
  console.log('🧪 Testing screenshot capture with local HTML...\n');

  try {
    // Create a simple local HTML file
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>DocShot AI Test</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
        }
        .container { 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
        }
        h1 { color: #fff; text-align: center; }
        .feature { 
            background: rgba(255, 255, 255, 0.2); 
            padding: 20px; 
            margin: 20px 0; 
            border-radius: 8px;
        }
        .header { background: rgba(255, 255, 255, 0.3); padding: 15px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 DocShot AI - Screenshot Testing</h1>
    </div>
    <div class="container">
        <div class="feature">
            <h2>✅ Puppeteer Integration</h2>
            <p>Successfully capturing screenshots with headless Chrome</p>
        </div>
        <div class="feature">
            <h2>📸 Element Selection</h2>
            <p>Can target specific elements using CSS selectors</p>
        </div>
        <div class="feature">
            <h2>🎯 Viewport Control</h2>
            <p>Configurable screen resolutions and device emulation</p>
        </div>
    </div>
</body>
</html>`;

    const testDir = path.join(__dirname, '../test-output');
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    const htmlFile = path.join(testDir, 'test.html');
    fs.writeFileSync(htmlFile, htmlContent);

    // Test 1: Full page screenshot
    console.log('Test 1: Full page screenshot');
    const result1 = await captureScreenshot({
      url: `file://${htmlFile}`,
      viewport: { width: 1280, height: 720 },
      waitForTimeout: 500,
    });

    console.log(`✅ Full page screenshot captured!`);
    console.log(`   Size: ${result1.buffer.length} bytes`);
    console.log(`   Duration: ${result1.metadata.duration}ms\n`);

    const screenshot1 = path.join(testDir, 'test-fullpage.png');
    fs.writeFileSync(screenshot1, result1.buffer);
    console.log(`📁 Screenshot saved: ${screenshot1}\n`);

    // Test 2: Element screenshot
    console.log('Test 2: Element screenshot (header)');
    const result2 = await captureScreenshot({
      url: `file://${htmlFile}`,
      selector: '.header',
      viewport: { width: 1280, height: 720 },
      waitForTimeout: 500,
    });

    console.log(`✅ Element screenshot captured!`);
    console.log(`   Size: ${result2.buffer.length} bytes`);
    console.log(`   Duration: ${result2.metadata.duration}ms`);
    console.log(`   Selector: ${result2.metadata.selector}\n`);

    const screenshot2 = path.join(testDir, 'test-header.png');
    fs.writeFileSync(screenshot2, result2.buffer);
    console.log(`📁 Element screenshot saved: ${screenshot2}\n`);

    // Test 3: Different viewport
    console.log('Test 3: Mobile viewport screenshot');
    const result3 = await captureScreenshot({
      url: `file://${htmlFile}`,
      viewport: { width: 375, height: 667 }, // iPhone size
      waitForTimeout: 500,
    });

    console.log(`✅ Mobile screenshot captured!`);
    console.log(`   Size: ${result3.buffer.length} bytes`);
    console.log(
      `   Viewport: ${result3.metadata.viewport.width}x${result3.metadata.viewport.height}\n`
    );

    const screenshot3 = path.join(testDir, 'test-mobile.png');
    fs.writeFileSync(screenshot3, result3.buffer);
    console.log(`📁 Mobile screenshot saved: ${screenshot3}\n`);

    console.log('🎉 All local screenshot tests passed!');
    console.log(`📂 Test files saved in: ${testDir}`);
  } catch (error) {
    console.error('❌ Screenshot test failed:', error);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testLocalScreenshot().catch(console.error);
}

export { testLocalScreenshot };
