import { Queue } from 'bullmq';
import Redis from 'ioredis';
import { z } from 'zod';
import { ScreenshotJobDataSchema, DiffJobDataSchema, NotificationJobDataSchema } from './schemas';

export interface QueueConfig {
  redis: {
    host?: string;
    port?: number;
    password?: string;
    db?: number;
    url?: string;
  };
  defaultJobOptions?: any;
}

export class QueueManager {
  private redis: Redis;
  private queues: Map<string, Queue> = new Map();
  private defaultJobOptions: any;

  constructor(config: QueueConfig) {
    this.redis = config.redis.url
      ? new Redis(config.redis.url)
      : new Redis({
          host: config.redis.host || 'localhost',
          port: config.redis.port || 6379,
          password: config.redis.password,
          db: config.redis.db || 0,
        });

    this.defaultJobOptions = {
      removeOnComplete: 100,
      removeOnFail: 50,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
      ...config.defaultJobOptions,
    };
  }

  private getQueue(name: string, options?: any): Queue {
    if (!this.queues.has(name)) {
      const queue = new Queue(name, {
        connection: this.redis,
        defaultJobOptions: this.defaultJobOptions,
        ...options,
      });
      this.queues.set(name, queue);
    }
    return this.queues.get(name)!;
  }

  // Screenshot queue methods
  async addScreenshotJob(data: z.infer<typeof ScreenshotJobDataSchema>, options?: any) {
    const validatedData = ScreenshotJobDataSchema.parse(data);
    const queue = this.getQueue('screenshot');

    return queue.add('capture', validatedData, {
      ...options,
      jobId: `screenshot-${validatedData.screenshotId}-${Date.now()}`,
      delay: options?.delay || 0,
    });
  }

  async addBulkScreenshotJobs(
    jobs: Array<{
      data: z.infer<typeof ScreenshotJobDataSchema>;
      options?: any;
    }>
  ) {
    const queue = this.getQueue('screenshot');

    const bulkJobs = jobs.map(({ data, options }) => ({
      name: 'capture',
      data: ScreenshotJobDataSchema.parse(data),
      opts: {
        ...options,
        jobId: `screenshot-${data.screenshotId}`,
      },
    }));

    return queue.addBulk(bulkJobs);
  }

  // Diff queue methods
  async addDiffJob(data: z.infer<typeof DiffJobDataSchema>, options?: any) {
    const validatedData = DiffJobDataSchema.parse(data);
    const queue = this.getQueue('diff');

    return queue.add('compare', validatedData, {
      ...options,
      jobId: `diff-${validatedData.screenshotId}`,
    });
  }

  // Notification queue methods
  async addNotificationJob(data: z.infer<typeof NotificationJobDataSchema>, options?: any) {
    const validatedData = NotificationJobDataSchema.parse(data);
    const queue = this.getQueue('notification');

    return queue.add('send', validatedData, {
      ...options,
      jobId: `notification-${validatedData.screenshotId}-${Date.now()}`,
    });
  }

  // Scheduled jobs
  async scheduleScreenshotJobs(
    projectId: string,
    screenshots: Array<{
      id: string;
      url: string;
      selector?: string;
      viewport?: { width: number; height: number };
      schedule?: string; // cron expression
    }>
  ) {
    const queue = this.getQueue('screenshot');

    for (const screenshot of screenshots) {
      if (screenshot.schedule) {
        await queue.add(
          'capture',
          ScreenshotJobDataSchema.parse({
            projectId,
            screenshotId: screenshot.id,
            url: screenshot.url,
            selector: screenshot.selector,
            viewport: screenshot.viewport,
          }),
          {
            repeat: { pattern: screenshot.schedule },
            jobId: `scheduled-screenshot-${screenshot.id}`,
          }
        );
      }
    }
  }

  // Queue management
  async removeScheduledJob(jobId: string, queueName: string = 'screenshot') {
    const queue = this.getQueue(queueName);
    const repeatableJobs = await queue.getRepeatableJobs();

    const job = repeatableJobs.find((j) => j.id === jobId);
    if (job) {
      await queue.removeRepeatableByKey(job.key);
    }
  }

  async getQueueStatus(queueName: string) {
    const queue = this.getQueue(queueName);

    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaiting(),
      queue.getActive(),
      queue.getCompleted(),
      queue.getFailed(),
      queue.getDelayed(),
    ]);

    return {
      name: queueName,
      counts: {
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
        delayed: delayed.length,
      },
      jobs: {
        waiting: waiting.slice(0, 10), // Latest 10
        active: active.slice(0, 10),
        failed: failed.slice(0, 10),
      },
    };
  }

  async getAllQueueStatuses() {
    const queueNames = Array.from(this.queues.keys());
    const statuses = await Promise.all(queueNames.map((name) => this.getQueueStatus(name)));

    return statuses;
  }

  // Cleanup methods
  async cleanQueue(queueName: string, grace: number = 24 * 60 * 60 * 1000) {
    const queue = this.getQueue(queueName);

    await Promise.all([queue.clean(grace, 10, 'completed'), queue.clean(grace, 10, 'failed')]);
  }

  async pauseQueue(queueName: string) {
    const queue = this.getQueue(queueName);
    await queue.pause();
  }

  async resumeQueue(queueName: string) {
    const queue = this.getQueue(queueName);
    await queue.resume();
  }

  // Graceful shutdown
  async close() {
    await Promise.all(Array.from(this.queues.values()).map((queue) => queue.close()));
    await this.redis.quit();
  }

  // Retry failed jobs
  async retryFailedJobs(queueName: string, limit: number = 10) {
    const queue = this.getQueue(queueName);
    const failedJobs = await queue.getFailed(0, limit);

    for (const job of failedJobs) {
      await job.retry();
    }

    return failedJobs.length;
  }

  // Get job by ID
  async getJob(queueName: string, jobId: string) {
    const queue = this.getQueue(queueName);
    return queue.getJob(jobId);
  }

  // Cancel job
  async cancelJob(queueName: string, jobId: string) {
    const queue = this.getQueue(queueName);
    const job = await queue.getJob(jobId);

    if (job) {
      await job.remove();
      return true;
    }

    return false;
  }
}

// Factory function
export function createQueueManager(config?: Partial<QueueConfig>): QueueManager {
  const defaultConfig: QueueConfig = {
    redis: {
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    },
    defaultJobOptions: {
      removeOnComplete: 100,
      removeOnFail: 50,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
    },
  };

  return new QueueManager({ ...defaultConfig, ...config });
}

// QueueConfig is already exported as interface above
export { Queue } from 'bullmq';
