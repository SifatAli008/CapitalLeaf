# CapitalLeaf 🛡️

**Dynamic Defense with Microservice Isolation, Behavior-Driven Protection & Live Threat Intelligence**

A comprehensive cybersecurity framework designed specifically for financial platforms to protect against lateral attacks, data theft, and rapidly evolving vulnerabilities.

## 🚀 Features

### Core Security Components

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
- MongoDB (for data storage)
- Redis (for caching and session management)
- Git

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/SifatAli008/CapitalLeaf.git
cd CapitalLeaf
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
# Copy the example environment file
cp env.example .env

# Edit the .env file with your configuration
# Set up database connections, API keys, and security secrets
```

### 4. Start the Application
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## 🔧 Configuration

### Environment Variables

Key configuration options in your `.env` file:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/capitalleaf
REDIS_URL=redis://localhost:6379

# Security Configuration
JWT_SECRET=your-super-secret-jwt-key-here
ENCRYPTION_KEY=your-encryption-key-here

# Threat Intelligence
THREAT_INTELLIGENCE_ENABLED=true
THREAT_FEED_API_KEY=your-threat-feed-api-key

# DLP Configuration
DLP_ENABLED=true
DLP_SENSITIVE_KEYWORDS=account,balance,credit,debit,transaction,payment
```

## 🏃‍♂️ Quick Start

### 1. Start the Server
```bash
npm start
```

### 2. Verify Installation
Visit `http://localhost:3000` to see the CapitalLeaf status page.

### 3. Health Check
```bash
curl http://localhost:3000/health
```

## 📚 API Endpoints

### Core Endpoints

- `GET /` - Framework status and information
- `GET /health` - Health check endpoint
- `POST /api/security/analyze` - Analyze activity for threats
- `GET /api/threats/summary` - Get threat intelligence summary
- `POST /api/dlp/check` - Check data transmission for violations

### Security Components

- `POST /api/access/verify` - Zero Trust access verification
- `POST /api/intrusion/analyze` - AI intrusion detection analysis
- `POST /api/isolation/check` - Microservice communication check
- `POST /api/dlp/analyze` - Behavior-driven DLP analysis

### Aggregation Components

- `POST /api/access/check` - Role-based access control check
- `GET /api/access/roles` - Get all available roles
- `GET /api/access/vaults` - Get all data vaults
- `GET /api/access/user/:userId/summary` - Get user access summary
- `GET /api/access/vault/:vaultName/summary` - Get vault access summary
- `POST /api/pipeline/process` - Process data through secure pipeline
- `GET /api/pipeline/stats` - Get all pipeline statistics
- `GET /api/pipeline/stats/:pipelineName` - Get specific pipeline statistics
- `GET /api/pipeline/audit` - Get audit trails with filtering
- `GET /api/pipeline/summary` - Get data flow monitoring summary

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint
```

## 📊 Monitoring & Logging

The framework includes comprehensive monitoring and logging:

- **Real-time threat monitoring**
- **Behavioral analytics**
- **Incident logging and tracking**
- **Performance metrics**
- **Security event correlation**

## 🔒 Security Features

### Zero Trust Architecture
- Continuous authentication
- Risk-based access control
- Multi-factor authentication
- Device fingerprinting

### Threat Detection
- AI-powered anomaly detection
- Behavioral pattern analysis
- Real-time threat intelligence
- Automated incident response

### Data Protection
- Behavior-driven DLP
- Data classification
- Encryption at rest and in transit
- Audit trails

### Network Security
- Microservice isolation
- Network segmentation
- Traffic analysis
- Lateral movement prevention

## 🚨 Incident Response

The framework automatically:
- Detects security incidents
- Calculates risk scores
- Generates recommendations
- Logs incidents for investigation
- Triggers automated responses

## 📈 Performance

- **High Availability** - Designed for 99.9% uptime
- **Scalable Architecture** - Microservice-based design
- **Real-time Processing** - Sub-second threat detection
- **Low Latency** - Optimized for financial services

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the GPL-2.0 License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the security guidelines

## 🔮 Roadmap

- [ ] Machine Learning model improvements
- [ ] Additional threat intelligence feeds
- [ ] Enhanced behavioral analytics
- [ ] Cloud deployment options
- [ ] Mobile security integration

---

**CapitalLeaf** - Protecting financial platforms with intelligent, behavior-driven security.

## 🚀 CI/CD Pipeline Status
- ✅ Automated testing and deployment active
- ✅ Security scanning with Trivy
- ✅ Quality gates enforced
- ✅ Automatic Vercel deployment