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
    duration?: number;
    size?: number;
  };
}

class ScreenshotCapture {
  private browser: Browser | null = null;

  async init(): Promise<void> {
    if (this.browser) return;

    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
      ],
      timeout: 60000,
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
      const hideCSS = options.hideElements
        .map((selector) => `${selector} { visibility: hidden !important; }`)
        .join('\n');
      await page.addStyleTag({ content: hideCSS });
    }

    return page;
  }

  async captureScreenshot(options: ScreenshotOptions): Promise<ScreenshotResult> {
    await this.init();

    const page = await this.setupPage(options);
    const startTime = Date.now();

    try {
      console.log(`Starting screenshot capture for: ${options.url}`);

      // Set authentication if provided
      if (options.authentication) {
        console.log('Setting authentication...');
        await page.authenticate(options.authentication);
      }

      // Navigate to URL with comprehensive error handling
      console.log(`Navigating to: ${options.url}`);
      const response = await page.goto(options.url, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });

      if (!response) {
        throw new Error('Failed to get response from URL');
      }

      if (!response.ok()) {
        throw new Error(`HTTP ${response.status()}: ${response.statusText()}`);
      }

      console.log(`Page loaded successfully (${response.status()})`);

      // Wait for specific selector if provided
      if (options.waitForSelector) {
        console.log(`Waiting for selector: ${options.waitForSelector}`);
        await page.waitForSelector(options.waitForSelector, {
          timeout: 10000,
          visible: true,
        });
      }

      // Additional wait if specified
      if (options.waitForTimeout) {
        console.log(`Additional wait: ${options.waitForTimeout}ms`);
        await new Promise((resolve) => setTimeout(resolve, options.waitForTimeout));
      }

      // Wait for any pending animations/transitions
      console.log('Waiting for page stabilization...');
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Scroll to top to ensure consistent screenshots
      await page.evaluate(() => {
        window.scrollTo(0, 0);
      });

      let screenshotBuffer: Buffer;
      const viewport = page.viewport();

      if (options.selector) {
        console.log(`Taking element screenshot of: ${options.selector}`);
        const element = await page.$(options.selector);
        if (!element) {
          throw new Error(`Element not found: ${options.selector}`);
        }

        // Scroll element into view
        await element.scrollIntoView();
        await new Promise((resolve) => setTimeout(resolve, 200)); // Brief wait after scroll

        screenshotBuffer = await element.screenshot({
          type: 'png',
          optimizeForSpeed: false,
        });
      } else {
        console.log('Taking full page screenshot...');
        screenshotBuffer = await page.screenshot({
          type: 'png',
          fullPage: options.fullPage !== false,
          optimizeForSpeed: false,
        });
      }

      const duration = Date.now() - startTime;
      console.log(
        `Screenshot captured successfully in ${duration}ms, size: ${screenshotBuffer.length} bytes`
      );

      return {
        buffer: screenshotBuffer,
        metadata: {
          url: options.url,
          timestamp: Date.now(),
          viewport: viewport || { width: 1920, height: 1080 },
          fullPage: options.fullPage !== false,
          selector: options.selector,
          duration,
          size: screenshotBuffer.length,
        },
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`Screenshot capture failed after ${duration}ms:`, error);

      // Enhanced error context
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;

        // Add context for common errors
        if (error.message.includes('net::ERR_')) {
          errorMessage = `Network error: ${error.message}`;
        } else if (error.message.includes('timeout')) {
          errorMessage = `Timeout error: ${error.message}`;
        } else if (error.message.includes('Element not found')) {
          errorMessage = `Element not found: ${options.selector}`;
        }
      }

      throw new Error(`Failed to capture screenshot of ${options.url}: ${errorMessage}`);
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
