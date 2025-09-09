# 🔐 GitHub Secrets Configuration Guide

This guide provides step-by-step instructions for configuring GitHub secrets required for CapitalLeaf's CI/CD pipeline with Vercel deployment.

## 📋 Table of Contents

- [Overview](#overview)
- [Required Secrets](#required-secrets)
- [Step-by-Step Setup](#step-by-step-setup)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)
- [Security Best Practices](#security-best-practices)

## 🎯 Overview

GitHub Secrets are encrypted environment variables that allow your GitHub Actions workflows to access sensitive information securely. For CapitalLeaf's CI/CD pipeline, you need to configure three specific secrets for Vercel deployment.

## 🔑 Required Secrets

| Secret Name | Description | Purpose |
|-------------|-------------|---------|
| `VERCEL_TOKEN` | Vercel API access token | Authenticate with Vercel API |
| `VERCEL_ORG_ID` | Vercel organization/team ID | Identify your Vercel team |
| `VERCEL_PROJECT_ID` | Vercel project ID | Target specific project for deployment |

## 📝 Step-by-Step Setup

### Step 1: Get Vercel Token

1. **Login to Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your account

2. **Navigate to Tokens Page**
   - Click on your profile icon (top right)
   - Select **"Settings"**
   - Go to **"Tokens"** tab

3. **Create New Token**
   - Click **"Create Token"**
   - **Name**: `CapitalLeaf-CI-CD`
   - **Scope**: Select **"Full Account"**
   - **Expiration**: Choose appropriate duration (recommend 1 year)
   - Click **"Create Token"**

4. **Copy Token**
   - ⚠️ **Important**: Copy the token immediately
   - Tokens are only shown once
   - Store it securely

### Step 2: Get Organization ID

1. **Go to Account Settings**
   - Visit [vercel.com/account](https://vercel.com/account)
   - Or click profile → **"Account"**

2. **Find Team ID**
   - Look for **"Team ID"** in the account information
   - Copy the ID (format: `team_xxxxxxxxxxxxxxxx`)

3. **Alternative Method**
   - Use the helper script: `npm run vercel:credentials`
   - It will display your organization information

### Step 3: Get Project ID

1. **Go to Project Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Find your CapitalLeaf project

2. **Get Project ID**
   - Click on the project
   - Go to **"Settings"** tab
   - Find **"Project ID"** (format: `prj_xxxxxxxxxxxxxxxx`)

3. **Alternative Method**
   - Use the helper script: `npm run vercel:credentials`
   - It will display your project information

### Step 4: Add Secrets to GitHub

1. **Go to Repository Settings**
   - Navigate to your GitHub repository
   - Click **"Settings"** tab

2. **Access Secrets Section**
   - In the left sidebar, find **"Security"**
   - Click **"Secrets and variables"**
   - Select **"Actions"**

3. **Add First Secret: VERCEL_TOKEN**
   - Click **"New repository secret"**
   - **Name**: `VERCEL_TOKEN`
   - **Secret**: Paste your Vercel token
   - Click **"Add secret"**

4. **Add Second Secret: VERCEL_ORG_ID**
   - Click **"New repository secret"**
   - **Name**: `VERCEL_ORG_ID`
   - **Secret**: Paste your organization ID
   - Click **"Add secret"**

5. **Add Third Secret: VERCEL_PROJECT_ID**
   - Click **"New repository secret"**
   - **Name**: `VERCEL_PROJECT_ID`
   - **Secret**: Paste your project ID
   - Click **"Add secret"**

## ✅ Verification

### Method 1: Check GitHub Secrets

1. **Go to Repository Settings**
   - Navigate to **Settings** → **Secrets and variables** → **Actions**
   - Verify all three secrets are listed:
     - ✅ `VERCEL_TOKEN`
     - ✅ `VERCEL_ORG_ID`
     - ✅ `VERCEL_PROJECT_ID`

### Method 2: Test CI/CD Pipeline

1. **Make a Small Change**
   - Edit `README.md` or any file
   - Commit and push to `main` branch

2. **Check GitHub Actions**
   - Go to **Actions** tab in your repository
   - Look for the workflow run
   - Verify it completes successfully

3. **Check Vercel Deployment**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Verify new deployment appears
   - Check deployment status

### Method 3: Use Helper Script

```bash
npm run vercel:credentials
```

This script will:
- Check Vercel CLI installation
- Verify login status
- Display your organization and project information
- Generate a template for GitHub secrets

## 🔧 Troubleshooting

### Common Issues

#### 1. "Context access might be invalid" Warning

**Problem**: IDE shows warnings about invalid context access
**Solution**: These are just IDE warnings. The secrets work correctly in GitHub Actions.

#### 2. "Project not found" Error

**Problem**: Vercel can't find your project
**Solutions**:
- Verify `VERCEL_PROJECT_ID` is correct
- Check project exists in Vercel dashboard
- Ensure you have access to the project

#### 3. "Invalid token" Error

**Problem**: Vercel token is invalid
**Solutions**:
- Generate new token in Vercel dashboard
- Update `VERCEL_TOKEN` in GitHub secrets
- Check token permissions and expiration

#### 4. "Organization not found" Error

**Problem**: Vercel can't find your organization
**Solutions**:
- Verify `VERCEL_ORG_ID` is correct
- Check organization exists in Vercel
- Ensure you're a member of the organization

### Debug Steps

1. **Check Vercel CLI**
   ```bash
   vercel --version
   vercel whoami
   ```

2. **List Projects**
   ```bash
   vercel ls
   ```

3. **Check Teams**
   ```bash
   vercel teams ls
   ```

4. **Test Deployment**
   ```bash
   vercel --prod
   ```

## 🔒 Security Best Practices

### Token Security

1. **Use Minimal Permissions**
   - Only grant necessary permissions
   - Use "Full Account" scope only if needed

2. **Set Expiration**
   - Set reasonable expiration dates
   - Rotate tokens regularly

3. **Secure Storage**
   - Never commit tokens to code
   - Use GitHub secrets only
   - Don't share tokens in chat/email

### Organization Security

1. **Team Access**
   - Limit team member access
   - Use role-based permissions
   - Regular access reviews

2. **Project Isolation**
   - Separate projects by environment
   - Use different tokens for different purposes
   - Monitor deployment access

### Monitoring

1. **Audit Logs**
   - Monitor Vercel dashboard activity
   - Check GitHub Actions logs
   - Review deployment history

2. **Alerts**
   - Set up deployment notifications
   - Monitor failed deployments
   - Track security events

## 📊 Secret Management

### Updating Secrets

1. **Generate New Token**
   - Go to Vercel dashboard → Tokens
   - Create new token
   - Delete old token

2. **Update GitHub Secret**
   - Go to repository → Settings → Secrets
   - Click on secret name
   - Update value
   - Save changes

3. **Test Deployment**
   - Trigger new deployment
   - Verify it works correctly

### Rotating Secrets

**Recommended Schedule**:
- **Tokens**: Every 6-12 months
- **Project IDs**: Only when project changes
- **Organization IDs**: Only when organization changes

## 🎯 Quick Reference

### Required GitHub Secrets

```yaml
VERCEL_TOKEN: "vercel_xxxxxxxxxxxxxxxx"
VERCEL_ORG_ID: "team_xxxxxxxxxxxxxxxx"
VERCEL_PROJECT_ID: "prj_xxxxxxxxxxxxxxxx"
```

### Helper Commands

```bash
# Get Vercel credentials
npm run vercel:credentials

# Check Vercel CLI
vercel --version

# List projects
vercel ls

# Test deployment
vercel --prod
```

### Important URLs

- **Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)
- **Vercel Tokens**: [vercel.com/account/tokens](https://vercel.com/account/tokens)
- **Vercel Account**: [vercel.com/account](https://vercel.com/account)
- **GitHub Secrets**: Repository → Settings → Secrets and variables → Actions

## 🚀 Next Steps

After configuring GitHub secrets:

1. **Test CI/CD Pipeline**
   - Push changes to trigger deployment
   - Monitor GitHub Actions workflow
   - Verify Vercel deployment

2. **Set Up Monitoring**
   - Enable Vercel Analytics
   - Configure deployment notifications
   - Set up error monitoring

3. **Optimize Deployment**
   - Review build performance
   - Optimize dependencies
   - Configure caching

4. **Documentation**
   - Update team documentation
   - Share access procedures
   - Document troubleshooting steps

---

## 🆘 Need Help?

If you encounter issues:

1. **Run the helper script**: `npm run vercel:credentials`
2. **Check troubleshooting guide**: `VERCEL_TROUBLESHOOTING.md`
3. **Review setup guide**: `VERCEL_SETUP.md`
4. **Create GitHub issue**: [github.com/SifatAli008/CapitalLeaf/issues](https://github.com/SifatAli008/CapitalLeaf/issues)

Your CapitalLeaf cybersecurity framework is now ready for secure, automated deployment! 🛡️🚀