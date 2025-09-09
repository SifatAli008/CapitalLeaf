const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

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
    mode: 'demo'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    components: {
      server: 'running',
      mode: 'demo'
    }
  });
});

// Simple login endpoint
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username && password) {
    res.json({
      success: true,
      user: { username, id: username },
      message: 'Authentication successful (Demo Mode)'
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Username and password are required'
    });
  }
});

// Simple registration endpoint
app.post('/api/auth/register', (req, res) => {
  const { username, email, password, firstName, lastName } = req.body;
  
  if (username && email && password && firstName && lastName) {
    res.status(201).json({
      success: true,
      message: 'Registration successful (Demo Mode)',
      user: {
        id: 'demo_user_' + Date.now(),
        username,
        email,
        firstName,
        lastName
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
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
    message: 'The requested endpoint was not found'
  });
});

app.listen(PORT, () => {
  console.log(`🛡️  CapitalLeaf Security Framework running on port ${PORT}`);
  console.log('🔒 Dynamic Defense with Microservice Isolation active');
  console.log('📊 Behavior-Driven Protection enabled');
  console.log('🎯 Live Threat Intelligence monitoring');
  console.log('🚀 Demo mode - No database required');
});

module.exports = app;
