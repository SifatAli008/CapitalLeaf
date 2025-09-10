# Vercel Deployment Guide for CapitalLeaf

## Quick Fix for "react-scripts: command not found" Error

The error occurs because Vercel is trying to use Create React App commands, but this project uses Next.js. Here's how to fix it:

## Solution

### 1. Vercel Configuration

The project now includes a proper `vercel.json` configuration:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/next"
    }
  ]
}
```

### 2. Project Structure

- **Frontend**: Next.js app in `/frontend` directory
- **Backend**: Express.js API in `/src` directory (not deployed to Vercel)
- **API Routes**: Next.js API routes in `/frontend/src/app/api/`

### 3. Deployment Steps

1. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect it's a Next.js project

2. **Configure Build Settings**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

3. **Environment Variables** (if needed):
   ```
   NODE_ENV=production
   ```

### 4. Alternative: Manual Configuration

If automatic detection doesn't work:

1. **Set Root Directory**: `frontend`
2. **Override Build Command**: `npm run build`
3. **Override Install Command**: `npm install`

### 5. Verify Deployment

After deployment, your app should be available at:
- **Frontend**: `https://your-app.vercel.app`
- **API Routes**: `https://your-app.vercel.app/api/auth/login`

## Troubleshooting

### Common Issues:

1. **"react-scripts: command not found"**:
   - ✅ Fixed with proper `vercel.json` configuration
   - ✅ Set root directory to `frontend`

2. **Build fails**:
   - Check that all dependencies are in `frontend/package.json`
   - Ensure TypeScript compilation works locally

3. **API routes not working**:
   - Verify API routes are in `frontend/src/app/api/`
   - Check Next.js API route syntax

### Local Testing:

```bash
# Test frontend build
cd frontend
npm run build
npm run start

# Test API routes
curl http://localhost:3000/api/auth/login
```

## Project Status

- ✅ **Frontend**: Next.js 14.2.5 with TypeScript
- ✅ **API Routes**: Next.js API routes for authentication
- ✅ **Styling**: Tailwind CSS
- ✅ **2FA**: Google Authenticator integration
- ✅ **Vercel Config**: Proper configuration for deployment

## Notes

- The backend Express.js server (`/src`) is not deployed to Vercel
- All API functionality is handled by Next.js API routes
- The app runs in demo mode (no database required)
- All authentication and 2FA features work through Next.js API routes

## Support

If you encounter issues:
1. Check the Vercel deployment logs
2. Verify the root directory is set to `frontend`
3. Ensure all dependencies are installed
4. Test the build locally first
