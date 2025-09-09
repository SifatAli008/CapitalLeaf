# GitHub Secrets Setup for CI/CD 🚀

Your CapitalLeaf project is ready for automated CI/CD deployment! Here are the exact steps to configure the required secrets.

## 🔐 Required Secrets

You need to add these **3 secrets** to your GitHub repository:

### 1. VERCEL_TOKEN
- **Value**: Get from [https://vercel.com/account/tokens](https://vercel.com/account/tokens)
- **Steps**: 
  1. Go to Vercel Dashboard → Account Settings → Tokens
  2. Click "Create Token"
  3. Name it "CapitalLeaf CI/CD"
  4. Copy the generated token

### 2. VERCEL_ORG_ID
- **Value**: `team_9eEABLbyiHLdJRpp2L5GTlZF`
- **Source**: Your Vercel organization ID

### 3. VERCEL_PROJECT_ID
- **Value**: `prj_De3cGA6JkKs90PaSswIgX0TRl1Of`
- **Source**: Your CapitalLeaf project ID

## 📋 Step-by-Step Configuration

### Step 1: Go to GitHub Secrets
Click this link: [https://github.com/SifatAli008/CapitalLeaf/settings/secrets/actions](https://github.com/SifatAli008/CapitalLeaf/settings/secrets/actions)

### Step 2: Add Each Secret
For each secret below, click **"New repository secret"**:

#### Secret 1: VERCEL_TOKEN
- **Name**: `VERCEL_TOKEN`
- **Value**: [Your token from Vercel dashboard]
- **Click**: "Add secret"

#### Secret 2: VERCEL_ORG_ID
- **Name**: `VERCEL_ORG_ID`
- **Value**: `team_9eEABLbyiHLdJRpp2L5GTlZF`
- **Click**: "Add secret"

#### Secret 3: VERCEL_PROJECT_ID
- **Name**: `VERCEL_PROJECT_ID`
- **Value**: `prj_De3cGA6JkKs90PaSswIgX0TRl1Of`
- **Click**: "Add secret"

## ✅ Verification

After adding all secrets, you should see:
- ✅ `VERCEL_TOKEN` in your secrets list
- ✅ `VERCEL_ORG_ID` in your secrets list
- ✅ `VERCEL_PROJECT_ID` in your secrets list

## 🚀 Test CI/CD Pipeline

Once secrets are configured:

1. **Make a small change** to your code
2. **Commit and push** to main branch
3. **Check GitHub Actions** tab for automatic deployment
4. **Verify deployment** at [https://capital-leaf.vercel.app/](https://capital-leaf.vercel.app/)

## 🔍 Expected Results

Your CI/CD pipeline will:
- ✅ **Automatically test** your code on every push
- ✅ **Deploy to staging** on `develop` branch
- ✅ **Deploy to production** on `main` branch
- ✅ **Run security scans** and quality checks
- ✅ **Provide deployment URLs** in GitHub Actions logs

## 🛠️ Troubleshooting

### If deployment fails:
1. Check GitHub Actions logs for errors
2. Verify all 3 secrets are correctly added
3. Ensure Vercel token has proper permissions
4. Check Vercel dashboard for deployment status

### If secrets are not working:
1. Double-check secret names (case-sensitive)
2. Verify token is valid and not expired
3. Ensure organization and project IDs are correct

## 📞 Support

- **GitHub Actions**: Check the Actions tab in your repository
- **Vercel Dashboard**: Monitor deployments at [vercel.com/dashboard](https://vercel.com/dashboard)
- **Documentation**: See `VERCEL_SETUP.md` for detailed instructions

---

**Once configured, your CapitalLeaf cybersecurity framework will automatically deploy on every code change!** 🛡️✨
