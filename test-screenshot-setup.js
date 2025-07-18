const Redis = require('ioredis');
const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');
require('dotenv').config({ path: './apps/web/.env.local' });

async function testSetup() {
  console.log('🔍 Testing DocShot AI Screenshot Setup...\n');

  // Test 1: Environment Variables
  console.log('1️⃣ Environment Variables:');
  console.log('   REDIS_URL:', process.env.REDIS_URL || '❌ NOT SET');
  console.log('   S3_ENDPOINT:', process.env.S3_ENDPOINT || '❌ NOT SET');
  console.log('   S3_BUCKET:', process.env.S3_BUCKET || '❌ NOT SET');
  console.log('   SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? '✅ SET' : '❌ NOT SET');

  // Test 2: Redis Connection
  console.log('\n2️⃣ Testing Redis Connection...');
  try {
    const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6380');
    await redis.ping();
    console.log('   ✅ Redis is running');
    await redis.quit();
  } catch (error) {
    console.log('   ❌ Redis is NOT running:', error.message);
    console.log('   Run: docker-compose up -d redis');
  }

  // Test 3: MinIO/S3 Connection
  console.log('\n3️⃣ Testing MinIO/S3 Connection...');
  try {
    const s3Client = new S3Client({
      endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
      region: process.env.S3_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
        secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin123',
      },
      forcePathStyle: true,
    });
    
    await s3Client.send(new ListBucketsCommand({}));
    console.log('   ✅ MinIO/S3 is running');
  } catch (error) {
    console.log('   ❌ MinIO/S3 is NOT running:', error.message);
    console.log('   Run: docker-compose up -d minio');
  }

  // Test 4: Worker Health Check
  console.log('\n4️⃣ Testing Worker Health Check...');
  try {
    const response = await fetch('http://localhost:3001/health');
    if (response.ok) {
      console.log('   ✅ Worker is running');
    } else {
      console.log('   ❌ Worker responded with error');
    }
  } catch (error) {
    console.log('   ❌ Worker is NOT running');
    console.log('   Run: pnpm dev (in another terminal)');
  }

  console.log('\n📸 Screenshot Capture Process:');
  console.log('1. Configure screenshots in project settings (YAML)');
  console.log('2. Click "Run Screenshots" button');
  console.log('3. Web app queues jobs to Redis');
  console.log('4. Worker picks up jobs and captures screenshots');
  console.log('5. Screenshots are stored in MinIO/S3');
  console.log('6. Results appear in the UI');
}

testSetup().catch(console.error);