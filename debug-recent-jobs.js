const Redis = require('ioredis');

// Load environment variables
require('dotenv').config({ path: 'apps/web/.env.local' });

async function debugRecentJobs() {
  const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  
  try {
    console.log('Debugging recent jobs...');
    console.log('Redis URL:', process.env.REDIS_URL || 'redis://localhost:6379');
    
    // Get all job keys
    const jobKeys = await redis.keys('bull:screenshot:screenshot-*');
    console.log(`Total job keys: ${jobKeys.length}`);
    
    // Sort by timestamp and get the most recent 3
    const jobsWithTime = [];
    for (const jobKey of jobKeys) {
      const jobData = await redis.hgetall(jobKey);
      if (jobData.timestamp) {
        jobsWithTime.push({
          key: jobKey,
          timestamp: parseInt(jobData.timestamp),
          data: jobData
        });
      }
    }
    
    jobsWithTime.sort((a, b) => b.timestamp - a.timestamp);
    const recentJobs = jobsWithTime.slice(0, 3);
    
    console.log('\nMost recent jobs:');
    recentJobs.forEach((job, index) => {
      console.log(`\n${index + 1}. Job Key: ${job.key}`);
      console.log(`   Timestamp: ${new Date(job.timestamp)}`);
      console.log(`   Data: ${job.data.data}`);
      console.log(`   Status: ${job.data.finishedOn ? 'finished' : job.data.failedReason ? 'failed' : 'active/waiting'}`);
      if (job.data.failedReason) {
        console.log(`   Failed Reason: ${job.data.failedReason}`);
      }
      if (job.data.returnvalue) {
        console.log(`   Return Value: ${job.data.returnvalue}`);
      }
    });
    
    // Check waiting and active queues
    const waitingCount = await redis.llen('bull:screenshot:waiting');
    const activeCount = await redis.llen('bull:screenshot:active');
    
    console.log(`\nQueue Status:`);
    console.log(`  Waiting: ${waitingCount}`);
    console.log(`  Active: ${activeCount}`);
    
    if (waitingCount > 0) {
      const waitingJobs = await redis.lrange('bull:screenshot:waiting', 0, -1);
      console.log(`  Waiting jobs: ${waitingJobs.join(', ')}`);
    }
    
    if (activeCount > 0) {
      const activeJobs = await redis.lrange('bull:screenshot:active', 0, -1);
      console.log(`  Active jobs: ${activeJobs.join(', ')}`);
    }
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await redis.disconnect();
  }
}

debugRecentJobs().catch(console.error);