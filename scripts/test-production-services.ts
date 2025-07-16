#!/usr/bin/env tsx

/**
 * Production Services Connection Test
 * 
 * This script tests all production service connections:
 * - Supabase Database
 * - Redis (Upstash)
 * - S3 Storage (Cloudflare R2)
 * - SMTP Email
 * 
 * Usage: tsx scripts/test-production-services.ts
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import Redis from 'ioredis';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import nodemailer from 'nodemailer';

// Load environment variables
config({ path: '.env.local' });

interface TestResult {
  service: string;
  status: 'success' | 'error';
  message: string;
  duration: number;
}

const results: TestResult[] = [];

function logTest(service: string, status: 'success' | 'error', message: string, duration: number) {
  const emoji = status === 'success' ? '✅' : '❌';
  console.log(`${emoji} ${service}: ${message} (${duration}ms)`);
  results.push({ service, status, message, duration });
}

async function testSupabase(): Promise<void> {
  const start = Date.now();
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = table not found (expected for empty DB)
      throw error;
    }

    // Test table creation capability
    const { error: rpcError } = await supabase.rpc('version');
    
    if (rpcError) {
      throw rpcError;
    }

    logTest('Supabase Database', 'success', 'Connected successfully', Date.now() - start);
  } catch (error) {
    logTest('Supabase Database', 'error', error instanceof Error ? error.message : 'Unknown error', Date.now() - start);
  }
}

async function testRedis(): Promise<void> {
  const start = Date.now();
  let redis: Redis | null = null;
  
  try {
    const redisUrl = process.env.REDIS_URL;
    
    if (!redisUrl) {
      throw new Error('Missing REDIS_URL environment variable');
    }

    redis = new Redis(redisUrl, {
      connectTimeout: 10000,
      lazyConnect: true,
    });

    await redis.connect();
    
    // Test basic operations
    await redis.ping();
    await redis.set('test-key', 'test-value', 'EX', 60);
    const value = await redis.get('test-key');
    await redis.del('test-key');
    
    if (value !== 'test-value') {
      throw new Error('Redis read/write test failed');
    }

    logTest('Redis (Upstash)', 'success', 'Connected and tested operations', Date.now() - start);
  } catch (error) {
    logTest('Redis (Upstash)', 'error', error instanceof Error ? error.message : 'Unknown error', Date.now() - start);
  } finally {
    if (redis) {
      await redis.quit();
    }
  }
}

async function testS3Storage(): Promise<void> {
  const start = Date.now();
  
  try {
    const bucket = process.env.S3_BUCKET;
    const accessKey = process.env.S3_ACCESS_KEY;
    const secretKey = process.env.S3_SECRET_KEY;
    const endpoint = process.env.S3_ENDPOINT;
    const region = process.env.S3_REGION || 'auto';
    
    if (!bucket || !accessKey || !secretKey || !endpoint) {
      throw new Error('Missing S3 environment variables');
    }

    const s3Client = new S3Client({
      region,
      endpoint,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
    });

    const testKey = `test-connection-${Date.now()}.txt`;
    const testContent = 'Production connection test';

    // Test upload
    await s3Client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: testKey,
      Body: testContent,
      ContentType: 'text/plain',
    }));

    // Test download
    const getResponse = await s3Client.send(new GetObjectCommand({
      Bucket: bucket,
      Key: testKey,
    }));

    const downloadedContent = await getResponse.Body?.transformToString();
    
    if (downloadedContent !== testContent) {
      throw new Error('S3 read/write test failed');
    }

    // Test delete
    await s3Client.send(new DeleteObjectCommand({
      Bucket: bucket,
      Key: testKey,
    }));

    logTest('S3 Storage (R2)', 'success', 'Upload, download, delete operations successful', Date.now() - start);
  } catch (error) {
    logTest('S3 Storage (R2)', 'error', error instanceof Error ? error.message : 'Unknown error', Date.now() - start);
  }
}

async function testSMTP(): Promise<void> {
  const start = Date.now();
  
  try {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587');
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    
    if (!host || !user || !pass) {
      throw new Error('Missing SMTP environment variables');
    }

    const transporter = nodemailer.createTransporter({
      host,
      port,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user,
        pass,
      },
    });

    // Test connection
    await transporter.verify();

    logTest('SMTP Email', 'success', 'SMTP server connection verified', Date.now() - start);
  } catch (error) {
    logTest('SMTP Email', 'error', error instanceof Error ? error.message : 'Unknown error', Date.now() - start);
  }
}

async function generateReport(): Promise<void> {
  console.log('\n📊 Production Services Test Report');
  console.log('=====================================');
  
  const successful = results.filter(r => r.status === 'success').length;
  const failed = results.filter(r => r.status === 'error').length;
  const total = results.length;
  
  console.log(`\n📈 Summary: ${successful}/${total} services connected successfully`);
  
  if (failed > 0) {
    console.log('\n❌ Failed Services:');
    results
      .filter(r => r.status === 'error')
      .forEach(r => console.log(`   - ${r.service}: ${r.message}`));
  }
  
  if (successful === total) {
    console.log('\n🎉 All production services are ready!');
    console.log('\n✅ Next steps:');
    console.log('   1. Deploy web app to Vercel');
    console.log('   2. Deploy worker to Railway');
    console.log('   3. Run end-to-end tests');
  } else {
    console.log('\n⚠️  Please fix the failed services before deploying to production.');
    console.log('\n📖 Check PRODUCTION_SETUP.md for detailed setup instructions.');
  }
  
  console.log('\n🔗 Useful Links:');
  console.log('   - Supabase Dashboard: https://supabase.com/dashboard');
  console.log('   - Upstash Console: https://console.upstash.com');
  console.log('   - Cloudflare R2: https://dash.cloudflare.com');
  console.log('   - Clerk Dashboard: https://dashboard.clerk.com');
}

async function main(): Promise<void> {
  console.log('🧪 Testing Production Services...\n');
  
  // Run all tests in parallel for speed
  await Promise.all([
    testSupabase(),
    testRedis(),
    testS3Storage(),
    testSMTP(),
  ]);
  
  await generateReport();
}

// Run the tests
main().catch((error) => {
  console.error('💥 Test suite failed:', error);
  process.exit(1);
});