#!/usr/bin/env node

const https = require('https');
const { execSync } = require('child_process');

const DEPLOYMENT_URL = process.env.DEPLOYMENT_URL || 'https://your-app.vercel.app';
const MAX_RETRIES = 10;
const RETRY_DELAY = 5000; // 5 seconds

async function checkDeployment() {
  console.log('🚀 Checking deployment status...');
  
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const isHealthy = await checkHealth();
      if (isHealthy) {
        console.log('✅ Deployment is healthy and ready!');
        return true;
      }
    } catch (error) {
      console.log(`⏳ Attempt ${i + 1}/${MAX_RETRIES}: ${error.message}`);
    }
    
    if (i < MAX_RETRIES - 1) {
      console.log(`⏳ Waiting ${RETRY_DELAY / 1000} seconds before retry...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
  
  console.error('❌ Deployment health check failed after maximum retries');
  process.exit(1);
}

function checkHealth() {
  return new Promise((resolve, reject) => {
    const url = new URL(DEPLOYMENT_URL);
    
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: 'GET',
      timeout: 10000,
      headers: {
        'User-Agent': 'Deployment-Checker/1.0'
      }
    };

    const req = https.request(options, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        resolve(true);
      } else {
        reject(new Error(`HTTP ${res.statusCode}`));
      }
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function runLighthouseAudit() {
  console.log('🔍 Running Lighthouse audit...');
  
  try {
    // Check if lighthouse is installed
    execSync('npx lighthouse --version', { stdio: 'ignore' });
    
    const command = `npx lighthouse ${DEPLOYMENT_URL} --output=json --output-path=./lighthouse-report.json --chrome-flags="--headless --no-sandbox"`;
    execSync(command, { stdio: 'inherit' });
    
    console.log('✅ Lighthouse audit completed');
  } catch (error) {
    console.log('⚠️  Lighthouse audit skipped:', error.message);
  }
}

async function main() {
  try {
    await checkDeployment();
    await runLighthouseAudit();
    console.log('🎉 All deployment checks passed!');
  } catch (error) {
    console.error('❌ Deployment check failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkDeployment, runLighthouseAudit };
