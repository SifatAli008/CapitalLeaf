# CapitalLeaf CI/CD Pipeline 🚀

This document describes the Continuous Integration and Continuous Deployment (CI/CD) pipeline for the CapitalLeaf cybersecurity framework.

## 🔄 Pipeline Overview

Our CI/CD pipeline ensures that every code change is automatically tested, built, and deployed with security best practices.

### Pipeline Stages

1. **🧪 Testing & Quality Assurance**
   - Automated testing on Node.js 18.x and 20.x
   - Code linting and formatting checks
   - Security vulnerability scanning
   - Coverage reporting

2. **🏗️ Build & Package**
   - Dependency installation and caching
   - Application building
   - Artifact generation

3. **🔒 Security Scanning**
   - Trivy vulnerability scanning
   - Dependency audit
   - Security policy enforcement

4. **🚀 Deployment**
   - **Staging**: Automatic deployment on `develop` branch
   - **Production**: Automatic deployment on `main` branch
   - Vercel integration with environment-specific configs

## 📋 Workflow Files

### Main CI/CD Pipeline (`.github/workflows/ci-cd.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` branch

**Jobs:**
- `test`: Runs tests, linting, and security audits
- `build`: Builds the application and creates artifacts
- `deploy-staging`: Deploys to Vercel staging environment
- `deploy-production`: Deploys to Vercel production environment
- `security-scan`: Performs comprehensive security scanning

### Dependency Updates (`.github/workflows/dependabot.yml`)

**Triggers:**
- Weekly schedule (Mondays at 2 AM UTC)
- Manual workflow dispatch

**Features:**
- Automatic dependency updates
- Security patch application
- Automated pull request creation

### Dependabot Configuration (`.github/dependabot.yml`)

**Features:**
- Weekly npm dependency updates
- GitHub Actions updates
- Automated PR creation with proper labels
- Security-focused update prioritization

## 🔐 Required Secrets

To enable full CI/CD functionality, configure these secrets in your GitHub repository:

### Vercel Integration
```bash
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_PROJECT_ID=your-vercel-project-id
```

### Security Scanning
```bash
GITHUB_TOKEN=automatically-provided-by-github
```

## 🛠️ Setup Instructions

### 1. Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add the required secrets listed above

### 2. Get Vercel Credentials

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Get your project ID
vercel project ls
```

### 3. Environment Configuration

The pipeline uses different environments:

- **Development**: Local development with `npm run dev`
- **Staging**: Vercel preview deployments
- **Production**: Vercel production deployments

## 🚦 Pipeline Status

You can monitor pipeline status through:

- **GitHub Actions Tab**: View all workflow runs
- **Vercel Dashboard**: Monitor deployment status
- **Codecov**: Track test coverage
- **Security Tab**: Review vulnerability scans

## 🔍 Quality Gates

The pipeline enforces these quality gates:

### Code Quality
- ✅ All tests must pass
- ✅ Linting must pass without errors
- ✅ Code coverage thresholds met

### Security
- ✅ No high-severity vulnerabilities
- ✅ Dependencies are up-to-date
- ✅ Security scans pass

### Deployment
- ✅ Build artifacts created successfully
- ✅ Environment variables configured
- ✅ Health checks pass

## 🚨 Troubleshooting

### Common Issues

1. **Vercel Deployment Fails**
   - Check Vercel token and project ID
   - Verify environment variables
   - Review build logs in Vercel dashboard

2. **Tests Fail**
   - Check test environment setup
   - Verify database connections
   - Review test configuration

3. **Security Scan Fails**
   - Update vulnerable dependencies
   - Review security policies
   - Check Trivy scan results

### Debug Commands

```bash
# Run tests locally
npm test

# Run linting
npm run lint

# Check security vulnerabilities
npm audit

# Build application
npm run build
```

## 📊 Monitoring & Metrics

### Key Metrics Tracked

- **Build Success Rate**: Percentage of successful builds
- **Deployment Frequency**: How often deployments occur
- **Mean Time to Recovery**: Time to fix failed deployments
- **Test Coverage**: Percentage of code covered by tests
- **Security Score**: Vulnerability assessment results

### Dashboards

- **GitHub Actions**: Build and deployment status
- **Vercel Analytics**: Performance and usage metrics
- **Codecov**: Test coverage trends
- **Security Tab**: Vulnerability tracking

## 🔮 Future Enhancements

- [ ] Integration with additional security tools
- [ ] Performance testing automation
- [ ] Blue-green deployment strategy
- [ ] Automated rollback capabilities
- [ ] Multi-environment promotion pipeline

## 📞 Support

For CI/CD pipeline issues:

1. Check GitHub Actions logs
2. Review Vercel deployment logs
3. Consult this documentation
4. Create an issue in the repository

---

**CapitalLeaf CI/CD Pipeline** - Ensuring secure, reliable, and automated deployments for your cybersecurity framework.
