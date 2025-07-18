const Redis = require('ioredis');

// Load environment variables
require('dotenv').config({ path: 'apps/web/.env.local' });

async function checkFailedJobs() {
  const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  
  try {
    console.log('Checking failed jobs...');
    
    // Get failed jobs list
    const failedJobs = await redis.lrange('bull:screenshot:failed', 0, -1);
    console.log('Failed jobs count:', failedJobs.length);
    
    if (failedJobs.length > 0) {
      console.log('Recent failed jobs:', failedJobs.slice(0, 5));
      
      // Get details of the first failed job
      const firstFailedJob = failedJobs[0];
      if (firstFailedJob) {
        const jobData = await redis.hgetall(`bull:screenshot:${firstFailedJob}`);
        console.log('\nFirst failed job details:');
        console.log('Job ID:', firstFailedJob);
        console.log('Data:', jobData.data);
        console.log('Failed reason:', jobData.failedReason);
        console.log('Failed at:', new Date(parseInt(jobData.failedOn)));
      }
    }
    
    // Check completed jobs
    const completedJobs = await redis.lrange('bull:screenshot:completed', 0, -1);
    console.log('\nCompleted jobs count:', completedJobs.length);
    
    if (completedJobs.length > 0) {
      console.log('Recent completed jobs:', completedJobs.slice(0, 5));
    }
    
    // Check for stalled jobs
    const stalledJobs = await redis.lrange('bull:screenshot:stalled', 0, -1);
    console.log('\nStalled jobs count:', stalledJobs.length);
    
    if (stalledJobs.length > 0) {
      console.log('Stalled jobs:', stalledJobs);
    }
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await redis.disconnect();
  }
}

checkFailedJobs().catch(console.error);