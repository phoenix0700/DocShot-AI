#!/usr/bin/env tsx

/**
 * DocShot AI Production Validation Script
 * 
 * Quick validation of production deployment status.
 * Checks all critical components are working.
 * 
 * Usage: tsx scripts/validate-production.ts [--web-url=...] [--worker-url=...]
 */

import { config } from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
config({ path: '.env.production' });

interface ValidationResult {
  component: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

class ProductionValidator {
  private results: ValidationResult[] = [];
  private webUrl: string;
  private workerUrl: string;

  constructor() {
    this.webUrl = process.argv.find(arg => arg.startsWith('--web-url='))?.split('=')[1] || 
                  process.env.NEXT_PUBLIC_APP_URL || 
                  'http://localhost:3000';
    
    this.workerUrl = process.argv.find(arg => arg.startsWith('--worker-url='))?.split('=')[1] || 
                     'http://localhost:3001';
  }

  private addResult(component: string, status: 'pass' | 'fail' | 'warning', message: string, details?: any) {
    this.results.push({ component, status, message, details });
    
    const emoji = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⚠️';
    console.log(`${emoji} ${component}: ${message}`);
  }

  async validateWebApp() {
    try {
      console.log(`\n🌐 Testing Web App: ${this.webUrl}`);
      
      // Test home page
      const homeResponse = await fetch(this.webUrl, { timeout: 10000 });
      if (!homeResponse.ok) {
        throw new Error(`HTTP ${homeResponse.status}`);
      }
      
      const homeContent = await homeResponse.text();
      if (!homeContent.includes('DocShot') && !homeContent.includes('Screenshot')) {
        this.addResult('Web App Content', 'warning', 'Content may not be correct');
      } else {
        this.addResult('Web App Home', 'pass', `Responds with ${homeResponse.status}`);
      }

      // Test health endpoint (if exists)
      try {
        const healthResponse = await fetch(`${this.webUrl}/api/health`, { timeout: 5000 });
        if (healthResponse.ok) {
          const health = await healthResponse.json();
          this.addResult('Web App Health', 'pass', `Health check passed: ${JSON.stringify(health)}`);
        } else {
          this.addResult('Web App Health', 'warning', 'Health endpoint not available (expected for some deployments)');
        }
      } catch {
        this.addResult('Web App Health', 'warning', 'Health endpoint not available (expected for some deployments)');
      }

      // Test authentication pages
      try {
        const signInResponse = await fetch(`${this.webUrl}/sign-in`, { timeout: 5000 });
        if (signInResponse.ok) {
          this.addResult('Authentication Pages', 'pass', 'Sign-in page accessible');
        } else {
          this.addResult('Authentication Pages', 'warning', 'Sign-in page not found');
        }
      } catch {
        this.addResult('Authentication Pages', 'warning', 'Could not test authentication pages');
      }

    } catch (error) {
      this.addResult('Web App', 'fail', `Not accessible: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async validateWorker() {
    try {
      console.log(`\n⚡ Testing Worker: ${this.workerUrl}`);
      
      const healthResponse = await fetch(`${this.workerUrl}/health`, { timeout: 10000 });
      
      if (!healthResponse.ok) {
        throw new Error(`HTTP ${healthResponse.status}`);
      }
      
      const health = await healthResponse.json();
      
      if (health.status === 'healthy') {
        this.addResult('Worker Health', 'pass', 'Worker is healthy');
        
        // Check specific health components
        if (health.checks) {
          if (health.checks.redis === 'connected') {
            this.addResult('Worker Redis', 'pass', 'Redis connection healthy');
          } else {
            this.addResult('Worker Redis', 'fail', `Redis: ${health.checks.redis}`);
          }
          
          if (health.checks.database === 'connected') {
            this.addResult('Worker Database', 'pass', 'Database connection healthy');
          } else {
            this.addResult('Worker Database', 'fail', `Database: ${health.checks.database}`);
          }
        }
      } else {
        this.addResult('Worker Health', 'fail', `Worker unhealthy: ${health.status}`);
      }
      
    } catch (error) {
      this.addResult('Worker', 'fail', `Not accessible: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async validateEnvironmentConfig() {
    console.log(`\n🔧 Validating Environment Configuration`);
    
    const requiredVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'SUPABASE_SERVICE_KEY',
      'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
      'CLERK_SECRET_KEY',
      'REDIS_URL',
      'S3_BUCKET',
      'S3_ACCESS_KEY',
      'S3_SECRET_KEY',
      'S3_ENDPOINT'
    ];

    let configScore = 0;
    
    for (const varName of requiredVars) {
      if (process.env[varName]) {
        configScore++;
      } else {
        this.addResult('Environment Config', 'fail', `Missing ${varName}`);
      }
    }
    
    if (configScore === requiredVars.length) {
      this.addResult('Environment Config', 'pass', 'All required variables present');
    } else {
      this.addResult('Environment Config', 'warning', `${configScore}/${requiredVars.length} variables configured`);
    }

    // Check URL formats
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('https://') && 
          process.env.NEXT_PUBLIC_SUPABASE_URL.includes('.supabase.co')) {
        this.addResult('Supabase URL', 'pass', 'URL format looks correct');
      } else {
        this.addResult('Supabase URL', 'warning', 'URL format may be incorrect');
      }
    }

    if (process.env.REDIS_URL) {
      if (process.env.REDIS_URL.startsWith('redis://') || 
          process.env.REDIS_URL.startsWith('rediss://')) {
        this.addResult('Redis URL', 'pass', 'URL format looks correct');
      } else {
        this.addResult('Redis URL', 'warning', 'URL format may be incorrect');
      }
    }
  }

