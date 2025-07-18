import puppeteer, { Browser, Page } from 'puppeteer';
import { createHash } from 'crypto';

// Dynamic popup learning system
interface PopupPattern {
  selector: string;
  confidence: number;
  domain: string;
  lastSeen: number;
  successCount: number;
  failCount: number;
}

class PopupLearner {
  private static instance: PopupLearner;
  private learnedPatterns: Map<string, PopupPattern> = new Map();
  private maxPatterns = 1000; // Prevent memory overflow
  
  static getInstance(): PopupLearner {
    if (!PopupLearner.instance) {
      PopupLearner.instance = new PopupLearner();
    }
    return PopupLearner.instance;
  }
  
  private getDomainKey(url: string): string {
    try {
      const domain = new URL(url).hostname;
      return domain.replace(/^www\./, '');
    } catch {
      return 'unknown';
    }
  }
  
  private generatePatternKey(selector: string, domain: string): string {
    return createHash('md5').update(`${domain}-${selector}`).digest('hex');
  }
  
  learnPattern(url: string, selector: string, success: boolean): void {
    const domain = this.getDomainKey(url);
    const key = this.generatePatternKey(selector, domain);
    
    const existing = this.learnedPatterns.get(key);
    if (existing) {
      if (success) {
        existing.successCount++;
        existing.confidence = Math.min(1.0, existing.confidence + 0.1);
      } else {
        existing.failCount++;
        existing.confidence = Math.max(0.0, existing.confidence - 0.05);
      }
      existing.lastSeen = Date.now();
    } else {
      // Only store if we have space
      if (this.learnedPatterns.size < this.maxPatterns) {
        this.learnedPatterns.set(key, {
          selector,
          confidence: success ? 0.7 : 0.3,
          domain,
          lastSeen: Date.now(),
          successCount: success ? 1 : 0,
          failCount: success ? 0 : 1
        });
      }
    }
    
    // Clean up old patterns periodically
    this.cleanupOldPatterns();
  }
  
  getLearnedPatterns(url: string): PopupPattern[] {
    const domain = this.getDomainKey(url);
    const patterns = Array.from(this.learnedPatterns.values())
      .filter(p => p.domain === domain && p.confidence > 0.5)
      .sort((a, b) => b.confidence - a.confidence);
    
    return patterns.slice(0, 10); // Top 10 patterns for this domain
  }
  
  private cleanupOldPatterns(): void {
    const now = Date.now();
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
    
    for (const [key, pattern] of this.learnedPatterns.entries()) {
      if (now - pattern.lastSeen > maxAge || pattern.confidence < 0.1) {
        this.learnedPatterns.delete(key);
      }
    }
  }
}

