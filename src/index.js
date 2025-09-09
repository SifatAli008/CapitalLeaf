const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const mongoose = require('mongoose');
require('dotenv').config();

// Import available services
const ThreatIntelligenceService = require('./services/threatIntelligence');

// Import database and utilities
// const connectDB = require('./config/database');
const User = require('./models/User');
const { generateTokenPair } = require('./utils/jwt');
const { authenticate } = require('./middleware/auth');
const { 
  validate, 
  registrationSchema, 
  loginSchema, 
  mfaSchema, 
  deviceRegistrationSchema,
  riskAssessmentSchema 
} = require('./middleware/validation');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database (optional for demo)
// connectDB();

// Initialize available services
const threatIntelligence = new ThreatIntelligenceService();

// Initialize services
threatIntelligence.initialize();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'CapitalLeaf: Dynamic Defense with Microservice Isolation',
    version: '1.0.0',
    status: 'operational',
    branding: {
      logo: {
        capital: 'Capital',
        leaf: 'Leaf',
        description: 'Professional fintech security platform'
      }
    },
    features: [
      'Microservice Network Segmentation',
      'Behavior-Driven Data Loss Prevention',
      'Real-Time Threat Intelligence',
      'AI-Driven Intrusion Detection',
      'Zero Trust Access Control',
      'Role-Based Access to Data Vaults',
      'Secure Data Pipelines with Audit Trails'
    ],
    components: {
      infiltration: ['Zero Trust Access Control', 'AI-Driven Intrusion Detection'],
      propagation: ['Microservice Network Segmentation'],
      aggregation: ['Role-Based Access to Data Vaults', 'Secure Data Pipelines'],
      exfiltration: ['Behavior-Driven Data Loss Prevention'],
      intelligence: ['Real-Time Threat Intelligence']
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    components: {
      threatIntelligence: 'active',
      database: 'demo_mode',
      server: 'running'
    }
  });
});

// Helper functions for authentication
const calculateRiskScore = (user, userContext) => {
  let riskScore = 0.1; // Base risk score
  
  // Device risk factors
  if (userContext) {
    if (userContext.isEmulator) riskScore += 0.3;
    if (userContext.isMobile) riskScore += 0.1;
    
    // Check if device is trusted
    const isTrusted = isDeviceTrusted(user, userContext.deviceFingerprint);
    if (!isTrusted) riskScore += 0.2;
  }
  
  // Account age factor (newer accounts are riskier)
  const accountAge = Date.now() - user.createdAt.getTime();
  const daysSinceCreation = accountAge / (1000 * 60 * 60 * 24);
  if (daysSinceCreation < 7) riskScore += 0.2;
  
  // Login attempts factor
  if (user.loginAttempts > 0) riskScore += 0.1;
  
  // MFA factor
  if (!user.mfaEnabled) riskScore += 0.1;
  
  return Math.min(riskScore, 1.0); // Cap at 1.0
};

const isDeviceTrusted = (user, deviceFingerprint) => {
  if (!deviceFingerprint || !user.deviceFingerprints) return false;
  
  const device = user.deviceFingerprints.find(d => d.fingerprint === deviceFingerprint);
  return device ? device.isTrusted : false;
};

