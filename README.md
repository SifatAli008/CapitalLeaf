# CapitalLeaf 🛡️

## Dynamic Defense with Microservice Isolation, Behavior-Driven Protection & Live Threat Intelligence

A comprehensive cybersecurity framework designed specifically for financial platforms to protect against lateral attacks, data theft, and rapidly evolving vulnerabilities. **Now with a complete Next.js frontend and Express.js backend!**

## ✨ What's New

- **🎨 Modern React Frontend** - Beautiful, responsive UI built with Next.js 14
- **🔐 Complete Authentication System** - Login, registration, and 2FA with Google Authenticator
- **📱 Device Fingerprinting** - Advanced device detection and trust management
- **🛡️ Real-time Security** - Live threat detection and risk assessment
- **🎯 Demo Mode** - Fully functional demo without database requirements

## 🚀 Features

### Frontend Features

- **🎨 Modern UI/UX** - Beautiful, responsive design with Tailwind CSS
- **🔐 Multi-Factor Authentication** - Google Authenticator integration
- **📱 Device Fingerprinting** - Browser and device detection
- **🔄 Real-time Updates** - Live security status and notifications
- **📊 Dashboard** - Comprehensive security overview
- **👤 User Management** - Complete profile and account management

### Backend Security Components

- **🔐 Zero Trust Access Control** - Continuous user verification using behavioral, device, and contextual metrics
- **🤖 AI-Driven Intrusion Detection** - Monitors login and access patterns to flag anomalous behaviors
- **🏗️ Microservice Network Segmentation** - Prevents lateral movement of threats across service boundaries
- **📊 Behavior-Driven Data Loss Prevention (DLP)** - Detects and blocks unauthorized transmission of sensitive data
- **🎯 Real-Time Threat Intelligence** - Immediate detection and response to emerging threats

### Threat Categories Covered

1. **Infiltration** - Zero Trust Access Control, AI-Driven Intrusion Detection, Adaptive MFA
2. **Propagation** - Microservice Isolation, File Integrity Monitoring, Service-to-Service Analytics
3. **Aggregation** - Role-Based Access to Data Vaults, Secure Data Pipelines with Audit Trails
4. **Exfiltration** - Behavior-Aware DLP Engine, Honeytokens and Decoy Records

## 📋 Prerequisites

- Node.js >= 18.0.0
- Git
- Modern web browser

> **Note**: The application runs in demo mode by default, so no database setup is required!

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/SifatAli008/CapitalLeaf.git
cd CapitalLeaf
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Environment Configuration (Optional)

```bash
# Copy the example environment file
cp env.example .env

# Edit the .env file with your configuration (optional for demo mode)
```

### 4. Start the Application

#### Option A: Start Both Services (Recommended)

```bash
# Start backend server (Terminal 1)
npm start

# Start frontend development server (Terminal 2)
cd frontend
npm run dev
```

#### Option B: Development Mode

```bash
# Backend with auto-restart
npm run dev

# Frontend with hot reload
cd frontend && npm run dev
```

## 🌐 Access the Application

