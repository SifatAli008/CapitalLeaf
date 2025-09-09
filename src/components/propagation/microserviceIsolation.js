/**
 * Microservice Isolation via Network Policies Component
 * Prevents lateral movement of threats across service boundaries
 */

class MicroserviceIsolation {
  constructor() {
    this.networkPolicies = new Map();
    this.serviceBoundaries = new Map();
    this.communicationMatrix = new Map();
    this.threatIndicators = new Set();
  }

  /**
   * Define network policy for service isolation
   * @param {string} serviceName - Name of the service
   * @param {Object} policy - Network policy configuration
   */
  defineNetworkPolicy(serviceName, policy) {
    const networkPolicy = {
      serviceName,
      allowedServices: policy.allowedServices || [],
      blockedServices: policy.blockedServices || [],
      allowedPorts: policy.allowedPorts || [],
      blockedPorts: policy.blockedPorts || [],
      allowedProtocols: policy.allowedProtocols || ['HTTP', 'HTTPS'],
      maxConnections: policy.maxConnections || 100,
      rateLimit: policy.rateLimit || 1000, // requests per minute
      encryptionRequired: policy.encryptionRequired || true,
      createdAt: new Date().toISOString()
    };

    this.networkPolicies.set(serviceName, networkPolicy);
    this.updateServiceBoundaries(serviceName, networkPolicy);
  }

  /**
   * Check if communication between services is allowed
   * @param {string} sourceService - Source service name
   * @param {string} targetService - Target service name
   * @param {Object} communicationDetails - Communication details
   * @returns {Object} Communication decision
   */
  async checkCommunication(sourceService, targetService, communicationDetails) {
    const sourcePolicy = this.networkPolicies.get(sourceService);
    const targetPolicy = this.networkPolicies.get(targetService);

    if (!sourcePolicy || !targetPolicy) {
      return {
        allowed: false,
        reason: 'Service policy not defined',
        riskLevel: 'HIGH'
      };
    }

    const decision = {
      sourceService,
      targetService,
      timestamp: new Date().toISOString(),
      allowed: false,
      reason: '',
      riskLevel: 'LOW',
      recommendations: []
    };

    // Check if target service is in allowed services
    if (!sourcePolicy.allowedServices.includes(targetService)) {
      decision.allowed = false;
      decision.reason = 'Target service not in allowed services list';
      decision.riskLevel = 'HIGH';
      decision.recommendations.push('Add target service to allowed services list');
      return decision;
    }

    // Check if target service is in blocked services
    if (sourcePolicy.blockedServices.includes(targetService)) {
      decision.allowed = false;
      decision.reason = 'Target service is explicitly blocked';
      decision.riskLevel = 'CRITICAL';
      decision.recommendations.push('Remove target service from blocked services list if communication is needed');
      return decision;
    }

    // Check port restrictions
    if (!this.checkPortRestrictions(sourcePolicy, communicationDetails.port)) {
      decision.allowed = false;
      decision.reason = 'Port not allowed by policy';
      decision.riskLevel = 'MEDIUM';
      decision.recommendations.push('Add port to allowed ports list');
      return decision;
    }

    // Check protocol restrictions
    if (!this.checkProtocolRestrictions(sourcePolicy, communicationDetails.protocol)) {
      decision.allowed = false;
      decision.reason = 'Protocol not allowed by policy';
      decision.riskLevel = 'MEDIUM';
      decision.recommendations.push('Use allowed protocol');
      return decision;
    }

    // Check encryption requirements
    if (sourcePolicy.encryptionRequired && !communicationDetails.encrypted) {
      decision.allowed = false;
      decision.reason = 'Encryption required but not provided';
      decision.riskLevel = 'HIGH';
      decision.recommendations.push('Enable encryption for communication');
      return decision;
    }

    // Check rate limiting
    if (!this.checkRateLimit(sourceService, targetService)) {
      decision.allowed = false;
      decision.reason = 'Rate limit exceeded';
      decision.riskLevel = 'MEDIUM';
      decision.recommendations.push('Reduce communication frequency');
      return decision;
    }

    // Check connection limits
    if (!this.checkConnectionLimit(sourceService, targetService)) {
      decision.allowed = false;
      decision.reason = 'Maximum connections exceeded';
      decision.riskLevel = 'MEDIUM';
      decision.recommendations.push('Close unused connections');
      return decision;
    }

    // Check for threat indicators
    const threatLevel = this.assessThreatLevel(sourceService, targetService, communicationDetails);
    if (threatLevel > 0.7) {
      decision.allowed = false;
      decision.reason = 'High threat level detected';
      decision.riskLevel = 'CRITICAL';
      decision.recommendations.push('Investigate potential security threat');
      return decision;
    }

    // All checks passed
    decision.allowed = true;
    decision.reason = 'Communication allowed by policy';
    decision.riskLevel = 'LOW';

    // Log successful communication
    this.logCommunication(sourceService, targetService, communicationDetails);

    return decision;
  }