// Authentication API endpoints
app.post('/api/auth/login', validate(loginSchema), async (req, res) => {
  try {
    const { username, password, userContext } = req.body;
    
    // Demo mode: Accept any username/password combination
    // In production, this would query the database
    if (username && password) {
      // Generate mock user data
      const mockUser = {
        _id: `demo_user_${Date.now()}`,
        username,
        email: `${username}@example.com`,
        firstName: 'Demo',
        lastName: 'User',
        role: 'user',
        mfaEnabled: false,
        createdAt: new Date(),
        loginAttempts: 0
      };

      // Generate tokens
      const tokens = generateTokenPair(mockUser);

      // Calculate risk score
      const riskScore = calculateRiskScore(mockUser, userContext);
      const requiresMFA = riskScore > 0.5;

      const session = {
        sessionId: tokens.accessToken,
        riskScore,
        requiresMFA,
        mfaMethods: mockUser.mfaEnabled ? ['totp', 'sms'] : [],
        deviceTrusted: userContext ? false : false,
        behavioralAnomaly: {
          detected: false,
          anomalies: [],
          confidence: 0
        },
        riskFactors: {
          device: 0.1,
          location: 0.1,
          transaction: 0.0,
          time: 0.1,
          network: 0.0,
          velocity: 0.0
        },
        recommendations: [],
        timestamp: new Date().toISOString()
      };

      res.json({
        success: true,
        user: {
          id: mockUser._id,
          username: mockUser.username,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          role: mockUser.role
        },
        session,
        tokens,
        message: 'Authentication successful (Demo Mode)'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
});

// Registration endpoint
app.post('/api/auth/register', validate(registrationSchema), async (req, res) => {
  try {
    const { username, email, firstName, lastName } = req.body;

    // Demo mode: Always succeed registration
    // In production, this would check database and create user
    const mockUser = {
      _id: `demo_user_${Date.now()}`,
      username,
      email,
      firstName,
      lastName,
      role: 'user',
      mfaEnabled: false,
      createdAt: new Date()
    };

    // Generate tokens for immediate login
    const tokens = generateTokenPair(mockUser);

    res.status(201).json({
      success: true,
      message: 'Registration successful (Demo Mode)',
      user: {
        id: mockUser._id,
        username: mockUser.username,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        role: mockUser.role
      },
      tokens,
      session: {
        sessionId: tokens.accessToken,
        riskScore: 0.1, // Low risk for new users
        requiresMFA: false,
        mfaMethods: [],
        deviceTrusted: false,
        behavioralAnomaly: { detected: false, anomalies: [], confidence: 0 },
        riskFactors: {
          device: 0.1,
          location: 0.1,
          transaction: 0.0,
          time: 0.1,
          network: 0.0,
          velocity: 0.0
        },
        recommendations: ['Enable MFA for enhanced security'],
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
});

// MFA verification endpoint
app.post('/api/auth/verify-mfa', validate(mfaSchema), async (req, res) => {
  try {
    const { code } = req.body;
    
    // In production, verify the MFA code against the user's MFA secret
    // For demo purposes, accept any 6-digit code
    if (code && code.length === 6 && /^\d+$/.test(code)) {
      res.json({
        success: true,
        message: 'MFA verification successful'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }
  } catch (error) {
    console.error('MFA verification error:', error);
    res.status(500).json({
      success: false,
      message: 'MFA verification failed'
    });
  }
});

// Device registration endpoint
app.post('/api/auth/register-device', validate(deviceRegistrationSchema), authenticate, async (req, res) => {
  try {
    const { deviceName, deviceInfo } = req.body;
    const user = req.user;
    
    // Add device fingerprint to user
    if (deviceInfo && deviceInfo.fingerprint) {
      await user.addDeviceFingerprint(
        deviceInfo.fingerprint,
        deviceName,
        true // Trust the device
      );
    }
    
    res.json({
      success: true,
      message: 'Device registered successfully'
    });
  } catch (error) {
    console.error('Device registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Device registration failed'
    });
  }
});

// Risk assessment endpoint
app.post('/api/auth/assess-risk', validate(riskAssessmentSchema), async (req, res) => {
  try {
    const { userContext, transactionContext } = req.body;
    
    // Enhanced risk assessment with real factors
    let riskScore = 0.1; // Base risk
    const riskFactors = [];
    const recommendations = [];
    
    if (userContext) {
      if (userContext.isEmulator) {
        riskScore += 0.3;
        riskFactors.push('emulator');
        recommendations.push('Verify device authenticity');
      }
      
      if (userContext.isMobile) {
        riskScore += 0.1;
        riskFactors.push('mobile_device');
      }
      
      if (!userContext.deviceFingerprint) {
        riskScore += 0.2;
        riskFactors.push('unknown_device');
        recommendations.push('Register device');
      }
    }
    
    if (transactionContext) {
      if (transactionContext.amount > 10000) {
        riskScore += 0.3;
        riskFactors.push('high_amount');
        recommendations.push('Additional verification required');
      }
      
      if (transactionContext.type === 'international') {
        riskScore += 0.2;
        riskFactors.push('international_transaction');
      }
    }
    
    // Cap risk score at 1.0
    riskScore = Math.min(riskScore, 1.0);
    
    res.json({
      success: true,
      riskScore,
      riskFactors,
      recommendations,
      requiresMFA: riskScore > 0.5,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Risk assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Risk assessment failed'
    });
  }
});

// User profile endpoint
app.get('/api/auth/profile', authenticate, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
        mfaEnabled: user.mfaEnabled,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        deviceCount: user.deviceFingerprints ? user.deviceFingerprints.length : 0
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

// Update user profile endpoint
app.put('/api/auth/profile', authenticate, async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const user = req.user;

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    // Update user fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// Change password endpoint
app.put('/api/auth/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
});

// Get user devices endpoint
app.get('/api/auth/devices', authenticate, async (req, res) => {
  try {
    const user = req.user;
    const devices = user.deviceFingerprints.map(device => ({
      fingerprint: device.fingerprint,
      deviceName: device.deviceName,
      isTrusted: device.isTrusted,
      lastUsed: device.lastUsed
    }));

    res.json({
      success: true,
      devices
    });
  } catch (error) {
    console.error('Devices fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch devices'
    });
  }
});

// Logout endpoint (client-side token invalidation)
app.post('/api/auth/logout', authenticate, async (req, res) => {
  try {
    // In a production environment, you would:
    // 1. Add the token to a blacklist
    // 2. Store blacklisted tokens in Redis
    // 3. Check blacklist in authentication middleware
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

// Aggregation Component API Routes

// Role-Based Access Control endpoints
app.post('/api/access/check', async (req, res) => {
  try {
    // const { userId, userRole, vaultName, action, context } = req.body;
    // Simple access check (in production, use proper RBAC)
    const result = {
      allowed: true,
      reason: 'Access granted',
      timestamp: new Date().toISOString()
    };
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/access/roles', (req, res) => {
  try {
    const roles = ['admin', 'user', 'viewer'];
    res.json({ roles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/access/vaults', (req, res) => {
  try {
    const vaults = ['user-data', 'financial-data', 'audit-logs'];
    res.json({ vaults });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/access/user/:userId/summary', (req, res) => {
  try {
    const summary = {
      userId: req.params.userId,
      role: 'user',
      permissions: ['read'],
      lastAccess: new Date().toISOString()
    };
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/access/vault/:vaultName/summary', (req, res) => {
  try {
    const summary = {
      vaultName: req.params.vaultName,
      accessLevel: 'read',
      lastAccess: new Date().toISOString(),
      userCount: 5
    };
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Secure Data Pipelines endpoints
app.post('/api/pipeline/process', async (req, res) => {
  try {
    const { pipelineName, data } = req.body;
    // Simple data processing (in production, use proper pipeline)
    const result = {
      success: true,
      processedAt: new Date().toISOString(),
      pipelineName,
      recordCount: Array.isArray(data) ? data.length : 1
    };
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/pipeline/stats', (req, res) => {
  try {
    const stats = {
      totalPipelines: 3,
      activePipelines: 2,
      totalRecords: 1500,
      lastProcessed: new Date().toISOString()
    };
    res.json({ stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/pipeline/stats/:pipelineName', (req, res) => {
  try {
    const stats = {
      pipelineName: req.params.pipelineName,
      status: 'active',
      recordCount: 500,
      lastProcessed: new Date().toISOString()
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/pipeline/audit', (req, res) => {
  try {
    const criteria = {
      pipelineName: req.query.pipelineName,
      userId: req.query.userId,
      riskLevel: req.query.riskLevel,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      limit: parseInt(req.query.limit) || 100
    };
    // Simple audit trail (in production, use proper audit system)
    const auditTrails = [{
      id: '1',
      timestamp: new Date().toISOString(),
      action: 'data_process',
      userId: 'user123',
      pipelineName: 'user-data'
    }];
    res.json({ auditTrails });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/pipeline/summary', (req, res) => {
  try {
    const summary = {
      totalFlows: 5,
      activeFlows: 3,
      totalDataProcessed: 10000,
      lastUpdated: new Date().toISOString()
    };
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Threat Intelligence endpoints
app.post('/api/threats/analyze', async (req, res) => {
  try {
    const result = await threatIntelligence.analyzeActivity(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/threats/summary', (req, res) => {
  try {
    const summary = threatIntelligence.getThreatIntelligenceSummary();
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'CapitalLeaf security framework encountered an error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested security endpoint was not found'
  });
});

app.listen(PORT, () => {
  console.log(`🛡️  CapitalLeaf Security Framework running on port ${PORT}`);
  console.log('🔒 Dynamic Defense with Microservice Isolation active');
  console.log('📊 Behavior-Driven Protection enabled');
  console.log('🎯 Live Threat Intelligence monitoring');
});

module.exports = app;
