# 🚀 Vercel Deployment Setup Guide

This guide provides comprehensive instructions for setting up Vercel deployment for the CapitalLeaf cybersecurity framework.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Vercel Account Setup](#vercel-account-setup)
- [Project Configuration](#project-configuration)
- [GitHub Secrets Configuration](#github-secrets-configuration)
- [Deployment Process](#deployment-process)
- [Troubleshooting](#troubleshooting)
- [Helper Scripts](#helper-scripts)

## 🔧 Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Git repository with GitHub
- Vercel account (free tier available)

## 🏗️ Vercel Account Setup

### 1. Create Vercel Account

1. Visit [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Complete the onboarding process

### 2. Install Vercel CLI

```bash
npm install -g vercel
```

### 3. Login to Vercel

```bash
vercel login
```

## 📁 Project Configuration

### 1. Vercel Configuration File

The project includes a `vercel.json` configuration file:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/.*",
      "dest": "src/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production",
    "PORT": "3000"
  }
}
```

### 2. Package.json Scripts

The following scripts are available:

```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "build": "npm run lint && npm run test:ci",
    "vercel:credentials": "node scripts/get-vercel-credentials.js"
  }
}
```

## 🔐 GitHub Secrets Configuration

### Required Secrets

Add these secrets to your GitHub repository:

1. **VERCEL_TOKEN** - Your Vercel API token
2. **VERCEL_ORG_ID** - Your Vercel organization ID
3. **VERCEL_PROJECT_ID** - Your Vercel project ID

### How to Add GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with the exact names above

### Getting Vercel Credentials

#### Method 1: Using Helper Script

```bash
npm run vercel:credentials
```

#### Method 2: Manual Process

1. **Get Vercel Token:**
   - Go to [Vercel Dashboard](https://vercel.com/account/tokens)
   - Click **Create Token**
   - Name: `CapitalLeaf-CI-CD`
   - Scope: `Full Account`
   - Copy the token

2. **Get Organization ID:**
   - Go to [Vercel Dashboard](https://vercel.com/account)
   - Copy the **Team ID** from the URL or settings

3. **Get Project ID:**
   - Go to your project in Vercel Dashboard
   - Copy the **Project ID** from the URL or settings

## 🚀 Deployment Process

### Automatic Deployment (CI/CD)

The project is configured for automatic deployment via GitHub Actions:

- **Staging**: Deploys to `develop` branch
- **Production**: Deploys to `main` branch

### Manual Deployment

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. "Project not found" Error

**Problem**: Vercel can't find your project
**Solution**: 
- Ensure `VERCEL_PROJECT_ID` is correct
- Verify project exists in your Vercel dashboard
- Check organization permissions

#### 2. "Invalid token" Error

**Problem**: Vercel token is invalid or expired
**Solution**:
- Generate a new token in Vercel dashboard
- Update `VERCEL_TOKEN` in GitHub secrets
- Ensure token has correct permissions

#### 3. "Build failed" Error

**Problem**: Application build fails
**Solution**:
- Check `vercel.json` configuration
- Verify all dependencies are in `package.json`
- Check Node.js version compatibility

#### 4. "Port already in use" Error

**Problem**: Port 3000 is already in use
**Solution**:
- Vercel automatically handles port assignment
- Check if multiple instances are running
- Restart the deployment

#### 5. Environment Variables Not Working

**Problem**: Environment variables not accessible
**Solution**:
- Add variables in Vercel dashboard
- Update `vercel.json` with env variables
- Redeploy the application

### Debug Commands

```bash
# Check Vercel CLI version
vercel --version

# Check project status
vercel ls

# View deployment logs
vercel logs [deployment-url]

# Check environment variables
vercel env ls
```

## 📊 Monitoring and Analytics

### Vercel Analytics

- **Performance**: Monitor app performance
- **Usage**: Track API calls and bandwidth
- **Errors**: Monitor application errors
- **Real-time**: Live user activity

### GitHub Actions Monitoring

- **Workflow Runs**: Monitor CI/CD pipeline
- **Deployment Status**: Track deployment success
- **Security Scanning**: Monitor vulnerability scans

## 🔒 Security Considerations

### API Security

- **Rate Limiting**: Implement rate limiting
- **Authentication**: Secure API endpoints
- **CORS**: Configure cross-origin requests
- **Helmet**: Security headers middleware

### Environment Security

- **Secrets**: Never commit secrets to code
- **Environment Variables**: Use Vercel environment variables
- **Access Control**: Limit Vercel account access

## 📈 Performance Optimization

### Build Optimization

- **Dependencies**: Minimize package size
- **Code Splitting**: Optimize bundle size
- **Caching**: Implement proper caching
- **CDN**: Leverage Vercel's global CDN

### Runtime Optimization

- **Memory**: Monitor memory usage
- **CPU**: Optimize CPU-intensive operations
- **Database**: Optimize database queries
- **API**: Implement efficient API design

## 🆘 Support and Resources

### Documentation

- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)

### Community

- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [GitHub Community](https://github.community/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/vercel)

### Contact

- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **GitHub Support**: [github.com/support](https://github.com/support)

## 📝 Quick Reference

### Essential Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Get project credentials
npm run vercel:credentials

# Check deployment status
vercel ls

# View logs
vercel logs [deployment-url]
```

### Required GitHub Secrets

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `VERCEL_TOKEN` | API token for Vercel | Vercel Dashboard → Tokens |
| `VERCEL_ORG_ID` | Organization/Team ID | Vercel Dashboard → Account |
| `VERCEL_PROJECT_ID` | Project ID | Vercel Dashboard → Project |

### Vercel URLs

- **Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)
- **Account Settings**: [vercel.com/account](https://vercel.com/account)
- **Tokens**: [vercel.com/account/tokens](https://vercel.com/account/tokens)
- **Documentation**: [vercel.com/docs](https://vercel.com/docs)

---

## 🎯 Next Steps

1. **Set up Vercel account** and install CLI
2. **Configure GitHub secrets** with your credentials
3. **Test deployment** with a preview deployment
4. **Monitor CI/CD pipeline** in GitHub Actions
5. **Set up monitoring** and analytics in Vercel

Your CapitalLeaf cybersecurity framework is now ready for enterprise-grade deployment! 🛡️🚀