# CapitalLeaf Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd CapitalLeaf
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Start development servers**
   ```bash
   # Frontend only (for Vercel deployment)
   npm run dev
   
   # Backend only
   npm run dev:backend
   
   # Both frontend and backend
   npm run dev:full
   ```

## 📁 Project Structure

```
CapitalLeaf/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js 13+ app directory
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   └── lib/            # Utility libraries
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── src/                    # Backend Express.js application
│   ├── config/            # Database configuration
│   ├── middleware/        # Express middleware
│   ├── models/           # Database models
│   ├── services/         # Business logic services
│   └── utils/            # Utility functions
├── package.json          # Root package.json with all dependencies
└── vercel.json          # Vercel deployment configuration
```

## 🛠️ Available Scripts

### Root Level Commands
- `npm run dev` - Start frontend development server
- `npm run dev:backend` - Start backend development server
- `npm run dev:full` - Start both frontend and backend
- `npm run build` - Build frontend for production
- `npm run start` - Start production frontend server
- `npm run lint` - Run ESLint on frontend
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run install:all` - Install all dependencies

### Frontend Commands (in frontend/ directory)
- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 Deployment

### Vercel (Frontend Only)
The project is configured for Vercel deployment with the frontend directory as the source.

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the Next.js app in the frontend directory
3. Deployments will be triggered on every push to main branch

### Manual Deployment
```bash
# Build the frontend
npm run build

# The built files will be in frontend/.next/
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the frontend directory for local development:

```env
# Add any environment variables needed for your app
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Backend Configuration
The backend runs on port 3000 by default. You can change this by setting the `PORT` environment variable.

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**
   - Make sure all dependencies are installed: `npm run install:all`
   - Check for TypeScript errors: `npm run lint`

2. **Vercel Deployment Issues**
   - Ensure `vercel.json` is properly configured
   - Check that frontend directory contains the Next.js app

3. **ESLint Errors**
   - Run `npm run lint:fix` to automatically fix issues
   - Check `.eslintrc.json` configuration

### Getting Help
- Check the console for error messages
- Review the build logs in Vercel dashboard
- Ensure all dependencies are up to date

## 📝 Development Notes

- The project uses TypeScript for type safety
- Tailwind CSS is configured for styling
- ESLint is configured for code quality
- The backend is in demo mode (no database required)
- Authentication uses mock tokens for demonstration

## 🔒 Security Features

- Zero Trust Access Control
- Multi-Factor Authentication (2FA)
- Device Fingerprinting
- Risk Assessment
- Real-time Threat Intelligence
- Rate Limiting
- Input Validation
- CORS Protection
