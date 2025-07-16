import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import fetch from 'node-fetch';

export interface DiffOptions {
  threshold?: number; // 0-1, default 0.1
  includeAA?: boolean; // include anti-aliasing, default false
  alpha?: number; // blending factor of unchanged pixels, default 0.1
  aaColor?: [number, number, number]; // color of anti-aliased pixels
  diffColor?: [number, number, number]; // color of different pixels
  diffColorAlt?: [number, number, number]; // alternative color to highlight large differences
}

export interface DiffResult {
  pixelDiff: number;
  totalPixels: number;
  percentageDiff: number;
  diffImageBuffer?: Buffer;
  dimensions: {
    width: number;
    height: number;
  };
  significant: boolean; // true if diff is above significance threshold
}

export interface ComparisonMetadata {
  currentImageHash?: string;
  previousImageHash?: string;
  analysisTimestamp: number;
  processingTimeMs: number;
}

class ImageDiffAnalyzer {
  private defaultOptions: Required<DiffOptions> = {
    threshold: 0.1,
    includeAA: false,
    alpha: 0.1,
    aaColor: [255, 255, 0], // yellow
    diffColor: [255, 0, 0], // red
    diffColorAlt: [0, 255, 0], // green
  };

  async fetchImageBuffer(imageUrl: string): Promise<Buffer> {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }
      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      throw new Error(
        `Error fetching image from ${imageUrl}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async loadPNG(buffer: Buffer): Promise<PNG> {
    return new Promise((resolve, reject) => {
      const png = new PNG();
      png.parse(buffer, (error, data) => {
        if (error) {
          reject(new Error(`Failed to parse PNG: ${error.message}`));
        } else {
          resolve(data);
        }
      });
    });
  }

  async bufferToPNG(buffer: Buffer): Promise<PNG> {
    return this.loadPNG(buffer);
  }

  async pngToBuffer(png: PNG): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const buffers: Buffer[] = [];
      png
        .pack()
        .on('data', (chunk) => buffers.push(chunk))
        .on('end', () => resolve(Buffer.concat(buffers)))
        .on('error', reject);
    });
  }

  private ensureSameDimensions(img1: PNG, img2: PNG): [PNG, PNG] {
    const maxWidth = Math.max(img1.width, img2.width);
    const maxHeight = Math.max(img1.height, img2.height);

    if (img1.width !== maxWidth || img1.height !== maxHeight) {
      const newImg1 = new PNG({ width: maxWidth, height: maxHeight });
      PNG.bitblt(img1, newImg1, 0, 0, img1.width, img1.height, 0, 0);
      img1 = newImg1;
    }

    if (img2.width !== maxWidth || img2.height !== maxHeight) {
      const newImg2 = new PNG({ width: maxWidth, height: maxHeight });
      PNG.bitblt(img2, newImg2, 0, 0, img2.width, img2.height, 0, 0);
      img2 = newImg2;
    }

    return [img1, img2];
  }

  async compareImages(
    currentImageBuffer: Buffer,
    previousImageBuffer: Buffer,
    options: DiffOptions = {},
    significanceThreshold: number = 0.1
  ): Promise<DiffResult> {
    const startTime = Date.now();
    const opts = { ...this.defaultOptions, ...options };

    try {
      // Load PNG images
      let currentPNG = await this.bufferToPNG(currentImageBuffer);
      let previousPNG = await this.bufferToPNG(previousImageBuffer);

      // Ensure same dimensions by padding smaller image
      [previousPNG, currentPNG] = this.ensureSameDimensions(previousPNG, currentPNG);

      const { width, height } = currentPNG;
      const totalPixels = width * height;

      // Create diff image
      const diffPNG = new PNG({ width, height });

      // Perform pixel comparison
      const pixelDiff = pixelmatch(previousPNG.data, currentPNG.data, diffPNG.data, width, height, {
        threshold: opts.threshold,
        includeAA: opts.includeAA,
        alpha: opts.alpha,
        aaColor: opts.aaColor,
        diffColor: opts.diffColor,
        diffColorAlt: opts.diffColorAlt,
      });

      const percentageDiff = (pixelDiff / totalPixels) * 100;
      const significant = percentageDiff > significanceThreshold;

      // Convert diff image to buffer
      const diffImageBuffer = await this.pngToBuffer(diffPNG);

      const processingTime = Date.now() - startTime;

      return {
        pixelDiff,
        totalPixels,
        percentageDiff,
        diffImageBuffer,
        dimensions: { width, height },
        significant,
      };
    } catch (error) {
      throw new Error(
        `Image comparison failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async compareImageUrls(
    currentImageUrl: string,
    previousImageUrl: string,
    options: DiffOptions = {},
    significanceThreshold: number = 0.1
  ): Promise<DiffResult> {
    try {
      const [currentBuffer, previousBuffer] = await Promise.all([
        this.fetchImageBuffer(currentImageUrl),
        this.fetchImageBuffer(previousImageUrl),
      ]);

      return this.compareImages(currentBuffer, previousBuffer, options, significanceThreshold);
    } catch (error) {
      throw new Error(
        `URL comparison failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Utility method to create a hash for image buffers
  createImageHash(buffer: Buffer): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  // Advanced diff with region analysis
  async analyzeRegions(
    currentImageBuffer: Buffer,
    previousImageBuffer: Buffer,
    options: DiffOptions = {}
  ): Promise<{
    diff: DiffResult;
    regions: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
      significance: number;
    }>;
  }> {
    const diff = await this.compareImages(currentImageBuffer, previousImageBuffer, options);

    // TODO: Implement region detection algorithm
    // This would analyze the diff image to find contiguous regions of difference
    const regions: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
      significance: number;
    }> = [];

    return { diff, regions };
  }
}

// Singleton instance
const diffAnalyzer = new ImageDiffAnalyzer();

// Export convenience functions
export const compareImages = async (
  currentImageBuffer: Buffer,
  previousImageBuffer: Buffer,
  options?: DiffOptions,
  significanceThreshold?: number
): Promise<DiffResult> => {
  return diffAnalyzer.compareImages(
    currentImageBuffer,
    previousImageBuffer,
    options,
    significanceThreshold
  );
};

export const compareImageUrls = async (
  currentImageUrl: string,
  previousImageUrl: string,
  options?: DiffOptions,
  significanceThreshold?: number
): Promise<DiffResult> => {
  return diffAnalyzer.compareImageUrls(
    currentImageUrl,
    previousImageUrl,
    options,
    significanceThreshold
  );
};

export const createImageHash = (buffer: Buffer): string => {
  return diffAnalyzer.createImageHash(buffer);
};

export { ImageDiffAnalyzer };
