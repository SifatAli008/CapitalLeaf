# CapitalLeaf Backend Setup Guide

## Overview

This guide covers the complete backend setup for CapitalLeaf's registration and login functionality. The backend is built with Express.js, MongoDB, and includes comprehensive security features.

## Features Implemented

### 🔐 Authentication & Authorization
- **User Registration**: Complete user registration with validation
- **User Login**: Secure login with risk assessment
- **JWT Tokens**: Access and refresh token generation
- **Password Security**: bcrypt hashing with salt rounds
- **Account Lockout**: Protection against brute force attacks
- **Device Fingerprinting**: Track and trust devices

### 🛡️ Security Features
- **Input Validation**: Joi schema validation for all endpoints
- **Rate Limiting**: Protection against abuse
- **CORS Configuration**: Secure cross-origin requests
- **Helmet**: Security headers
- **Risk Assessment**: Dynamic risk scoring
- **MFA Support**: Multi-factor authentication framework

### 📊 User Management
- **Profile Management**: View and update user profiles
- **Password Change**: Secure password updates
- **Device Management**: Track trusted devices
- **Session Management**: Secure session handling

## Project Structure

```
src/
├── config/
│   └── database.js          # MongoDB connection configuration
├── middleware/
│   ├── auth.js              # Authentication middleware
│   └── validation.js        # Input validation schemas
├── models/
│   └── User.js              # User data model with security features
├── utils/
│   └── jwt.js               # JWT token utilities
├── services/
│   └── threatIntelligence.js # Threat intelligence service
└── index.js                  # Main server file
```

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp env.example .env
```

Update the `.env` file with your configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_URL=your-database-connection-string-here

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
```

### 3. Database Setup

Make sure MongoDB is running on your system:

```bash
# Start MongoDB (if installed locally)
mongod

# Or use MongoDB Atlas (cloud)
# Update DATABASE_URL in .env with your Atlas connection string
```

### 4. Start the Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  },
  "tokens": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "expiresIn": "24h"
  },
  "session": {
    "sessionId": "jwt_token",
    "riskScore": 0.1,
    "requiresMFA": false,
    "mfaMethods": [],
    "deviceTrusted": false,
    "behavioralAnomaly": {
      "detected": false,
      "anomalies": [],
      "confidence": 0
    },
    "riskFactors": {
      "device": 0.1,
      "location": 0.1,
      "transaction": 0.0,
      "time": 0.1,
      "network": 0.0,
      "velocity": 0.0
    },
    "recommendations": ["Enable MFA for enhanced security"],
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST `/api/auth/login`
Authenticate user and create session.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "SecurePass123!",
  "userContext": {
    "deviceFingerprint": "device_fingerprint_hash",
    "deviceInfo": {
      "name": "Chrome Browser",
      "isMobile": false,
      "isEmulator": false
    },
    "browserInfo": {
      "userAgent": "Mozilla/5.0...",
      "language": "en-US",
      "platform": "Win32"
    }
  }
}
```

#### POST `/api/auth/logout`
Logout user (client-side token invalidation).

**Headers:**
```
Authorization: Bearer <access_token>
```

### User Management Endpoints

#### GET `/api/auth/profile`
Get user profile information.

**Headers:**
```
Authorization: Bearer <access_token>
```

#### PUT `/api/auth/profile`
Update user profile.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "newemail@example.com"
}
```

#### PUT `/api/auth/change-password`
Change user password.

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!"
}
```

#### GET `/api/auth/devices`
Get list of user's trusted devices.

### Security Endpoints

#### POST `/api/auth/verify-mfa`
Verify multi-factor authentication code.

#### POST `/api/auth/register-device`
Register a new trusted device.

#### POST `/api/auth/assess-risk`
Assess risk for user actions.

## Security Features

### Password Security
- Minimum 8 characters
- Must contain uppercase, lowercase, number, and special character
- bcrypt hashing with 12 salt rounds
- Password comparison using secure methods

### Account Protection
- Account lockout after 5 failed login attempts
- 2-hour lockout period
- Automatic unlock after successful login
- Account deactivation support

### Device Management
- Device fingerprinting
- Trusted device tracking
- Device-based risk assessment
- Device registration and management

### Risk Assessment
- Dynamic risk scoring based on:
  - Device characteristics
  - Account age
  - Login patterns
  - MFA status
  - Behavioral anomalies

### Input Validation
- Comprehensive Joi schemas
- Sanitization of user input
- Error handling with detailed messages
- Type checking and format validation

## Database Schema

### User Model
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  firstName: String (required),
  lastName: String (required),
  role: String (enum: ['user', 'admin', 'viewer']),
  isActive: Boolean (default: true),
  isEmailVerified: Boolean (default: false),
  lastLogin: Date,
  loginAttempts: Number (default: 0),
  lockUntil: Date,
  deviceFingerprints: [{
    fingerprint: String,
    deviceName: String,
    isTrusted: Boolean,
    lastUsed: Date
  }],
  mfaEnabled: Boolean (default: false),
  mfaSecret: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Specific error message"
    }
  ]
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `409` - Conflict (duplicate data)
- `423` - Locked (account locked)
- `500` - Internal Server Error

## Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:ci

# Run tests in watch mode
npm run test:watch
```

## Production Deployment

### Environment Variables
Ensure all production environment variables are set:

```env
NODE_ENV=production
DATABASE_URL=your-production-database-connection-string
JWT_SECRET=your-production-jwt-secret-key
PORT=3000
```

### Security Considerations
1. **Change default JWT secret** in production
2. **Use HTTPS** for all communications
3. **Implement rate limiting** for production
4. **Set up proper logging** and monitoring
5. **Use environment-specific database** credentials
6. **Enable MongoDB authentication**
7. **Set up proper CORS** origins
8. **Implement token blacklisting** for logout

### Performance Optimization
1. **Database indexing** on frequently queried fields
2. **Connection pooling** for MongoDB
3. **Caching** for frequently accessed data
4. **Compression** middleware
5. **Request size limits**

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MongoDB is running
   - Verify connection string in `.env`
   - Check network connectivity

2. **JWT Token Errors**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure proper token format

3. **Validation Errors**
   - Check request body format
   - Verify required fields
   - Check data types and formats

4. **Authentication Failures**
   - Verify user exists in database
   - Check password hashing
   - Verify account is active

## Next Steps

1. **Email Verification**: Implement email verification for new accounts
2. **Password Reset**: Add forgot password functionality
3. **MFA Implementation**: Complete MFA with TOTP/SMS
4. **Audit Logging**: Implement comprehensive audit trails
5. **Rate Limiting**: Add rate limiting middleware
6. **Caching**: Implement Redis caching
7. **Monitoring**: Add application monitoring and logging
8. **API Documentation**: Generate OpenAPI/Swagger documentation

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review error logs
3. Verify environment configuration
4. Test with minimal request data
5. Check database connectivity

---

**Note**: This backend setup provides a solid foundation for a secure authentication system. Always follow security best practices and keep dependencies updated.