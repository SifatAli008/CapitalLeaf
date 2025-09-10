# Deployment Guide

## 🚀 Vercel Deployment Setup

### 1. Vercel Configuration
The project is configured for automatic deployment to Vercel with the following setup:

- **Framework**: Next.js
- **Build Command**: `cd frontend && npm install && npm run build`
- **Output Directory**: `frontend/.next`
- **Node.js Version**: 18.x

### 2. Required Vercel Environment Variables

Set these in your Vercel dashboard under Project Settings > Environment Variables:

```bash
# Application URLs
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_API_URL=https://your-app.vercel.app/api

# Security Configuration
JWT_SECRET=your-super-secret-jwt-key-here
ENCRYPTION_KEY=your-encryption-key-here

# Feature Flags
NEXT_PUBLIC_ENABLE_2FA=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG=false

# API Configuration
API_RATE_LIMIT=100
API_TIMEOUT=30000
```

### 3. GitHub Secrets for CI/CD

Add these secrets to your GitHub repository (Settings > Secrets and variables > Actions):

```bash
# Vercel Secrets
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_PROJECT_ID=your-vercel-project-id

# Optional: For additional integrations
GITHUB_TOKEN=your-github-token
```

### 4. Getting Vercel Credentials

1. **VERCEL_TOKEN**: 
   - Go to Vercel Dashboard > Settings > Tokens
   - Create a new token with appropriate permissions

2. **VERCEL_ORG_ID**:
   - Go to Vercel Dashboard > Settings > General
   - Copy the Team ID

3. **VERCEL_PROJECT_ID**:
   - Go to your project in Vercel Dashboard
   - Copy the Project ID from the URL or settings

## 🔄 CI/CD Pipeline

### Automatic Deployments

The CI/CD pipeline automatically:

1. **On Pull Request**:
   - Runs linting and type checking
   - Builds the application
   - Deploys to Vercel preview
   - Runs security scans

2. **On Main Branch Push**:
   - Runs all checks
   - Deploys to production
   - Runs performance tests
   - Sends deployment notifications

### Manual Deployment

```bash
# Deploy to Vercel manually
npx vercel --prod

# Deploy preview
npx vercel

# Check deployment status
npm run check-deployment
```

## 🛠️ Local Development

### Prerequisites
- Node.js 18.0.0+
- npm or yarn

### Setup
```bash
# Install all dependencies
npm run install:all

# Start development servers
npm run dev:full

# Run tests
npm run test

# Run linting
npm run lint:fix
```

### Environment Variables
Create `.env.local` in the frontend directory:

```bash
# Copy from vercel-env.example
cp vercel-env.example frontend/.env.local

# Edit with your values
nano frontend/.env.local
```

## 🔍 Monitoring and Debugging

### Health Checks
- **Application Health**: `https://your-app.vercel.app/api/health`
- **Build Status**: Check GitHub Actions tab
- **Deployment Logs**: Vercel Dashboard > Functions

### Performance Monitoring
- **Lighthouse Reports**: Generated automatically on deployment
- **Vercel Analytics**: Available in Vercel Dashboard
- **Core Web Vitals**: Monitored by Vercel

### Common Issues

1. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Deployment Issues**:
   - Verify Vercel configuration
   - Check environment variables
   - Review build logs

3. **Performance Issues**:
   - Run Lighthouse audit locally
   - Check bundle size
   - Optimize images and assets

## 📊 Deployment Status

### Success Indicators
- ✅ Build completes without errors
- ✅ All tests pass
- ✅ Lighthouse scores meet thresholds
- ✅ Security scan passes
- ✅ Application responds to health checks

### Rollback Procedure
If deployment fails:

1. **Automatic Rollback**: Vercel automatically rolls back on build failure
2. **Manual Rollback**: 
   ```bash
   npx vercel rollback
   ```
3. **Previous Deployment**: Use Vercel dashboard to revert to previous version

## 🔐 Security Considerations

- All deployments use HTTPS
- Security headers are automatically applied
- Dependencies are scanned for vulnerabilities
- Rate limiting is configured
- CORS is properly configured

## 📈 Performance Optimization

- Images are automatically optimized by Vercel
- Static assets are cached
- CDN is used for global distribution
- Bundle size is monitored
- Core Web Vitals are tracked
