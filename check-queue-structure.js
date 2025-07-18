const Redis = require('ioredis');

// Load environment variables
require('dotenv').config({ path: 'apps/web/.env.local' });

async function checkQueueStructure() {
  const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  
  try {
    console.log('Checking queue structure...');
    
    // Check the type of each key
    const keys = ['bull:screenshot:failed', 'bull:screenshot:completed', 'bull:screenshot:waiting', 'bull:screenshot:active'];
    
    for (const key of keys) {
      const type = await redis.type(key);
      console.log(`${key}: ${type}`);
      
      if (type === 'set') {
        const members = await redis.smembers(key);
        console.log(`  Members (${members.length}):`, members.slice(0, 3));
      } else if (type === 'list') {
        const length = await redis.llen(key);
        console.log(`  Length: ${length}`);
        if (length > 0) {
          const items = await redis.lrange(key, 0, 2);
          console.log(`  Items:`, items);
        }
      } else if (type === 'zset') {
        const length = await redis.zcard(key);
        console.log(`  Length: ${length}`);
        if (length > 0) {
          const items = await redis.zrange(key, 0, 2);
          console.log(`  Items:`, items);
        }
      }
    }
    
    // Check for recent job keys
    const recentJobKeys = await redis.keys('bull:screenshot:screenshot-*');
    console.log(`\nRecent job keys: ${recentJobKeys.length}`);
    
    if (recentJobKeys.length > 0) {
      // Get details of the most recent job
      const latestJob = recentJobKeys[recentJobKeys.length - 1];
      console.log(`\nLatest job: ${latestJob}`);
      
      const jobData = await redis.hgetall(latestJob);
      console.log('Job data keys:', Object.keys(jobData));
      
      if (jobData.data) {
        console.log('Job data:', jobData.data);
      }
      if (jobData.failedReason) {
        console.log('Failed reason:', jobData.failedReason);
      }
      if (jobData.returnvalue) {
        console.log('Return value:', jobData.returnvalue);
      }
    }
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await redis.disconnect();
  }
}

checkQueueStructure().catch(console.error);