// Universal popup detection and dismissal system
async function dismissPopups(page: Page): Promise<void> {
  const timeoutPromise = new Promise<void>((resolve) => {
    setTimeout(() => {
      console.log('Popup dismissal timed out');
      resolve();
    }, 8000); // Increased timeout for better coverage
  });

  const dismissalPromise = (async () => {
    try {
      const currentUrl = page.url();
      const popupLearner = PopupLearner.getInstance();
      console.log(`Starting universal popup dismissal for URL: ${currentUrl}`);
      
      // Wait for popups to appear
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Pre-strategy: Aggressive popup removal for known problematic sites
      const domain = new URL(currentUrl).hostname.toLowerCase();
      if (domain.includes('moss-avis.no') || domain.includes('amedia.no')) {
        console.log('Applying aggressive Amedia site popup removal');
        
        // Amedia sites have specific popup patterns
        try {
          await page.evaluate(() => {
            // Remove Amedia user wrapper overlays
            document.querySelectorAll('.wrapper-amedia-user').forEach(el => el.remove());
            document.querySelectorAll('[class*="consent"], [class*="cookie"], [class*="gdpr"]').forEach(el => {
              const styles = window.getComputedStyle(el);
              const zIndex = parseInt(styles.zIndex) || 0;
              if (styles.position === 'fixed' || zIndex > 1000) {
                el.remove();
              }
            });
            
            // Remove body scroll lock
            document.body.style.overflow = 'visible';
            document.documentElement.style.overflow = 'visible';
          });
          
          // Click any visible consent buttons
          const consentButtons = await page.$$('button:visible, a:visible');
          for (const button of consentButtons) {
            const text = await button.evaluate(el => el.textContent?.toLowerCase() || '');
            if (text.includes('godta') || text.includes('aksepter') || text.includes('samtykke')) {
              try {
                await button.click();
                console.log('Clicked Amedia consent button');
                await new Promise(resolve => setTimeout(resolve, 500));
                break;
              } catch (e) {
                // Continue
              }
            }
          }
        } catch (error) {
          console.log('Error in Amedia-specific removal:', error instanceof Error ? error.message : 'Unknown error');
        }
      }

      // Strategy 0: Try learned patterns first (highest priority)
      const learnedPatterns = popupLearner.getLearnedPatterns(currentUrl);
      let dismissedCount = 0;
      
      if (learnedPatterns.length > 0) {
        console.log(`Trying ${learnedPatterns.length} learned patterns for this domain`);
        
        for (const pattern of learnedPatterns) {
          try {
            const elements = await page.$$(pattern.selector);
            for (const element of elements) {
              const isVisible = await element.isIntersectingViewport();
              if (isVisible) {
                await element.click();
                console.log(`Clicked learned pattern: ${pattern.selector} (confidence: ${pattern.confidence})`);
                
                // Verify the click actually dismissed something
                await new Promise(resolve => setTimeout(resolve, 500));
                const stillVisible = await element.isIntersectingViewport().catch(() => false);
                
                if (!stillVisible) {
                  console.log(`Successfully dismissed popup with learned pattern`);
                  popupLearner.learnPattern(currentUrl, pattern.selector, true);
                  dismissedCount++;
                } else {
                  console.log(`Learned pattern click failed - element still visible`);
                  popupLearner.learnPattern(currentUrl, pattern.selector, false);
                }
                break;
              }
            }
          } catch (error) {
            console.log(`Error with learned pattern ${pattern.selector}:`, error instanceof Error ? error.message : 'Unknown error');
            popupLearner.learnPattern(currentUrl, pattern.selector, false);
          }
        }
      }

      // Strategy 1: Intelligent popup detection by analyzing DOM structure
      const popupInfo = await page.evaluate(() => {
        const popups = [];
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        // Find high z-index elements that cover significant viewport area
        const allElements = document.querySelectorAll('*');
        for (const el of allElements) {
          const styles = window.getComputedStyle(el);
          const zIndex = parseInt(styles.zIndex) || 0;
          
          // Check for popup indicators
          const isFixed = styles.position === 'fixed';
          const isAbsolute = styles.position === 'absolute';
          const hasOverlay = styles.backgroundColor && styles.backgroundColor !== 'transparent';
          
          if (zIndex > 999 && (isFixed || isAbsolute)) {
            const rect = el.getBoundingClientRect();
            const coveragePercent = (rect.width * rect.height) / (viewportWidth * viewportHeight) * 100;
            
            // Only consider elements that cover more than 10% of viewport or are typical popup sizes
            if (coveragePercent > 10 || (rect.width > 300 && rect.height > 200)) {
              // Check if this element or its children contain typical popup content
              const text = (el as HTMLElement).innerText || '';
              const hasPopupKeywords = /cookie|consent|privacy|gdpr|accept|allow|agree|samtykke|personvern/i.test(text);
              
              popups.push({
                selector: el.tagName.toLowerCase() + (el.id ? `#${el.id}` : '') + (el.className ? `.${el.className.split(' ').filter(c => c).join('.')}` : ''),
                zIndex,
                coverage: coveragePercent,
                hasKeywords: hasPopupKeywords,
                isOverlay: hasOverlay && coveragePercent > 50
              });
            }
          }
        }
        
        // Sort by z-index (highest first) and filter for likely popups
        return popups
          .sort((a, b) => b.zIndex - a.zIndex)
          .filter(p => p.hasKeywords || p.isOverlay);
      });

      console.log(`Found ${popupInfo.length} potential popup elements`);
      if (popupInfo.length > 0) {
        console.log('Popup details:', popupInfo);
      }

      // Strategy 2: Enhanced selector-based detection
      const popupSelectors = [
        // High-priority generic selectors
        '[role="dialog"]', '[role="alertdialog"]', '[role="banner"]',
        '[aria-modal="true"]', '[data-dismiss]', '[data-close]',
        
        // Cookie/consent specific with case-insensitive matching
        '[id*="cookie" i], [class*="cookie" i], [data-testid*="cookie" i]',
        '[id*="consent" i], [class*="consent" i], [data-testid*="consent" i]',
        '[id*="gdpr" i], [class*="gdpr" i], [data-testid*="gdpr" i]',
        '[id*="privacy" i], [class*="privacy" i], [data-testid*="privacy" i]',
        
        // Norwegian terms
        '[id*="samtykke" i], [class*="samtykke" i]',
        '[id*="informasjonskapsler" i], [class*="informasjonskapsler" i]',
        '[id*="personvern" i], [class*="personvern" i]',
        
        // Common modal/overlay patterns
        '.modal, .popup, .overlay, .lightbox, .dialog',
        '.banner, .notice, .alert, .notification',
        '[class*="modal"], [class*="popup"], [class*="overlay"]',
        
        // Fixed/sticky elements that might be popups
        '[style*="position: fixed"], [style*="position: sticky"]',
        
        // Common framework patterns
        '.ReactModal__Content', '.MuiDialog-root', '.ant-modal',
        '.v-dialog', '.el-dialog', '.p-dialog',
        
        // Site-specific patterns (dynamic)
        ...popupInfo.map(p => p.selector)
      ];

      // Strategy 3: Find clickable elements within popups
      const maxDismissals = 5; // Prevent infinite loops
      
      for (const selector of popupSelectors) {
        if (dismissedCount >= maxDismissals) break;
        
        try {
          const elements = await page.$$(selector);
          for (const element of elements) {
            const isVisible = await element.isIntersectingViewport();
            if (!isVisible) continue;
            
            // Find clickable elements within this popup
            const clickableElements = await element.$$('button, a, [role="button"], [onclick], [data-dismiss], [data-close], .close, .dismiss');
            
            for (const clickable of clickableElements) {
              const text = await clickable.evaluate(el => el.textContent?.toLowerCase().trim() || '');
              const ariaLabel = await clickable.evaluate(el => el.getAttribute('aria-label')?.toLowerCase() || '');
              
              // Check if this looks like a dismiss button
              const dismissPatterns = [
                'accept', 'allow', 'agree', 'ok', 'close', 'dismiss', 'continue', 'got it',
                'godta', 'aksepter', 'tillat', 'lukk', 'skjul', 'fortsett', 'greit',
                'jeg forstår', 'jeg godtar', 'jeg aksepterer', 'forstått',
                'allow all', 'accept all', 'agree all', 'enable all',
                'save', 'confirm', 'understand', 'proceed', '×', '✕', 'x'
              ];
              
              const shouldClick = dismissPatterns.some(pattern => 
                text.includes(pattern) || ariaLabel.includes(pattern)
              );
              
              if (shouldClick) {
                try {
                  await clickable.click();
                  console.log(`Clicked dismissal button: "${text}" (${ariaLabel})`);
                  
                  // Learn this successful pattern
                  const clickableSelector = await clickable.evaluate(el => {
                    const tag = el.tagName.toLowerCase();
                    const id = el.id ? `#${el.id}` : '';
                    const classes = el.className ? `.${el.className.split(' ').join('.')}` : '';
                    return tag + id + classes;
                  });
                  popupLearner.learnPattern(currentUrl, clickableSelector, true);
                  
                  dismissedCount++;
                  await new Promise(resolve => setTimeout(resolve, 800));
                  break;
                } catch (clickError) {
                  // Continue to next clickable element
                }
              }
            }
            
            if (dismissedCount > 0) break;
          }
        } catch (error) {
          // Continue to next selector
        }
      }

      // Strategy 4: Global text-based dismissal
      if (dismissedCount === 0) {
        const textBasedDismissal = await page.evaluate(() => {
          const clickableElements = document.querySelectorAll('button, a, span, div, [role="button"], [onclick]');
          const dismissTexts = [
            'godta', 'aksepter', 'tillat', 'ok', 'lukk', 'skjul', 'fortsett',
            'accept', 'allow', 'agree', 'close', 'dismiss', 'got it', 'continue',
            'samtykke', 'informasjonskapsler', 'personvern', 'jeg forstår',
            'greit', 'skjønner', 'forstått', 'jeg aksepterer', 'jeg godtar',
            'understood', 'accept all', 'allow all', 'agree all', 'enable all',
            'save preferences', 'confirm', 'proceed', 'save', 'lagre', 'bekreft'
          ];
          
          let clickedElement = null;
          for (const element of clickableElements) {
            if (clickedElement) break;
            
            const text = element.textContent?.toLowerCase().trim();
            const ariaLabel = element.getAttribute('aria-label')?.toLowerCase();
            
            if (text && dismissTexts.some(dismissText => text.includes(dismissText))) {
              const rect = element.getBoundingClientRect();
              if (rect.width > 0 && rect.height > 0) {
                (element as HTMLElement).click();
                console.log(`Text-based dismissal clicked: "${text}"`);
                clickedElement = element;
                break;
              }
            }
            
            if (ariaLabel && dismissTexts.some(dismissText => ariaLabel.includes(dismissText))) {
              const rect = element.getBoundingClientRect();
              if (rect.width > 0 && rect.height > 0) {
                (element as HTMLElement).click();
                console.log(`Aria-label dismissal clicked: "${ariaLabel}"`);
                clickedElement = element;
                break;
              }
            }
          }
          
          if (clickedElement) {
            // Return selector for learning
            const tag = clickedElement.tagName.toLowerCase();
            const id = clickedElement.id ? `#${clickedElement.id}` : '';
            const classes = clickedElement.className ? `.${clickedElement.className.split(' ').join('.')}` : '';
            return tag + id + classes;
          }
          
          return null;
        });
        
        if (textBasedDismissal) {
          // Learn this successful pattern
          popupLearner.learnPattern(currentUrl, textBasedDismissal, true);
          dismissedCount++;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Strategy 5: Escape key simulation
      try {
        await page.keyboard.press('Escape');
        console.log('Escape key pressed to dismiss popups');
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        // Ignore escape key errors
      }

      // Strategy 6: Enhanced CSS hiding for persistent popups
      await page.addStyleTag({
        content: `
          /* Universal popup hiding */
          [id*="cookie" i], [class*="cookie" i], [data-testid*="cookie" i],
          [id*="consent" i], [class*="consent" i], [data-testid*="consent" i],
          [id*="gdpr" i], [class*="gdpr" i], [data-testid*="gdpr" i],
          [id*="privacy" i], [class*="privacy" i], [data-testid*="privacy" i],
          [id*="samtykke" i], [class*="samtykke" i],
          [id*="informasjonskapsler" i], [class*="informasjonskapsler" i],
          [id*="personvern" i], [class*="personvern" i],
          .cookie-banner, .consent-banner, .gdpr-banner, .privacy-banner,
          .cookie-notice, .consent-notice, .gdpr-notice, .privacy-notice,
          .cookie-popup, .consent-popup, .gdpr-popup, .privacy-popup,
          .cookie-modal, .consent-modal, .gdpr-modal, .privacy-modal,
          .cookie-overlay, .consent-overlay, .gdpr-overlay, .privacy-overlay,
          .wrapper-amedia-user, .amedia-consent, .amedia-gdpr {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            position: absolute !important;
            left: -9999px !important;
          }
          
          /* High z-index overlay hiding */
          div[style*="z-index"][style*="position: fixed"],
          div[style*="z-index: 9"],
          div[style*="z-index: 10"],
          div[style*="z-index: 99"],
          div[style*="z-index: 100"],
          div[style*="z-index: 999"],
          div[style*="z-index: 1000"],
          div[style*="z-index: 9999"],
          div[style*="z-index: 10000"],
          div[style*="z-index: 99999"],
          div[style*="z-index: 100000"],
          div[style*="z-index: 999999"],
          div[style*="z-index: 1000000"] {
            display: none !important;
          }
          
          /* Body overflow restoration */
          body, html {
            overflow: visible !important;
            overflow-y: scroll !important;
            position: static !important;
          }
          
          /* Backdrop and overlay hiding */
          .modal-backdrop, .popup-backdrop, .overlay-backdrop,
          [class*="backdrop"], [class*="overlay"],
          .blackout, .fade-in, .fade {
            display: none !important;
          }
          
          /* Remove any element that might be blocking interaction */
          div[style*="position: fixed"][style*="top: 0"][style*="left: 0"][style*="right: 0"][style*="bottom: 0"] {
            display: none !important;
          }
        `
      });

      console.log(`Universal popup dismissal completed. Dismissed ${dismissedCount} popups.`);
      
    } catch (error) {
      console.log('Error in universal popup dismissal:', error);
      // Don't throw - continue with screenshot even if popup dismissal fails
    }
  })();

  // Race between dismissal and timeout
  await Promise.race([dismissalPromise, timeoutPromise]);
}

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

      if (!response.ok() && response.status() !== 304) {
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

      // Dismiss common popups/consent banners
      console.log('Dismissing popups and consent banners...');
      await dismissPopups(page);
      console.log('Popup dismissal finished, continuing with screenshot...');

      // Scroll to top to ensure consistent screenshots
      await page.evaluate(() => {
        window.scrollTo(0, 0);
      });

      let screenshotBuffer: Buffer;
      const viewport = page.viewport();

      if (options.selector) {
        console.log(`Taking element screenshot of: ${options.selector}`);
        
        // Wait for element to be available
        try {
          await page.waitForSelector(options.selector, {
            timeout: 5000,
            visible: true,
          });
        } catch (error) {
          console.log(`Element ${options.selector} not found, falling back to full page screenshot`);
          // Fall back to full page screenshot instead of failing
          screenshotBuffer = await page.screenshot({
            type: 'png',
            fullPage: options.fullPage !== false,
            optimizeForSpeed: false,
          });
          
          return {
            buffer: screenshotBuffer,
            metadata: {
              url: options.url,
              timestamp: Date.now(),
              viewport: viewport || { width: 1920, height: 1080 },
              fullPage: options.fullPage !== false,
              selector: options.selector,
              duration: Date.now() - startTime,
              size: screenshotBuffer.length,
            },
          };
        }
        
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
