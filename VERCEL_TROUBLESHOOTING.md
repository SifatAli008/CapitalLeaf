# 🔧 Vercel Troubleshooting Guide

This guide helps you resolve common issues with Vercel deployment for the CapitalLeaf cybersecurity framework.

## 📋 Table of Contents

- [Common Deployment Issues](#common-deployment-issues)
- [GitHub Actions Issues](#github-actions-issues)
- [Environment Variables](#environment-variables)
- [Build Failures](#build-failures)
- [Performance Issues](#performance-issues)
- [Security Issues](#security-issues)
- [Debug Commands](#debug-commands)
- [Support Resources](#support-resources)

## 🚨 Common Deployment Issues

### 1. "Project not found" Error

**Symptoms:**
```
Error: Project not found
```

**Causes:**
- Incorrect `VERCEL_PROJECT_ID` in GitHub secrets
- Project deleted from Vercel dashboard
- Wrong organization/team selected

**Solutions:**
1. **Verify Project ID:**
   ```bash
   npm run vercel:credentials
   ```

2. **Check Vercel Dashboard:**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Verify project exists
   - Copy correct Project ID

3. **Update GitHub Secrets:**
   - Go to GitHub repository → Settings → Secrets
   - Update `VERCEL_PROJECT_ID` with correct value

### 2. "Invalid token" Error

**Symptoms:**
```
Error: Invalid token
```

**Causes:**
- Expired Vercel token
- Incorrect token permissions
- Token not properly added to GitHub secrets

**Solutions:**
1. **Generate New Token:**
   - Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
   - Delete old token
   - Create new token with "Full Account" scope

2. **Update GitHub Secrets:**
   - Go to GitHub repository → Settings → Secrets
   - Update `VERCEL_TOKEN` with new token

3. **Verify Token Permissions:**
   - Ensure token has access to your organization
   - Check token expiration date

### 3. "Build failed" Error

**Symptoms:**
```
Build failed: Command failed
```

**Causes:**
- Missing dependencies
- Incorrect Node.js version
- Build script errors
- Memory limits exceeded

**Solutions:**
1. **Check Dependencies:**
   ```bash
   npm install
   npm run build
   ```

2. **Verify Node.js Version:**
   - Ensure `package.json` has correct `engines` field
   - Vercel supports Node.js 18.x and 20.x

3. **Check Build Scripts:**
   ```json
   {
     "scripts": {
       "build": "npm run lint && npm run test:ci"
     }
   }
   ```

4. **Memory Optimization:**
   - Reduce bundle size
   - Optimize dependencies
   - Use Vercel's memory limits efficiently

### 4. "Port already in use" Error

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Causes:**
- Multiple instances running
- Port conflict in tests
- Incorrect port configuration

**Solutions:**
1. **Use Environment Variables:**
   ```javascript
   const PORT = process.env.PORT || 3000;
   ```

2. **Fix Test Configuration:**
   - Use isolated test apps
   - Avoid starting server in tests
   - Use different ports for testing

3. **Vercel Configuration:**
   ```json
   {
     "env": {
       "PORT": "3000"
     }
   }
   ```

## 🔄 GitHub Actions Issues

### 1. "Secrets not found" Error

**Symptoms:**
```
Error: Context access might be invalid: VERCEL_TOKEN
```

**Causes:**
- GitHub secrets not configured
- Incorrect secret names
- Repository permissions

**Solutions:**
1. **Verify Secret Names:**
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

2. **Check Repository Settings:**
   - Go to GitHub repository → Settings → Secrets
   - Verify all secrets are present
   - Check repository permissions

3. **Test Secrets:**
   ```bash
   npm run vercel:credentials
   ```

### 2. "Workflow failed" Error

**Symptoms:**
```
Workflow failed: Run Tests & Linting
```

**Causes:**
- Test failures
- Linting errors
- Dependency issues

**Solutions:**
1. **Run Tests Locally:**
   ```bash
   npm test
   npm run lint
   ```

2. **Fix Test Issues:**
   - Update test files
   - Fix linting errors
   - Resolve dependency conflicts

3. **Check Workflow Configuration:**
   - Verify `.github/workflows/ci-cd.yml`
   - Check Node.js versions
   - Ensure proper caching

### 3. "Deployment timeout" Error

**Symptoms:**
```
Error: Deployment timeout
```

**Causes:**
- Long build times
- Network issues
- Resource limits

**Solutions:**
1. **Optimize Build Process:**
   - Reduce dependencies
   - Optimize build scripts
   - Use build caching

2. **Check Network:**
   - Verify internet connection
   - Check Vercel status page
   - Retry deployment

3. **Resource Optimization:**
   - Optimize code
   - Reduce bundle size
   - Use efficient algorithms

## 🌍 Environment Variables

### 1. "Environment variable not found" Error

**Symptoms:**
```
Error: process.env.VARIABLE_NAME is undefined
```

**Causes:**
- Variable not set in Vercel
- Incorrect variable name
- Missing from `vercel.json`

**Solutions:**
1. **Set in Vercel Dashboard:**
   - Go to project → Settings → Environment Variables
   - Add required variables
   - Set for all environments

2. **Update `vercel.json`:**
   ```json
   {
     "env": {
       "NODE_ENV": "production",
       "PORT": "3000"
     }
   }
   ```

3. **Use Default Values:**
   ```javascript
   const PORT = process.env.PORT || 3000;
   const NODE_ENV = process.env.NODE_ENV || 'development';
   ```

### 2. "Sensitive data exposed" Error

**Symptoms:**
```
Warning: Sensitive data in logs
```

**Causes:**
- Secrets logged to console
- Environment variables exposed
- Debug information leaked

**Solutions:**
1. **Avoid Logging Secrets:**
   ```javascript
   // Bad
   console.log('Token:', process.env.VERCEL_TOKEN);
   
   // Good
   console.log('Token configured:', !!process.env.VERCEL_TOKEN);
   ```

2. **Use Secure Logging:**
   ```javascript
   const logger = require('winston');
   logger.info('Application started', { 
     port: process.env.PORT,
     nodeEnv: process.env.NODE_ENV 
   });
   ```

3. **Environment Validation:**
   ```javascript
   const requiredEnvVars = ['PORT', 'NODE_ENV'];
   requiredEnvVars.forEach(varName => {
     if (!process.env[varName]) {
       throw new Error(`Missing required environment variable: ${varName}`);
     }
   });
   ```

## 🏗️ Build Failures

### 1. "Dependencies not found" Error

**Symptoms:**
```
Error: Cannot find module 'module-name'
```

**Causes:**
- Missing dependencies in `package.json`
- Incorrect import paths
- Version conflicts

**Solutions:**
1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Check Import Paths:**
   ```javascript
   // Correct
   const express = require('express');
   
   // Incorrect
   const express = require('./express');
   ```

3. **Resolve Version Conflicts:**
   ```bash
   npm audit
   npm audit fix
   ```

### 2. "Syntax error" Error

**Symptoms:**
```
Error: SyntaxError: Unexpected token
```

**Causes:**
- JavaScript syntax errors
- Incorrect file encoding
- Missing semicolons

**Solutions:**
1. **Run Linting:**
   ```bash
   npm run lint
   npm run lint:fix
   ```

2. **Check File Encoding:**
   - Ensure UTF-8 encoding
   - Check line endings (LF vs CRLF)

3. **Validate Syntax:**
   ```bash
   node -c src/index.js
   ```

### 3. "Memory limit exceeded" Error

**Symptoms:**
```
Error: JavaScript heap out of memory
```

**Causes:**
- Large bundle size
- Memory leaks
- Inefficient algorithms

**Solutions:**
1. **Optimize Bundle:**
   - Remove unused dependencies
   - Use code splitting
   - Optimize imports

2. **Fix Memory Leaks:**
   - Clear timers
   - Remove event listeners
   - Use proper cleanup

3. **Increase Memory Limit:**
   ```json
   {
     "scripts": {
       "build": "node --max-old-space-size=4096 build.js"
     }
   }
   ```

## ⚡ Performance Issues

### 1. "Slow deployment" Issue

**Symptoms:**
- Long build times
- Slow deployment process
- Timeout errors

**Solutions:**
1. **Optimize Dependencies:**
   ```bash
   npm audit
   npm update
   ```

2. **Use Build Caching:**
   ```yaml
   - name: Cache dependencies
     uses: actions/cache@v3
     with:
       path: ~/.npm
       key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
   ```

3. **Optimize Build Scripts:**
   - Remove unnecessary steps
   - Use parallel processing
   - Cache build artifacts

### 2. "Slow application" Issue

**Symptoms:**
- High response times
- Slow API calls
- Poor user experience

**Solutions:**
1. **Optimize Code:**
   - Use efficient algorithms
   - Implement caching
   - Optimize database queries

2. **Use Vercel Features:**
   - Edge functions
   - CDN caching
   - Image optimization

3. **Monitor Performance:**
   - Use Vercel Analytics
   - Implement monitoring
   - Track performance metrics

## 🔒 Security Issues

### 1. "Vulnerability detected" Error

**Symptoms:**
```
Warning: Security vulnerability found
```

**Causes:**
- Outdated dependencies
- Known security issues
- Vulnerable packages

**Solutions:**
1. **Update Dependencies:**
   ```bash
   npm audit
   npm audit fix
   npm update
   ```

2. **Use Security Scanning:**
   - Enable Dependabot
   - Use GitHub Security
   - Implement Trivy scanning

3. **Review Dependencies:**
   - Remove unused packages
   - Use trusted sources
   - Keep dependencies updated

### 2. "CORS error" Issue

**Symptoms:**
```
Error: CORS policy blocked
```

**Causes:**
- Incorrect CORS configuration
- Missing headers
- Cross-origin requests blocked

**Solutions:**
1. **Configure CORS:**
   ```javascript
   const cors = require('cors');
   app.use(cors({
     origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
     credentials: true
   }));
   ```

2. **Set Headers:**
   ```javascript
   app.use((req, res, next) => {
     res.header('Access-Control-Allow-Origin', '*');
     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
     next();
   });
   ```

## 🐛 Debug Commands

### Vercel CLI Commands

```bash
# Check Vercel CLI version
vercel --version

# Check login status
vercel whoami

# List projects
vercel ls

# Check project status
vercel inspect [project-url]

# View deployment logs
vercel logs [deployment-url]

# Check environment variables
vercel env ls

# Test deployment locally
vercel dev
```

### GitHub Actions Debug

```bash
# Check workflow status
gh run list

# View workflow logs
gh run view [run-id]

# Check repository secrets
gh secret list

# Test workflow locally
act -j test
```

### Node.js Debug

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Validate package.json
npm pack --dry-run

# Check dependencies
npm ls

# Audit dependencies
npm audit
```

## 📞 Support Resources

### Vercel Support

- **Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Support**: [vercel.com/support](https://vercel.com/support)
- **Status Page**: [vercel-status.com](https://vercel-status.com)

### GitHub Actions Support

- **Documentation**: [docs.github.com/en/actions](https://docs.github.com/en/actions)
- **Community**: [github.community](https://github.community)
- **Support**: [github.com/support](https://github.com/support)

### CapitalLeaf Project

- **Repository**: [github.com/SifatAli008/CapitalLeaf](https://github.com/SifatAli008/CapitalLeaf)
- **Issues**: [github.com/SifatAli008/CapitalLeaf/issues](https://github.com/SifatAli008/CapitalLeaf/issues)
- **Documentation**: See `VERCEL_SETUP.md` and `README.md`

## 🎯 Quick Fix Checklist

When encountering issues, check these in order:

1. **✅ Verify Vercel CLI Installation**
   ```bash
   vercel --version
   ```

2. **✅ Check Vercel Login**
   ```bash
   vercel whoami
   ```

3. **✅ Validate GitHub Secrets**
   ```bash
   npm run vercel:credentials
   ```

4. **✅ Run Tests Locally**
   ```bash
   npm test
   npm run lint
   ```

5. **✅ Check Dependencies**
   ```bash
   npm install
   npm audit
   ```

6. **✅ Verify Environment Variables**
   - Check Vercel dashboard
   - Verify `vercel.json` configuration

7. **✅ Monitor GitHub Actions**
   - Check workflow runs
   - Review error logs
   - Verify secret access

8. **✅ Test Deployment**
   ```bash
   vercel --prod
   ```

---

## 🆘 Still Need Help?

If you're still experiencing issues:

1. **Check the logs** in GitHub Actions and Vercel dashboard
2. **Run the helper script**: `npm run vercel:credentials`
3. **Review this guide** for specific error messages
4. **Check Vercel status page** for service issues
5. **Create an issue** in the GitHub repository

Your CapitalLeaf cybersecurity framework is designed to be robust and reliable. Most issues can be resolved by following this troubleshooting guide! 🛡️🚀
