const Redis = require('ioredis');

// Load environment variables
require('dotenv').config({ path: 'apps/web/.env.local' });

async function testRedis() {
  const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  
  try {
    console.log('Testing Redis connection...');
    
    // Test basic connection
    const ping = await redis.ping();
    console.log('Redis ping:', ping);
    
    // Test if we can set/get values
    await redis.set('test-key', 'test-value');
    const value = await redis.get('test-key');
    console.log('Set/Get test:', value);
    
    // Check if there are any queue keys
    const keys = await redis.keys('bull:*');
    console.log('Queue keys found:', keys.length);
    
    if (keys.length > 0) {
      console.log('First few queue keys:', keys.slice(0, 5));
    }
    
    // Check specifically for screenshot queue
    const screenshotKeys = await redis.keys('bull:screenshot:*');
    console.log('Screenshot queue keys:', screenshotKeys.length);
    
    if (screenshotKeys.length > 0) {
      console.log('Screenshot queue keys:', screenshotKeys);
    }
    
    // Check for waiting jobs
    const waitingJobs = await redis.llen('bull:screenshot:waiting');
    console.log('Waiting jobs in screenshot queue:', waitingJobs);
    
    // Check for active jobs
    const activeJobs = await redis.llen('bull:screenshot:active');
    console.log('Active jobs in screenshot queue:', activeJobs);
    
  } catch (err) {
    console.error('Redis error:', err);
  } finally {
    await redis.disconnect();
  }
}

testRedis().catch(console.error);