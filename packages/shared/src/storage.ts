import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

export interface StorageConfig {
  bucket: string;
  region?: string;
  endpoint?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  forcePathStyle?: boolean;
}

export interface UploadOptions {
  contentType?: string;
  metadata?: Record<string, string>;
  cacheControl?: string;
  expires?: Date;
}

export interface UploadResult {
  key: string;
  url: string;
  publicUrl: string;
  size: number;
  etag: string;
  metadata?: Record<string, string>;
}

export interface StorageObject {
  key: string;
  size?: number;
  lastModified?: Date;
  etag?: string;
  contentType?: string;
  metadata?: Record<string, string>;
}

export class StorageService {
  private s3: S3Client;
  private bucket: string;
  private endpoint?: string;

  constructor(config: StorageConfig) {
    this.bucket = config.bucket;
    this.endpoint = config.endpoint;

    const s3Config: any = {
      region: config.region || 'us-east-1',
      credentials: config.accessKeyId && config.secretAccessKey ? {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      } : undefined,
    };

    if (config.endpoint) {
      s3Config.endpoint = config.endpoint;
      s3Config.forcePathStyle = config.forcePathStyle !== false;
    }

    this.s3 = new S3Client(s3Config);
  }

  /**
   * Upload a buffer or stream to S3
   */
  async upload(
    key: string, 
    body: Buffer | Uint8Array | string,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    try {
      const contentType = options.contentType || this.guessContentType(key);
      const metadata = options.metadata || {};
      
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        Metadata: metadata,
        CacheControl: options.cacheControl,
        Expires: options.expires,
      });

      const result = await this.s3.send(command);
      
      const size = Buffer.isBuffer(body) ? body.length : 
                  typeof body === 'string' ? Buffer.byteLength(body) : 
                  body.length;

      return {
        key,
        url: this.getPrivateUrl(key),
        publicUrl: this.getPublicUrl(key),
        size,
        etag: result.ETag || '',
        metadata,
      };
    } catch (error) {
      throw new Error(`Failed to upload ${key}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Upload a screenshot with optimized settings
   */
  async uploadScreenshot(
    projectId: string,
    screenshotId: string,
    imageBuffer: Buffer,
    metadata: Record<string, string> = {}
  ): Promise<UploadResult> {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const hash = this.generateFileHash(imageBuffer);
    const key = `screenshots/${projectId}/${screenshotId}/${timestamp}-${hash}.png`;

    return this.upload(key, imageBuffer, {
      contentType: 'image/png',
      metadata: {
        projectId,
        screenshotId,
        timestamp,
        hash,
        ...metadata,
      },
      cacheControl: 'public, max-age=31536000', // 1 year
    });
  }

  /**
   * Upload a diff image
   */
  async uploadDiffImage(
    projectId: string,
    screenshotId: string,
    diffBuffer: Buffer,
    metadata: Record<string, string> = {}
  ): Promise<UploadResult> {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const hash = this.generateFileHash(diffBuffer);
    const key = `diffs/${projectId}/${screenshotId}/${timestamp}-${hash}.png`;

    return this.upload(key, diffBuffer, {
      contentType: 'image/png',
      metadata: {
        projectId,
        screenshotId,
        timestamp,
        hash,
        type: 'diff',
        ...metadata,
      },
      cacheControl: 'public, max-age=86400', // 1 day
    });
  }

  /**
   * Download an object from S3
   */
  async download(key: string): Promise<Buffer> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const result = await this.s3.send(command);
      
      if (!result.Body) {
        throw new Error('No body in response');
      }

      return Buffer.from(await result.Body.transformToByteArray());
    } catch (error) {
      throw new Error(`Failed to download ${key}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete an object from S3
   */
  async delete(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.s3.send(command);
    } catch (error) {
      throw new Error(`Failed to delete ${key}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if an object exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.s3.send(command);
      return true;
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Get object metadata
   */
  async getMetadata(key: string): Promise<StorageObject | null> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const result = await this.s3.send(command);
      
      return {
        key,
        size: result.ContentLength,
        lastModified: result.LastModified,
        etag: result.ETag,
        contentType: result.ContentType,
        metadata: result.Metadata,
      };
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Generate a presigned URL for temporary access
   */
  async getPresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.s3, command, { expiresIn });
  }

  /**
   * Get public URL (for public buckets)
   */
  getPublicUrl(key: string): string {
    if (this.endpoint) {
      // MinIO or custom endpoint
      const cleanEndpoint = this.endpoint.replace(/\/$/, '');
      return `${cleanEndpoint}/${this.bucket}/${key}`;
    } else {
      // AWS S3
      return `https://${this.bucket}.s3.amazonaws.com/${key}`;
    }
  }

  /**
   * Get private URL (requires authentication)
   */
  private getPrivateUrl(key: string): string {
    if (this.endpoint) {
      const cleanEndpoint = this.endpoint.replace(/\/$/, '');
      return `${cleanEndpoint}/${this.bucket}/${key}`;
    } else {
      return `s3://${this.bucket}/${key}`;
    }
  }

  /**
   * Generate file hash for deduplication
   */
  private generateFileHash(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex').substring(0, 16);
  }

  /**
   * Guess content type from file extension
   */
  private guessContentType(key: string): string {
    const ext = key.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'pdf': 'application/pdf',
      'json': 'application/json',
      'txt': 'text/plain',
      'html': 'text/html',
      'css': 'text/css',
      'js': 'application/javascript',
    };
    
    return mimeTypes[ext || ''] || 'application/octet-stream';
  }

  /**
   * Clean up old files (useful for maintenance)
   */
  async cleanupOldFiles(prefix: string, olderThanDays: number): Promise<number> {
    // This is a simplified implementation
    // In production, you'd want to use S3's lifecycle policies
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
    
    // TODO: Implement S3 list objects and delete old files
    // For now, return 0 as a placeholder
    return 0;
  }
}

// Factory function to create storage service from environment
export function createStorageService(config?: Partial<StorageConfig>): StorageService {
  const defaultConfig: StorageConfig = {
    bucket: process.env.S3_BUCKET || 'docshot-screenshots',
    region: process.env.S3_REGION || 'us-east-1',
    endpoint: process.env.S3_ENDPOINT,
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
  };

  console.log('Creating storage service with config:', {
    bucket: defaultConfig.bucket,
    region: defaultConfig.region,
    endpoint: defaultConfig.endpoint,
    accessKeyId: defaultConfig.accessKeyId ? 'SET' : 'NOT SET',
    secretAccessKey: defaultConfig.secretAccessKey ? 'SET' : 'NOT SET',
    forcePathStyle: defaultConfig.forcePathStyle,
  });

  return new StorageService({ ...defaultConfig, ...config });
}

// Types are already exported as interfaces above