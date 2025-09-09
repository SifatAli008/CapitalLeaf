const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Import security components
const ZeroTrustAccessControl = require('./components/infiltration/zeroTrustAccess');
const AIIntrusionDetection = require('./components/infiltration/intrusionDetection');
const MicroserviceIsolation = require('./components/propagation/microserviceIsolation');
const BehaviorAwareDLP = require('./components/exfiltration/behaviorDLP');
const RoleBasedAccessControl = require('./components/aggregation/roleBasedAccess');
const SecureDataPipelines = require('./components/aggregation/secureDataPipelines');
const ThreatIntelligenceService = require('./services/threatIntelligence');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize security components
const zeroTrustAccess = new ZeroTrustAccessControl();
const intrusionDetection = new AIIntrusionDetection();
const microserviceIsolation = new MicroserviceIsolation();
const behaviorDLP = new BehaviorAwareDLP();
const roleBasedAccess = new RoleBasedAccessControl();
const secureDataPipelines = new SecureDataPipelines();
const threatIntelligence = new ThreatIntelligenceService();

// Initialize components
roleBasedAccess.initialize();
secureDataPipelines.initialize();
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
      roleBasedAccess: 'active',
      secureDataPipelines: 'active',
      threatIntelligence: 'active'
    }
  });
});

// Aggregation Component API Routes

// Role-Based Access Control endpoints
app.post('/api/access/check', async (req, res) => {
  try {
    const { userId, userRole, vaultName, action, context } = req.body;
    const result = await roleBasedAccess.checkAccess(userId, userRole, vaultName, action, context);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/access/roles', (req, res) => {
  try {
    const roles = roleBasedAccess.getAllRoles();
    res.json({ roles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/access/vaults', (req, res) => {
  try {
    const vaults = roleBasedAccess.getAllVaults();
    res.json({ vaults });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/access/user/:userId/summary', (req, res) => {
  try {
    const summary = roleBasedAccess.getUserAccessSummary(req.params.userId);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/access/vault/:vaultName/summary', (req, res) => {
  try {
    const summary = roleBasedAccess.getVaultAccessSummary(req.params.vaultName);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Secure Data Pipelines endpoints
app.post('/api/pipeline/process', async (req, res) => {
  try {
    const { pipelineName, data, context } = req.body;
    const result = await secureDataPipelines.processData(pipelineName, data, context);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/pipeline/stats', (req, res) => {
  try {
    const stats = secureDataPipelines.getAllPipelineStats();
    res.json({ stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/pipeline/stats/:pipelineName', (req, res) => {
  try {
    const stats = secureDataPipelines.getPipelineStats(req.params.pipelineName);
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
    const auditTrails = secureDataPipelines.getAuditTrails(criteria);
    res.json({ auditTrails });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/pipeline/summary', (req, res) => {
  try {
    const summary = secureDataPipelines.getDataFlowSummary();
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
app.use((err, req, res, next) => {
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
  console.log(`🔒 Dynamic Defense with Microservice Isolation active`);
  console.log(`📊 Behavior-Driven Protection enabled`);
  console.log(`🎯 Live Threat Intelligence monitoring`);
});

module.exports = app;
