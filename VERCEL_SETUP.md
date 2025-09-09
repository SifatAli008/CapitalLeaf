# Vercel Deployment Setup Guide 🚀

This guide will help you configure the required Vercel secrets for automatic deployment in your CI/CD pipeline.

## 🔐 Required Secrets

Your GitHub Actions workflow requires these secrets to be configured:

- `VERCEL_TOKEN` - Your Vercel authentication token
- `VERCEL_ORG_ID` - Your Vercel organization ID  
- `VERCEL_PROJECT_ID` - Your Vercel project ID

## 📋 Step-by-Step Setup

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate with your Vercel account.

### 3. Link Your Project

```bash
# In your CapitalLeaf directory
vercel link
```

This will:
- Ask you to select your Vercel team/account
- Ask if you want to link to an existing project or create a new one
- Generate a `.vercel` folder with project configuration

### 4. Get Your Credentials

#### Get Vercel Token
```bash
# Method 1: From Vercel CLI
vercel whoami

# Method 2: From Vercel Dashboard
# Go to https://vercel.com/account/tokens
# Create a new token with appropriate permissions
```

#### Get Organization ID
```bash
# List your organizations
vercel teams list

# Or check your .vercel/project.json file
cat .vercel/project.json
```

#### Get Project ID
```bash
# List your projects
vercel project ls

# Or check your .vercel/project.json file
cat .vercel/project.json
```

### 5. Configure GitHub Secrets

1. Go to your GitHub repository: `https://github.com/SifatAli008/CapitalLeaf`
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each secret:

#### Add VERCEL_TOKEN
- **Name**: `VERCEL_TOKEN`
- **Value**: Your Vercel token from step 4

#### Add VERCEL_ORG_ID  
- **Name**: `VERCEL_ORG_ID`
- **Value**: Your organization ID from step 4

#### Add VERCEL_PROJECT_ID
- **Name**: `VERCEL_PROJECT_ID` 
- **Value**: Your project ID from step 4

## 🔍 Alternative: Manual Deployment

If you prefer to deploy manually without CI/CD automation:

### Deploy to Staging
```bash
vercel --prod=false
```

### Deploy to Production
```bash
vercel --prod
```

## 🛠️ Troubleshooting

### Common Issues

1. **"Context access might be invalid" warnings**
   - These are just warnings until secrets are configured
   - The workflow will work once secrets are added

2. **Vercel authentication errors**
   - Make sure you're logged in: `vercel whoami`
   - Re-authenticate if needed: `vercel logout && vercel login`

3. **Project not found errors**
   - Ensure project is linked: `vercel link`
   - Check project exists: `vercel project ls`

4. **Permission errors**
   - Verify your Vercel token has appropriate permissions
   - Check organization access rights

### Verification Commands

```bash
# Check authentication
vercel whoami

# List projects
vercel project ls

# Check project configuration
cat .vercel/project.json

# Test deployment
vercel --prod=false
```

## 📊 Expected Results

Once configured, your CI/CD pipeline will:

- ✅ **Automatically deploy** on every push to `main` branch
- ✅ **Create staging deployments** on `develop` branch
- ✅ **Run security scans** and quality checks
- ✅ **Provide deployment URLs** in GitHub Actions logs

## 🔗 Useful Links

- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Vercel Dashboard](https://vercel.com/dashboard)

---

**Note**: The warnings in your GitHub Actions workflow are normal until these secrets are configured. Once you add the secrets, the deployment will work automatically! 🚀