  async validateDeploymentStatus() {
    console.log(`\n🚀 Checking Deployment Status`);
    
    // Check if URLs are production URLs
    if (this.webUrl.includes('vercel.app') || this.webUrl.includes('.com')) {
      this.addResult('Web Deployment', 'pass', 'Deployed to production domain');
    } else if (this.webUrl.includes('localhost')) {
      this.addResult('Web Deployment', 'warning', 'Running on localhost (development)');
    } else {
      this.addResult('Web Deployment', 'warning', 'Unknown deployment status');
    }

    if (this.workerUrl.includes('railway.app') || this.workerUrl.includes('.com')) {
      this.addResult('Worker Deployment', 'pass', 'Deployed to production domain');
    } else if (this.workerUrl.includes('localhost')) {
      this.addResult('Worker Deployment', 'warning', 'Running on localhost (development)');
    } else {
      this.addResult('Worker Deployment', 'warning', 'Unknown deployment status');
    }

    // Check if HTTPS is enabled
    if (this.webUrl.startsWith('https://')) {
      this.addResult('SSL/TLS', 'pass', 'HTTPS enabled for web app');
    } else {
      this.addResult('SSL/TLS', 'warning', 'HTTPS not enabled');
    }
  }

  generateSummary() {
    console.log('\n📊 Production Validation Summary');
    console.log('==================================');
    
    const passed = this.results.filter(r => r.status === 'pass').length;
    const failed = this.results.filter(r => r.status === 'fail').length;
    const warnings = this.results.filter(r => r.status === 'warning').length;
    const total = this.results.length;
    
    console.log(`\n📈 Results: ${passed} passed, ${failed} failed, ${warnings} warnings (${total} total)`);
    
    if (failed > 0) {
      console.log('\n❌ Critical Issues:');
      this.results
        .filter(r => r.status === 'fail')
        .forEach(r => console.log(`   - ${r.component}: ${r.message}`));
    }
    
    if (warnings > 0) {
      console.log('\n⚠️  Warnings:');
      this.results
        .filter(r => r.status === 'warning')
        .forEach(r => console.log(`   - ${r.component}: ${r.message}`));
    }
    
    // Overall status
    let overallStatus: string;
    if (failed === 0 && warnings === 0) {
      overallStatus = '🎉 EXCELLENT - Production ready!';
    } else if (failed === 0) {
      overallStatus = '✅ GOOD - Production ready with minor warnings';
    } else if (failed <= 2) {
      overallStatus = '⚠️  NEEDS ATTENTION - Fix critical issues before going live';
    } else {
      overallStatus = '❌ NOT READY - Multiple critical issues need fixing';
    }
    
    console.log(`\n🏆 Overall Status: ${overallStatus}`);
    
    if (failed === 0) {
      console.log('\n🚀 Next Steps:');
      console.log('   1. Run full E2E tests: tsx scripts/test-e2e-production.ts');
      console.log('   2. Perform manual user testing');
      console.log('   3. Set up monitoring and alerts');
      console.log('   4. Update DNS if using custom domain');
      console.log('   5. Launch! 🎉');
    } else {
      console.log('\n🔧 Required Actions:');
      console.log('   1. Fix all critical issues listed above');
      console.log('   2. Re-run validation: tsx scripts/validate-production.ts');
      console.log('   3. Check PRODUCTION_SETUP.md for detailed setup instructions');
    }
    
    console.log('\n🔗 Useful Links:');
    console.log(`   - Web App: ${this.webUrl}`);
    console.log(`   - Worker Health: ${this.workerUrl}/health`);
    console.log('   - Setup Guide: PRODUCTION_SETUP.md');
    console.log('   - Testing Guide: PRODUCTION_TESTING.md');
    
    return failed === 0;
  }

  async run() {
    console.log('🔍 DocShot AI Production Validation');
    console.log('====================================');
    console.log(`📅 ${new Date().toISOString()}`);
    
    await this.validateEnvironmentConfig();
    await this.validateDeploymentStatus();
    await this.validateWebApp();
    await this.validateWorker();
    
    const isReady = this.generateSummary();
    
    if (!isReady) {
      process.exit(1);
    }
  }
}

// Run validation
async function main() {
  const validator = new ProductionValidator();
  await validator.run();
}

main().catch(error => {
  console.error('💥 Validation failed:', error);
  process.exit(1);
});