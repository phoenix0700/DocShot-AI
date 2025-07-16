import { Worker } from 'bullmq';
import Redis from 'ioredis';
import { screenshotProcessor } from './jobs/screenshot';
import { diffProcessor } from './jobs/diff';
import { notificationProcessor } from './jobs/notification';
import { startHealthCheckServer } from './health';
import { logger } from './lib/logger';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const screenshotWorker = new Worker('screenshot', screenshotProcessor, {
  connection: redis,
  concurrency: parseInt(process.env.SCREENSHOT_CONCURRENCY || '3'),
});

const diffWorker = new Worker('diff', diffProcessor, {
  connection: redis,
  concurrency: parseInt(process.env.DIFF_CONCURRENCY || '5'),
});

const notificationWorker = new Worker('notification', notificationProcessor, {
  connection: redis,
  concurrency: parseInt(process.env.NOTIFICATION_CONCURRENCY || '10'),
});

// Error handling
[screenshotWorker, diffWorker, notificationWorker].forEach(worker => {
  worker.on('completed', job => {
    logger.info(`Job completed`, {
      queue: job.queueName,
      jobId: job.id,
      name: job.name,
    });
  });

  worker.on('failed', (job, err) => {
    logger.error(`Job failed`, {
      queue: job?.queueName,
      jobId: job?.id,
      name: job?.name,
      error: err.message,
    });
  });
});

// Start health check server
startHealthCheckServer();

logger.info('DocShot AI Worker started', {
  screenshotConcurrency: screenshotWorker.concurrency,
  diffConcurrency: diffWorker.concurrency,
  notificationConcurrency: notificationWorker.concurrency,
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('Shutting down workers...');
  await Promise.all([
    screenshotWorker.close(),
    diffWorker.close(),
    notificationWorker.close(),
  ]);
  await redis.quit();
  process.exit(0);
});