#!/usr/bin/env node

/**
 * Vercel Credentials Helper Script
 * 
 * This script helps you get the required Vercel credentials for GitHub Actions deployment.
 * It provides step-by-step instructions and validates your setup.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  log('\n' + '='.repeat(60), 'cyan');
  log(message, 'bright');
  log('='.repeat(60), 'cyan');
}

function logStep(step, message) {
  log(`\n${step}. ${message}`, 'yellow');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'magenta');
}

// Check if Vercel CLI is installed
function checkVercelCLI() {
  try {
    const version = execSync('vercel --version', { encoding: 'utf8' }).trim();
    logSuccess(`Vercel CLI installed: ${version}`);
    return true;
  } catch (error) {
    logError('Vercel CLI not found');
    logInfo('Install it with: npm install -g vercel');
    return false;
  }
}

// Check if user is logged in to Vercel
function checkVercelLogin() {
  try {
    execSync('vercel whoami', { encoding: 'utf8', stdio: 'pipe' });
    logSuccess('Logged in to Vercel');
    return true;
  } catch (error) {
    logError('Not logged in to Vercel');
    logInfo('Login with: vercel login');
    return false;
  }
}

// Get Vercel project information
function getVercelProjectInfo() {
  try {
    const projects = execSync('vercel ls', { encoding: 'utf8' });
    const lines = projects.split('\n').filter(line => line.trim());
    
    if (lines.length <= 1) {
      logWarning('No projects found in your Vercel account');
      return null;
    }
    
    logInfo('Available projects:');
    const projectList = [];
    
    // Parse project list (skip header line)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const parts = line.split(/\s+/);
        if (parts.length >= 2) {
          const name = parts[0];
          const id = parts[1];
          projectList.push({ name, id });
          log(`  - ${name} (${id})`, 'blue');
        }
      }
    }
    
    // Look for CapitalLeaf project
    const capitalLeafProject = projectList.find(project => 
      project.name.toLowerCase().includes('capitalleaf') || 
      project.name.toLowerCase().includes('capital-leaf')
    );
    
    if (capitalLeafProject) {
      logSuccess(`Found CapitalLeaf project: ${capitalLeafProject.name}`);
      return capitalLeafProject;
    }
    
    return null;
  } catch (error) {
    logError('Failed to get project information');
    logInfo('Make sure you have at least one project in your Vercel account');
    return null;
  }
}

// Get organization/team information
function getVercelOrgInfo() {
  try {
    const orgs = execSync('vercel teams ls', { encoding: 'utf8' });
    const lines = orgs.split('\n').filter(line => line.trim());
    
    if (lines.length <= 1) {
      logWarning('No teams found');
      return null;
    }
    
    logInfo('Available teams/organizations:');
    const orgList = [];
    
    // Parse team list (skip header line)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const parts = line.split(/\s+/);
        if (parts.length >= 2) {
          const name = parts[0];
          const id = parts[1];
          orgList.push({ name, id });
          log(`  - ${name} (${id})`, 'blue');
        }
      }
    }
    
    return orgList[0]; // Return first org as default
  } catch (error) {
    logError('Failed to get organization information');
    return null;
  }
}

// Generate GitHub secrets template
function generateGitHubSecretsTemplate(projectInfo, orgInfo) {
  const template = `
# GitHub Secrets Configuration Template

Add these secrets to your GitHub repository:

## Required Secrets:

1. **VERCEL_TOKEN**
   - Go to: https://vercel.com/account/tokens
   - Click "Create Token"
   - Name: "CapitalLeaf-CI-CD"
   - Scope: "Full Account"
   - Copy the generated token

2. **VERCEL_ORG_ID**
   - Value: ${orgInfo ? orgInfo.id : 'YOUR_ORG_ID_HERE'}
   - Organization: ${orgInfo ? orgInfo.name : 'YOUR_ORG_NAME'}

3. **VERCEL_PROJECT_ID**
   - Value: ${projectInfo ? projectInfo.id : 'YOUR_PROJECT_ID_HERE'}
   - Project: ${projectInfo ? projectInfo.name : 'YOUR_PROJECT_NAME'}

## How to Add Secrets:

1. Go to your GitHub repository
2. Click "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Add each secret with the exact names above

## Verification:

After adding secrets, your CI/CD pipeline will automatically deploy to Vercel.
Check the Actions tab in your GitHub repository to monitor deployments.
`;

  return template;
}

// Main function
function main() {
  logHeader('🚀 CapitalLeaf Vercel Credentials Helper');
  
  log('This script will help you get the required Vercel credentials for GitHub Actions deployment.\n', 'cyan');
  
  // Step 1: Check Vercel CLI
  logStep(1, 'Checking Vercel CLI Installation');
  if (!checkVercelCLI()) {
    log('\nPlease install Vercel CLI first:', 'yellow');
    log('npm install -g vercel', 'bright');
    log('\nThen run this script again.', 'yellow');
    return;
  }
  
  // Step 2: Check Vercel Login
  logStep(2, 'Checking Vercel Login Status');
  if (!checkVercelLogin()) {
    log('\nPlease login to Vercel first:', 'yellow');
    log('vercel login', 'bright');
    log('\nThen run this script again.', 'yellow');
    return;
  }
  
  // Step 3: Get Organization Info
  logStep(3, 'Getting Organization Information');
  const orgInfo = getVercelOrgInfo();
  
  // Step 4: Get Project Info
  logStep(4, 'Getting Project Information');
  const projectInfo = getVercelProjectInfo();
  
  // Step 5: Generate Template
  logStep(5, 'Generating GitHub Secrets Template');
  const template = generateGitHubSecretsTemplate(projectInfo, orgInfo);
  
  // Save template to file
  const templatePath = path.join(process.cwd(), 'GITHUB_SECRETS_TEMPLATE.md');
  fs.writeFileSync(templatePath, template);
  logSuccess(`Template saved to: ${templatePath}`);
  
  // Display template
  logHeader('📋 GitHub Secrets Configuration Template');
  console.log(template);
  
  // Step 6: Next Steps
  logHeader('🎯 Next Steps');
  logStep(1, 'Get Vercel Token');
  log('Visit: https://vercel.com/account/tokens', 'blue');
  log('Create a new token with "Full Account" scope', 'blue');
  
  logStep(2, 'Add GitHub Secrets');
  log('Go to your GitHub repository → Settings → Secrets and variables → Actions', 'blue');
  log('Add the three required secrets:', 'blue');
  log('  - VERCEL_TOKEN', 'green');
  log('  - VERCEL_ORG_ID', 'green');
  log('  - VERCEL_PROJECT_ID', 'green');
  
  logStep(3, 'Test Deployment');
  log('Push changes to your main branch to trigger automatic deployment', 'blue');
  log('Monitor the deployment in GitHub Actions tab', 'blue');
  
  logStep(4, 'Verify Deployment');
  log('Check your Vercel dashboard for the deployment status', 'blue');
  log('Visit your deployed application URL', 'blue');
  
  // Final success message
  logHeader('🎉 Setup Complete!');
  log('Your CapitalLeaf project is ready for automated deployment!', 'green');
  log('The CI/CD pipeline will automatically deploy to Vercel on every push to main branch.', 'green');
  
  log('\n📚 For more information, see:', 'cyan');
  log('- VERCEL_SETUP.md - Complete setup guide', 'blue');
  log('- .github/workflows/ci-cd.yml - CI/CD configuration', 'blue');
  log('- https://vercel.com/docs - Vercel documentation', 'blue');
}

// Handle errors gracefully
process.on('uncaughtException', (error) => {
  logError(`Unexpected error: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logError(`Unhandled rejection: ${reason}`);
  process.exit(1);
});

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  checkVercelCLI,
  checkVercelLogin,
  getVercelProjectInfo,
  getVercelOrgInfo,
  generateGitHubSecretsTemplate
};