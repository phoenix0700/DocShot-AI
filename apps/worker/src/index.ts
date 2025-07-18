// Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
import path from 'path';

// Resolve the path to the web app .env.local file
const envPath = path.resolve(__dirname, '../../../apps/web/.env.local');
dotenv.config({ path: envPath });

console.log('Environment variables loaded from:', envPath);
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET');
console.log('SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? 'SET' : 'NOT SET');
console.log('REDIS_URL:', process.env.REDIS_URL ? 'SET' : 'NOT SET');
console.log('WORKER_HEALTH_CHECK_PORT:', process.env.WORKER_HEALTH_CHECK_PORT || 'NOT SET');

// Now safe to import modules that may use environment variables
import { Worker } from 'bullmq';
import Redis from 'ioredis';
import { screenshotProcessor } from './jobs/screenshot';
import { diffProcessor } from './jobs/diff';
import { notificationProcessor } from './jobs/notification';
import { startHealthCheckServer } from './health';
import { logger } from './lib/logger';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

const screenshotWorker = new Worker('screenshot', screenshotProcessor, {
  connection: redis,
  concurrency: parseInt(process.env.SCREENSHOT_CONCURRENCY || '3'),
});

// Add debug logging for worker events
screenshotWorker.on('ready', () => {
  logger.info('Screenshot worker is ready and listening for jobs');
});

screenshotWorker.on('error', (error) => {
  logger.error('Screenshot worker error:', error);
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
[screenshotWorker, diffWorker, notificationWorker].forEach((worker) => {
  worker.on('completed', (job) => {
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
const healthPort = process.env.WORKER_HEALTH_CHECK_PORT || 3001;
startHealthCheckServer(Number(healthPort));

logger.info('DocShot AI Worker started', {
  screenshotConcurrency: screenshotWorker.concurrency,
  diffConcurrency: diffWorker.concurrency,
  notificationConcurrency: notificationWorker.concurrency,
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('Shutting down workers...');
  await Promise.all([screenshotWorker.close(), diffWorker.close(), notificationWorker.close()]);
  await redis.quit();
  process.exit(0);
});
