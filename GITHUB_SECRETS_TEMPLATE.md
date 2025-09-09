
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
   - Value: YOUR_ORG_ID_HERE
   - Organization: YOUR_ORG_NAME

3. **VERCEL_PROJECT_ID**
   - Value: YOUR_PROJECT_ID_HERE
   - Project: YOUR_PROJECT_NAME

## How to Add Secrets:

1. Go to your GitHub repository
2. Click "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Add each secret with the exact names above

## Verification:

After adding secrets, your CI/CD pipeline will automatically deploy to Vercel.
Check the Actions tab in your GitHub repository to monitor deployments.