  /**
   * Check port restrictions
   * @param {Object} policy - Network policy
   * @param {number} port - Port number
   * @returns {boolean} True if port is allowed
   */
  checkPortRestrictions(policy, port) {
    if (policy.allowedPorts.length === 0) return true; // No restrictions
    return policy.allowedPorts.includes(port);
  }

  /**
   * Check protocol restrictions
   * @param {Object} policy - Network policy
   * @param {string} protocol - Protocol name
   * @returns {boolean} True if protocol is allowed
   */
  checkProtocolRestrictions(policy, protocol) {
    return policy.allowedProtocols.includes(protocol.toUpperCase());
  }

  /**
   * Check rate limiting
   * @param {string} sourceService - Source service
   * @param {string} targetService - Target service
   * @returns {boolean} True if within rate limit
   */
  checkRateLimit(sourceService, targetService) {
    const key = `${sourceService}_${targetService}`;
    const policy = this.networkPolicies.get(sourceService);
    
    if (!policy || !policy.rateLimit) return true;

    const communication = this.communicationMatrix.get(key);
    if (!communication) return true;

    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    // Count requests in the last minute
    const recentRequests = communication.requests.filter(
      req => req.timestamp > oneMinuteAgo
    );

    return recentRequests.length < policy.rateLimit;
  }

  /**
   * Check connection limits
   * @param {string} sourceService - Source service
   * @param {string} targetService - Target service
   * @returns {boolean} True if within connection limit
   */
  checkConnectionLimit(sourceService, targetService) {
    const key = `${sourceService}_${targetService}`;
    const policy = this.networkPolicies.get(sourceService);
    
    if (!policy || !policy.maxConnections) return true;

    const communication = this.communicationMatrix.get(key);
    if (!communication) return true;

    const activeConnections = communication.connections.filter(
      conn => conn.status === 'active'
    );

    return activeConnections.length < policy.maxConnections;
  }

  /**
   * Assess threat level for communication
   * @param {string} sourceService - Source service
   * @param {string} targetService - Target service
   * @param {Object} communicationDetails - Communication details
   * @returns {number} Threat level between 0 and 1
   */
  assessThreatLevel(sourceService, targetService, communicationDetails) {
    let threatLevel = 0;

    // Check if source service has threat indicators
    if (this.threatIndicators.has(sourceService)) {
      threatLevel += 0.4;
    }

    // Check if target service is sensitive
    if (this.isSensitiveService(targetService)) {
      threatLevel += 0.3;
    }

    // Check for unusual communication patterns
    const patternAnomaly = this.detectCommunicationAnomaly(sourceService, targetService, communicationDetails);
    threatLevel += patternAnomaly * 0.3;

    return Math.min(threatLevel, 1.0);
  }

  /**
   * Check if service is sensitive
   * @param {string} serviceName - Service name
   * @returns {boolean} True if sensitive
   */
  isSensitiveService(serviceName) {
    const sensitiveServices = ['database', 'auth', 'payment', 'user-data', 'admin'];
    return sensitiveServices.some(sensitive => 
      serviceName.toLowerCase().includes(sensitive)
    );
  }

  /**
   * Detect communication anomaly
   * @param {string} sourceService - Source service
   * @param {string} targetService - Target service
   * @param {Object} communicationDetails - Communication details
   * @returns {number} Anomaly score between 0 and 1
   */
  detectCommunicationAnomaly(sourceService, targetService, communicationDetails) {
    const key = `${sourceService}_${targetService}`;
    const communication = this.communicationMatrix.get(key);
    
    if (!communication || communication.requests.length < 10) {
      return 0.5; // Insufficient data
    }

    // Check for unusual timing patterns
    const recentRequests = communication.requests.slice(-10);
    const timeIntervals = recentRequests.map((req, index) => {
      if (index === 0) return 0;
      return req.timestamp - recentRequests[index - 1].timestamp;
    });

    const avgInterval = timeIntervals.reduce((a, b) => a + b, 0) / timeIntervals.length;
    const currentInterval = communicationDetails.timestamp - recentRequests[recentRequests.length - 1].timestamp;
    
    const intervalAnomaly = Math.abs(currentInterval - avgInterval) / avgInterval;
    
    return Math.min(intervalAnomaly, 1.0);
  }

