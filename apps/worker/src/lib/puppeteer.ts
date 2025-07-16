import puppeteer, { Browser, Page } from 'puppeteer';

export interface ScreenshotOptions {
  url: string;
  selector?: string;
  viewport?: {
    width: number;
    height: number;
  };
  waitForSelector?: string;
  waitForTimeout?: number;
  fullPage?: boolean;
  hideElements?: string[];
  authentication?: {
    username: string;
    password: string;
  };
  cookies?: Array<{
    name: string;
    value: string;
    domain?: string;
    path?: string;
  }>;
  customCSS?: string;
  userAgent?: string;
}

export interface ScreenshotResult {
  buffer: Buffer;
  metadata: {
    url: string;
    timestamp: number;
    viewport: { width: number; height: number };
    fullPage: boolean;
    selector?: string;
  };
}

class ScreenshotCapture {
  private browser: Browser | null = null;
  
  async init(): Promise<void> {
    if (this.browser) return;
    
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
      ],
    });
  }
  
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
  
  private async setupPage(options: ScreenshotOptions): Promise<Page> {
    if (!this.browser) {
      throw new Error('Browser not initialized. Call init() first.');
    }
    
    const page = await this.browser.newPage();
    
    // Set user agent if provided
    if (options.userAgent) {
      await page.setUserAgent(options.userAgent);
    }
    
    // Set viewport
    const viewport = options.viewport || { width: 1920, height: 1080 };
    await page.setViewport(viewport);
    
    // Set cookies if provided
    if (options.cookies && options.cookies.length > 0) {
      await page.setCookie(...options.cookies);
    }
    
    // Add custom CSS if provided
    if (options.customCSS) {
      await page.addStyleTag({ content: options.customCSS });
    }
    
    // Hide elements if specified
    if (options.hideElements && options.hideElements.length > 0) {
      const hideCSS = options.hideElements.map(selector => 
        `${selector} { visibility: hidden !important; }`
      ).join('\n');
      await page.addStyleTag({ content: hideCSS });
    }
    
    return page;
  }
  
  async captureScreenshot(options: ScreenshotOptions): Promise<ScreenshotResult> {
    await this.init();
    
    const page = await this.setupPage(options);
    
    try {
      // Set authentication if provided
      if (options.authentication) {
        await page.authenticate(options.authentication);
      }
      
      // Navigate to URL
      await page.goto(options.url, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });
      
      // Wait for specific selector if provided
      if (options.waitForSelector) {
        await page.waitForSelector(options.waitForSelector, {
          timeout: 10000,
          visible: true
        });
      }
      
      // Additional wait if specified
      if (options.waitForTimeout) {
        await page.waitForTimeout(options.waitForTimeout);
      }
      
      // Wait for any pending animations/transitions
      await page.evaluate(() => {
        return new Promise((resolve) => {
          // Wait for any CSS transitions to complete
          setTimeout(resolve, 500);
        });
      });
      
      let screenshotBuffer: Buffer;
      const viewport = page.viewport();
      
      if (options.selector) {
        const element = await page.$(options.selector);
        if (!element) {
          throw new Error(`Element not found: ${options.selector}`);
        }
        screenshotBuffer = await element.screenshot({ 
          type: 'png',
          optimizeForSpeed: false 
        });
      } else {
        screenshotBuffer = await page.screenshot({ 
          type: 'png',
          fullPage: options.fullPage !== false,
          optimizeForSpeed: false,
        });
      }
      
      return {
        buffer: screenshotBuffer,
        metadata: {
          url: options.url,
          timestamp: Date.now(),
          viewport: viewport || { width: 1920, height: 1080 },
          fullPage: options.fullPage !== false,
          selector: options.selector,
        }
      };
    } catch (error) {
      console.error('Screenshot capture failed:', error);
      throw new Error(`Failed to capture screenshot: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      await page.close();
    }
  }
}

// Singleton instance for reusing browser
const screenshotCapture = new ScreenshotCapture();

export const captureScreenshot = async (options: ScreenshotOptions): Promise<ScreenshotResult> => {
  return screenshotCapture.captureScreenshot(options);
};

export const closeBrowser = async (): Promise<void> => {
  return screenshotCapture.close();
};

// Graceful shutdown
process.on('SIGTERM', closeBrowser);
process.on('SIGINT', closeBrowser);