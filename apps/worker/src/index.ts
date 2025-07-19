// Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
import path from 'path';

// Only load .env.local in development, Railway provides env vars
if (process.env.NODE_ENV !== 'production') {
  const envPath = path.resolve(__dirname, '../../../apps/web/.env.local');
  dotenv.config({ path: envPath });
  console.log('Environment variables loaded from:', envPath);
} else {
  console.log('Using Railway environment variables (production mode)');
}
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET');
console.log('SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? 'SET' : 'NOT SET');
console.log('REDIS_URL:', process.env.REDIS_URL ? 'SET' : 'NOT SET');
console.log('WORKER_HEALTH_CHECK_PORT:', process.env.WORKER_HEALTH_CHECK_PORT || 'NOT SET');
console.log('PORT (Railway):', process.env.PORT || 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV || 'NOT SET');

// Now safe to import modules that may use environment variables
import { Worker } from 'bullmq';
import Redis from 'ioredis';
import { screenshotProcessor } from './jobs/screenshot';
import { diffProcessor } from './jobs/diff';
import { notificationProcessor } from './jobs/notification';
import { startHealthCheckServer } from './health';
import { logger } from './lib/logger';

console.log('Connecting to Redis...');
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

redis.on('connect', () => {
  console.log('Redis connected successfully');
});

redis.on('error', (error) => {
  console.error('Redis connection error:', error);
});

console.log('Creating BullMQ workers...');
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
// Use Railway's PORT or fallback to WORKER_HEALTH_CHECK_PORT or default 3001
const healthPort = process.env.PORT || process.env.WORKER_HEALTH_CHECK_PORT || 3001;
console.log(`Starting health check server on port: ${healthPort}`);

try {
  startHealthCheckServer(Number(healthPort));
  console.log(`Health check server started successfully on port ${healthPort}`);
} catch (error) {
  console.error('Failed to start health check server:', error);
  process.exit(1);
}

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
