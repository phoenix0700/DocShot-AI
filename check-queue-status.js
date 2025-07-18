const Redis = require('ioredis');
const { Queue } = require('bullmq');

// Load environment variables
require('dotenv').config({ path: 'apps/web/.env.local' });

async function checkQueueStatus() {
  const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  
  try {
    console.log('Checking Redis connection...');
    
    // Test Redis connection
    const ping = await redis.ping();
    console.log('Redis ping result:', ping);
    
    // Create queue instances
    const screenshotQueue = new Queue('screenshot', { connection: redis });
    const notificationQueue = new Queue('notification', { connection: redis });
    
    console.log('\n=== Screenshot Queue Status ===');
    
    // Get waiting jobs
    const waitingJobs = await screenshotQueue.getWaiting();
    console.log(`Waiting jobs: ${waitingJobs.length}`);
    
    if (waitingJobs.length > 0) {
      console.log('Waiting jobs:');
      waitingJobs.forEach((job, index) => {
        console.log(`  ${index + 1}. Job ID: ${job.id}`);
        console.log(`     Name: ${job.name}`);
        console.log(`     Data: ${JSON.stringify(job.data, null, 2)}`);
        console.log(`     Created: ${new Date(job.timestamp)}`);
      });
    }
    
    // Get active jobs
    const activeJobs = await screenshotQueue.getActive();
    console.log(`Active jobs: ${activeJobs.length}`);
    
    if (activeJobs.length > 0) {
      console.log('Active jobs:');
      activeJobs.forEach((job, index) => {
        console.log(`  ${index + 1}. Job ID: ${job.id}`);
        console.log(`     Name: ${job.name}`);
        console.log(`     Data: ${JSON.stringify(job.data, null, 2)}`);
        console.log(`     Started: ${new Date(job.processedOn)}`);
      });
    }
    
    // Get failed jobs
    const failedJobs = await screenshotQueue.getFailed();
    console.log(`Failed jobs: ${failedJobs.length}`);
    
    if (failedJobs.length > 0) {
      console.log('Recent failed jobs:');
      failedJobs.slice(0, 3).forEach((job, index) => {
        console.log(`  ${index + 1}. Job ID: ${job.id}`);
        console.log(`     Name: ${job.name}`);
        console.log(`     Error: ${job.failedReason}`);
        console.log(`     Failed: ${new Date(job.failedOn)}`);
      });
    }
    
    // Get completed jobs
    const completedJobs = await screenshotQueue.getCompleted();
    console.log(`Completed jobs: ${completedJobs.length}`);
    
    if (completedJobs.length > 0) {
      console.log('Recent completed jobs:');
      completedJobs.slice(0, 3).forEach((job, index) => {
        console.log(`  ${index + 1}. Job ID: ${job.id}`);
        console.log(`     Name: ${job.name}`);
        console.log(`     Completed: ${new Date(job.finishedOn)}`);
      });
    }
    
    // Check if there are workers
    const workers = await screenshotQueue.getWorkers();
    console.log(`Active workers: ${workers.length}`);
    
    if (workers.length > 0) {
      console.log('Active workers:');
      workers.forEach((worker, index) => {
        console.log(`  ${index + 1}. Worker ID: ${worker.id}`);
        console.log(`     Started: ${new Date(worker.started)}`);
      });
    }
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await redis.disconnect();
  }
}

checkQueueStatus().catch(console.error);