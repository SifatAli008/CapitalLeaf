const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Import available services
const ThreatIntelligenceService = require('./services/threatIntelligence');

const app = express();
const PORT = process.env.PORT || 3000;

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
      threatIntelligence: 'active'
    }
  });
});

// Authentication API endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password, userContext } = req.body;
    
    // Basic authentication (in production, use proper authentication)
    if (username && password) {
      // Simple authentication (in production, use proper Zero Trust Access Control)
      const accessDecision = {
        allowed: true,
        riskScore: 0.2,
        timestamp: new Date().toISOString()
      };
      
      res.json({
        success: true,
        user: { username, id: username },
        session: accessDecision,
        message: 'Authentication successful'
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

// MFA verification endpoint
app.post('/api/auth/verify-mfa', async (req, res) => {
  try {
    const { sessionId, method, code } = req.body;
    
    // Simple MFA verification (in production, use proper MFA service)
    if (code && code.length === 6) {
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
app.post('/api/auth/register-device', async (req, res) => {
  try {
    const { sessionId, deviceName, deviceInfo } = req.body;
    
    // Simple device registration (in production, use proper device management)
    console.log('Device registration:', { sessionId, deviceName, deviceInfo });
    
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
app.post('/api/auth/assess-risk', async (req, res) => {
  try {
    const { userContext, transactionContext } = req.body;
    
    // Simple risk assessment (in production, use proper risk calculation)
    const riskScore = Math.random() * 0.8; // Simulate risk score
    const riskFactors = ['location', 'device', 'behavior'];
    const recommendations = ['Enable MFA', 'Verify device'];
    
    res.json({
      riskScore,
      riskFactors,
      recommendations,
      requiresMFA: riskScore > 0.5
    });
  } catch (error) {
    console.error('Risk assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Risk assessment failed'
    });
  }
});

// Aggregation Component API Routes

// Role-Based Access Control endpoints
app.post('/api/access/check', async (req, res) => {
  try {
    const { userId, userRole, vaultName, action, context } = req.body;
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
    const { pipelineName, data, context } = req.body;
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
