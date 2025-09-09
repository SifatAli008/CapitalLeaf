#!/usr/bin/env node

/**
 * Vercel Credentials Helper Script
 * 
 * This script helps you get the required Vercel credentials
 * for configuring GitHub Actions secrets.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 CapitalLeaf Vercel Credentials Helper\n');

try {
  // Check if Vercel CLI is installed
  execSync('vercel --version', { stdio: 'pipe' });
  console.log('✅ Vercel CLI is installed\n');
} catch (error) {
  console.log('❌ Vercel CLI not found. Please install it first:');
  console.log('   npm install -g vercel\n');
  process.exit(1);
}

try {
  // Check if user is logged in
  const whoami = execSync('vercel whoami', { encoding: 'utf8' });
  console.log(`✅ Logged in as: ${whoami.trim()}\n`);
} catch (error) {
  console.log('❌ Not logged in to Vercel. Please login first:');
  console.log('   vercel login\n');
  process.exit(1);
}

// Check if project is linked
const vercelProjectPath = path.join(process.cwd(), '.vercel', 'project.json');

if (fs.existsSync(vercelProjectPath)) {
  try {
    const projectConfig = JSON.parse(fs.readFileSync(vercelProjectPath, 'utf8'));
    
    console.log('📋 Your Vercel Credentials:\n');
    console.log('🔑 VERCEL_TOKEN:');
    console.log('   Get from: https://vercel.com/account/tokens');
    console.log('   Or run: vercel whoami\n');
    
    console.log('🏢 VERCEL_ORG_ID:');
    console.log(`   ${projectConfig.orgId}\n`);
    
    console.log('📦 VERCEL_PROJECT_ID:');
    console.log(`   ${projectConfig.projectId}\n`);
    
    console.log('📝 GitHub Secrets Configuration:');
    console.log('   1. Go to: https://github.com/SifatAli008/CapitalLeaf/settings/secrets/actions');
    console.log('   2. Add these secrets:');
    console.log(`      - VERCEL_TOKEN: [Your token from Vercel dashboard]`);
    console.log(`      - VERCEL_ORG_ID: ${projectConfig.orgId}`);
    console.log(`      - VERCEL_PROJECT_ID: ${projectConfig.projectId}\n`);
    
    console.log('🎉 Once configured, your CI/CD pipeline will automatically deploy!');
    
  } catch (error) {
    console.log('❌ Error reading project configuration:', error.message);
  }
} else {
  console.log('❌ Project not linked to Vercel. Please link it first:');
  console.log('   vercel link\n');
  
  console.log('📋 After linking, run this script again to get your credentials.');
}

console.log('\n📚 For more help, see: VERCEL_SETUP.md');