  /**
   * Log communication attempt
   * @param {string} sourceService - Source service
   * @param {string} targetService - Target service
   * @param {Object} communicationDetails - Communication details
   */
  logCommunication(sourceService, targetService, communicationDetails) {
    const key = `${sourceService}_${targetService}`;
    
    if (!this.communicationMatrix.has(key)) {
      this.communicationMatrix.set(key, {
        requests: [],
        connections: [],
        totalRequests: 0,
        lastCommunication: null
      });
    }

    const communication = this.communicationMatrix.get(key);
    
    communication.requests.push({
      timestamp: communicationDetails.timestamp || Date.now(),
      port: communicationDetails.port,
      protocol: communicationDetails.protocol,
      encrypted: communicationDetails.encrypted,
      dataSize: communicationDetails.dataSize || 0
    });

    communication.totalRequests++;
    communication.lastCommunication = Date.now();

    // Keep only recent requests (last 100)
    if (communication.requests.length > 100) {
      communication.requests.shift();
    }
  }

  /**
   * Update service boundaries based on policy
   * @param {string} serviceName - Service name
   * @param {Object} policy - Network policy
   */
  updateServiceBoundaries(serviceName, policy) {
    this.serviceBoundaries.set(serviceName, {
      allowedConnections: policy.allowedServices,
      blockedConnections: policy.blockedServices,
      isolationLevel: this.calculateIsolationLevel(policy),
      lastUpdated: new Date().toISOString()
    });
  }

  /**
   * Calculate isolation level for service
   * @param {Object} policy - Network policy
   * @returns {string} Isolation level
   */
  calculateIsolationLevel(policy) {
    const allowedCount = policy.allowedServices.length;
    const blockedCount = policy.blockedServices.length;
    const totalRestrictions = allowedCount + blockedCount;

    if (totalRestrictions === 0) return 'NONE';
    if (allowedCount === 0) return 'MAXIMUM';
    if (blockedCount > allowedCount * 2) return 'HIGH';
    if (blockedCount > allowedCount) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Add threat indicator for service
   * @param {string} serviceName - Service name
   * @param {string} indicator - Threat indicator
   */
  addThreatIndicator(serviceName, indicator) {
    this.threatIndicators.add(serviceName);
    console.log(`🚨 Threat indicator added for service: ${serviceName} - ${indicator}`);
  }

  /**
   * Remove threat indicator for service
   * @param {string} serviceName - Service name
   */
  removeThreatIndicator(serviceName) {
    this.threatIndicators.delete(serviceName);
    console.log(`✅ Threat indicator removed for service: ${serviceName}`);
  }

  /**
   * Get service isolation status
   * @param {string} serviceName - Service name
   * @returns {Object} Isolation status
   */
  getServiceIsolationStatus(serviceName) {
    const policy = this.networkPolicies.get(serviceName);
    const boundary = this.serviceBoundaries.get(serviceName);
    
    if (!policy || !boundary) {
      return {
        serviceName,
        status: 'NOT_CONFIGURED',
        isolationLevel: 'NONE',
        threatIndicators: this.threatIndicators.has(serviceName)
      };
    }

    return {
      serviceName,
      status: 'CONFIGURED',
      isolationLevel: boundary.isolationLevel,
      allowedServices: policy.allowedServices,
      blockedServices: policy.blockedServices,
      threatIndicators: this.threatIndicators.has(serviceName),
      lastUpdated: boundary.lastUpdated
    };
  }

  /**
   * Get all service isolation statuses
   * @returns {Array} All service statuses
   */
  getAllServiceStatuses() {
    const statuses = [];
    
    for (const serviceName of this.networkPolicies.keys()) {
      statuses.push(this.getServiceIsolationStatus(serviceName));
    }
    
    return statuses;
  }
}

module.exports = MicroserviceIsolation;
