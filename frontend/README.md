# CapitalLeaf Next.js Frontend

A modern, TypeScript-based frontend application for the CapitalLeaf Zero Trust Security Framework, built with Next.js 15, Tailwind CSS, and Lucide React icons.

## 🚀 Features

### ✅ Complete Application Pages
- **Login Page** - Professional authentication interface with device fingerprinting
- **Registration Page** - User account creation with password strength validation
- **Dashboard** - Comprehensive security monitoring and risk assessment
- **Account Page** - User profile management and security settings

### ✅ Zero Trust Security Features
- **Device Fingerprinting** - Automatic device analysis and identification
- **Risk Assessment** - Real-time security risk calculation and visualization
- **Adaptive MFA** - Multi-factor authentication based on risk levels
- **Behavioral Analysis** - User pattern monitoring and anomaly detection
- **Session Management** - Active session tracking and device trust

### ✅ Professional UI/UX
- **CapitalLeaf Branding** - Dual-font professional logo design
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Modern Components** - Clean, professional interface design
- **Smooth Animations** - Subtle transitions and loading states
- **Accessibility** - WCAG compliant design patterns

## 🛠️ Technology Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **React Context** - State management for authentication
- **Custom Components** - Reusable UI components

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   └── auth/          # Authentication endpoints
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── dashboard/         # Dashboard page
│   │   ├── account/           # Account settings page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page (redirects)
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   │   ├── CapitalLeafLogo.tsx    # Logo component
│   │   └── DeviceFingerprint.tsx # Device analysis
│   └── contexts/              # React contexts
│       └── AuthContext.tsx    # Authentication state
├── public/                     # Static assets
├── package.json               # Dependencies
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── next.config.ts             # Next.js configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn package manager

### Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3000/api

## 🎯 Application Flow

### 1. **Home Page** (`/`)
- Redirects to login if not authenticated
- Redirects to dashboard if authenticated

### 2. **Login Page** (`/login`)
- Professional authentication interface
- Device fingerprinting collection
- Demo credentials available
- Redirects to dashboard on success

### 3. **Registration Page** (`/register`)
- User account creation form
- Password strength validation
- Real-time form validation
- Redirects to login on success

### 4. **Dashboard** (`/dashboard`)
- Security overview and risk assessment
- Tabbed interface (Overview, Security, Sessions, Devices)
- Real-time risk score visualization
- Behavioral analysis results
- Session information display

### 5. **Account Page** (`/account`)
- User profile management
- Password change functionality
- Security settings overview
- Device management
- Application preferences

## 🔐 Authentication Features

### **Device Fingerprinting**
- Browser information collection
- Canvas fingerprinting
- WebGL fingerprinting
- Screen resolution and timezone
- Mobile device detection
- Emulator detection

### **Risk Assessment**
- Device risk factors
- Location risk analysis
- Behavioral pattern analysis
- Transaction risk evaluation
- Time-based risk assessment
- Network security analysis

### **Multi-Factor Authentication**
- SMS verification
- Email verification
- TOTP (Authenticator apps)
- Biometric verification
- Push notifications
- Risk-based MFA requirements

## 🎨 UI Components

### **CapitalLeaf Logo**
- Dual-font professional design
- "Capital" in sans-serif (dark blue-grey)
- "Leaf" in cursive (bright blue)
- Responsive sizing options
- Smooth animations

### **Device Fingerprint Component**
- Automatic device analysis
- Real-time fingerprinting
- Loading states
- Error handling

### **Authentication Forms**
- Professional styling
- Real-time validation
- Password strength indicators
- Error and success messages
- Responsive design

## 🔧 API Integration

### **Authentication Endpoints**
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/verify-mfa` - MFA verification
- `POST /api/auth/register-device` - Device registration

### **Demo Mode**
- Works without backend connection
- Mock authentication responses
- Graceful error handling
- Fallback functionality

## 📱 Responsive Design

- **Mobile First** - Optimized for mobile devices
- **Tablet Support** - Responsive layouts for tablets
- **Desktop Enhanced** - Enhanced features for desktop
- **Touch Friendly** - Optimized touch interactions

## 🎯 Demo Credentials

### **Login Credentials**
- **Username:** `admin`
- **Password:** `12345678`
- **Or use any username/password combination**

### **Registration**
- Create new accounts with any valid information
- Password must be at least 8 characters
- All fields are required

## 🚀 Production Deployment

### **Build for Production**
```bash
npm run build
```

### **Start Production Server**
```bash
npm start
```

### **Deploy to Vercel**
```bash
npx vercel
```

## 🔧 Development

### **Available Scripts**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### **Code Quality**
- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for consistent styling
- Component-based architecture

## 🛡️ Security Features

### **Frontend Security**
- Input validation and sanitization
- XSS protection
- CSRF protection
- Secure authentication flow
- Device fingerprinting
- Risk-based access control

### **Zero Trust Implementation**
- Continuous authentication
- Device trust management
- Behavioral analysis
- Risk assessment
- Adaptive security measures

## 📊 Performance

- **Fast Loading** - Optimized bundle sizes
- **Smooth Animations** - 60fps animations
- **Responsive Images** - Optimized image loading
- **Code Splitting** - Automatic code splitting
- **Caching** - Efficient caching strategies

## 🎉 Ready to Use

Your CapitalLeaf Next.js frontend is now ready with:

- ✅ **Complete Authentication Flow** - Login, registration, dashboard, account
- ✅ **Professional UI/UX** - Modern, responsive design
- ✅ **Zero Trust Security** - Device fingerprinting, risk assessment, MFA
- ✅ **TypeScript Support** - Type-safe development
- ✅ **Production Ready** - Optimized for deployment

**🌐 Access your application at: http://localhost:3000**

**🛡️ Your CapitalLeaf Zero Trust frontend is ready for fintech security!**