- **Frontend**: [http://localhost:3001](http://localhost:3001)
- **Backend API**: [http://localhost:3000](http://localhost:3000)
- **Health Check**: [http://localhost:3000/health](http://localhost:3000/health)

## 🧪 Demo Credentials

The application includes demo mode with test credentials:

- **Username**: `demo@capitalleaf.com`
- **Password**: `SecurePass123!`
- **2FA Code**: Any 6-digit number (e.g., `123456`)

> **Note**: You can also use any username/password combination for testing!

## 🎯 Quick Start Guide

### 1. Login Flow

1. Visit [http://localhost:3001](http://localhost:3001)
2. Click "Sign In" or go to `/login`
3. Enter demo credentials or any credentials
4. Complete 2FA verification with any 6-digit code
5. Access the dashboard

### 2. Registration Flow

1. Go to `/register`
2. Fill out the registration form
3. Automatic login after successful registration

### 3. Dashboard Features

- View security status
- Check device trust level
- Monitor threat intelligence
- Manage account settings

## 🔧 Configuration

### Environment Variables

Key configuration options in your `.env` file:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration (Optional for demo mode)
DATABASE_URL=mongodb://localhost:27017/capitalleaf

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Security Configuration
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=http://localhost:3001

# Frontend URL
FRONTEND_URL=http://localhost:3001

# Demo Mode (set to false for production)
DEMO_MODE=true
```

## 📚 API Endpoints

### Authentication Endpoints

- `POST /api/auth/login` - User login with 2FA support
- `POST /api/auth/register` - User registration
- `POST /api/auth/verify-mfa` - 2FA verification
- `POST /api/auth/register-device` - Device registration
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - User logout

### Security Endpoints

- `GET /` - Framework status and information
- `GET /health` - Health check endpoint
- `POST /api/threats/analyze` - Analyze activity for threats
- `GET /api/threats/summary` - Get threat intelligence summary
- `POST /api/auth/assess-risk` - Risk assessment

### Access Control Endpoints

- `POST /api/access/check` - Role-based access control check
- `GET /api/access/roles` - Get all available roles
- `GET /api/access/vaults` - Get all data vaults
- `GET /api/access/user/:userId/summary` - Get user access summary
- `GET /api/access/vault/:vaultName/summary` - Get vault access summary

### Data Pipeline Endpoints

- `POST /api/pipeline/process` - Process data through secure pipeline
- `GET /api/pipeline/stats` - Get all pipeline statistics
- `GET /api/pipeline/stats/:pipelineName` - Get specific pipeline statistics
- `GET /api/pipeline/audit` - Get audit trails with filtering
- `GET /api/pipeline/summary` - Get data flow monitoring summary

## 🧪 Testing

```bash
# Run backend tests
npm test

# Run frontend tests
cd frontend
npm test

# Run frontend linting
cd frontend
npm run lint

# Run all tests with coverage
npm run test:coverage
```

## 📊 Project Structure

```text
CapitalLeaf/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   │   ├── login/       # Login page
│   │   │   ├── register/    # Registration page
│   │   │   ├── verify-2fa/  # 2FA verification page
│   │   │   ├── dashboard/   # Dashboard page
│   │   │   ├── account/     # Account management
│   │   │   └── api/         # API routes
│   │   ├── components/      # React components
│   │   │   ├── CapitalLeafLogo.tsx
│   │   │   └── DeviceFingerprint.tsx
│   │   ├── contexts/        # React contexts
│   │   │   └── AuthContext.tsx
│   │   └── lib/            # Utility libraries
│   │       └── 2fa-store.ts
│   ├── public/             # Static assets
│   ├── package.json
│   └── next.config.js
├── src/                     # Express.js backend
│   ├── middleware/          # Express middleware
│   │   ├── auth.js
│   │   └── validation.js
│   ├── services/           # Business logic services
│   │   └── threatIntelligence.js
│   ├── utils/              # Utility functions
│   │   └── jwt.js
│   ├── models/             # Data models
│   │   └── User.js
│   ├── config/             # Configuration
│   │   └── database.js
│   └── index.js            # Main server file
├── package.json            # Root package.json
├── env.example             # Environment variables template
└── README.md
```

## 🔒 Security Features

### Authentication & Authorization

- **Multi-Factor Authentication** - Google Authenticator TOTP integration
- **Device Fingerprinting** - Browser and device detection
- **JWT Tokens** - Secure token-based authentication
- **Rate Limiting** - API rate limiting and abuse prevention
- **Session Management** - Secure session handling

### Threat Detection

- **AI-powered anomaly detection** - Behavioral pattern analysis
- **Real-time threat intelligence** - Live threat monitoring
- **Risk Assessment** - Dynamic risk scoring
- **Automated incident response** - Immediate threat response

### Data Protection

- **Behavior-driven DLP** - Data loss prevention
- **Data classification** - Sensitive data identification
- **Encryption** - Data encryption at rest and in transit
- **Audit trails** - Comprehensive logging

### Network Security

- **Microservice isolation** - Service boundary protection
- **Network segmentation** - Traffic isolation
- **Traffic analysis** - Network monitoring
- **Lateral movement prevention** - Attack containment

## 🚨 Recent Fixes & Improvements

### ✅ Fixed Issues

- **Infinite Redirect Loop** - Resolved 2FA page redirect issues
- **Missing 2FA Page** - Created complete 2FA verification page
- **Authentication State** - Fixed authentication state management
- **Form Submission** - Prevented multiple form submissions
- **Device Fingerprinting** - Enhanced device detection
- **Error Handling** - Improved error handling and user feedback

### 🆕 New Features

- **Complete Frontend** - Full React/Next.js application
- **2FA Integration** - Google Authenticator support
- **Device Management** - Device trust and fingerprinting
- **Demo Mode** - No database required for testing
- **Responsive Design** - Mobile-friendly interface
- **Real-time Updates** - Live security status

## 📈 Performance

- **High Availability** - Designed for 99.9% uptime
- **Scalable Architecture** - Microservice-based design
- **Real-time Processing** - Sub-second threat detection
- **Low Latency** - Optimized for financial services
- **Fast Frontend** - Next.js with optimized performance

## 🚀 Deployment

### Development

```bash
# Start both services
npm start                    # Backend on port 3000
cd frontend && npm run dev   # Frontend on port 3001
```

### Production

```bash
# Build frontend
cd frontend
npm run build

# Start production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue on GitHub
- Check the documentation above
- Review the troubleshooting guide
- Test with demo credentials

## 🔮 Roadmap

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Email verification system
- [ ] Password reset functionality
- [ ] Admin dashboard
- [ ] Advanced threat intelligence feeds
- [ ] Mobile app integration
- [ ] Cloud deployment options
- [ ] Enhanced behavioral analytics

## 🎯 Demo Walkthrough

1. **Start the Application**

   ```bash
   npm start
   cd frontend && npm run dev
   ```

2. **Access the Frontend**

   - Open [http://localhost:3001](http://localhost:3001)
   - Click "Sign In"

3. **Login Process**

   - Enter: `demo@capitalleaf.com`
   - Password: `SecurePass123!`
   - Click "Sign In"

4. **2FA Verification**

   - Enter any 6-digit code (e.g., `123456`)
   - Click "Verify Code"

5. **Dashboard Access**

   - View security status
   - Check device information
   - Explore features

---

**CapitalLeaf** - Protecting financial platforms with intelligent, behavior-driven security.

## 🚀 Status

- ✅ **Frontend**: Fully functional Next.js application
- ✅ **Backend**: Complete Express.js API
- ✅ **Authentication**: Login, registration, and 2FA
- ✅ **Security**: Threat detection and risk assessment
- ✅ **Documentation**: Comprehensive guides and examples
