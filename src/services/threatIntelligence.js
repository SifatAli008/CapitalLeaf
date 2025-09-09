/**
 * Real-Time Threat Intelligence Service
 * Provides immediate detection and response to emerging threats
 */

class ThreatIntelligenceService {
  constructor() {
    this.threatFeeds = new Map();
    this.threatIndicators = new Map();
    this.threatPatterns = new Map();
    this.incidentHistory = [];
    this.threatLevels = {
      LOW: 1,
      MEDIUM: 2,
      HIGH: 3,
      CRITICAL: 4
    };
  }

  /**
   * Initialize threat intelligence service
   */
  async initialize() {
    console.log('🔍 Initializing Threat Intelligence Service...');
    
    // Load initial threat feeds
    await this.loadThreatFeeds();
    
    // Start real-time monitoring
    this.startRealTimeMonitoring();
    
    console.log('✅ Threat Intelligence Service initialized');
  }

  /**
   * Load threat feeds from various sources
   */
  async loadThreatFeeds() {
    // In a real implementation, this would connect to external threat feeds
    const defaultThreats = [
      {
        id: 'threat_001',
        type: 'MALWARE',
        name: 'Banking Trojan',
        description: 'Malware targeting financial institutions',
        severity: 'HIGH',
        indicators: ['banking', 'financial', 'payment'],
        sources: ['CERT', 'FBI', 'Financial ISAC'],
        lastSeen: new Date().toISOString(),
        confidence: 0.9
      },
      {
        id: 'threat_002',
        type: 'PHISHING',
        name: 'CEO Fraud Campaign',
        description: 'Phishing campaign targeting executives',
        severity: 'CRITICAL',
        indicators: ['ceo', 'executive', 'urgent', 'wire transfer'],
        sources: ['APWG', 'Anti-Phishing Working Group'],
        lastSeen: new Date().toISOString(),
        confidence: 0.95
      },
      {
        id: 'threat_003',
        type: 'RANSOMWARE',
        name: 'Ryuk Variant',
        description: 'Ransomware targeting financial services',
        severity: 'CRITICAL',
        indicators: ['ryuk', 'ransomware', 'encryption'],
        sources: ['CISA', 'FBI'],
        lastSeen: new Date().toISOString(),
        confidence: 0.85
      }
    ];

    for (const threat of defaultThreats) {
      this.threatFeeds.set(threat.id, threat);
      this.updateThreatIndicators(threat);
    }
  }

  /**
   * Analyze activity for threat indicators
   * @param {Object} activityData - Activity data to analyze
   * @returns {Object} Threat analysis result
   */
  async analyzeActivity(activityData) {
    const analysis = {
      activityId: activityData.id || this.generateActivityId(),
      timestamp: new Date().toISOString(),
      threats: [],
      riskScore: 0,
      recommendations: [],
      action: 'MONITOR'
    };

    // Check against known threat indicators
    const threatMatches = await this.checkThreatIndicators(activityData);
    analysis.threats.push(...threatMatches);

    // Check for behavioral patterns
    const patternMatches = await this.checkThreatPatterns(activityData);
    analysis.threats.push(...patternMatches);

    // Calculate overall risk score
    analysis.riskScore = this.calculateRiskScore(analysis.threats);

    // Determine recommended action
    analysis.action = this.determineAction(analysis.riskScore);

    // Generate recommendations
    analysis.recommendations = this.generateRecommendations(analysis);

    // Log incident if high risk
    if (analysis.riskScore > 0.7) {
      this.logIncident(analysis);
    }

    return analysis;
  }

  /**
   * Check activity against threat indicators
   * @param {Object} activityData - Activity data
   * @returns {Array} Matching threats
   */
  async checkThreatIndicators(activityData) {
    const matches = [];
    const content = JSON.stringify(activityData).toLowerCase();

    for (const [threatId, threat] of this.threatFeeds) {
      for (const indicator of threat.indicators) {
        if (content.includes(indicator.toLowerCase())) {
          matches.push({
            threatId,
            threatName: threat.name,
            threatType: threat.type,
            severity: threat.severity,
            indicator,
            confidence: threat.confidence,
            description: `Threat indicator "${indicator}" detected in activity`
          });
        }
      }
    }

    return matches;
  }

  /**
   * Check for threat patterns
   * @param {Object} activityData - Activity data
   * @returns {Array} Pattern matches
   */
  async checkThreatPatterns(activityData) {
    const matches = [];

    // Check for suspicious timing patterns
    const timingPattern = this.checkTimingPattern(activityData);
    if (timingPattern.score > 0.7) {
      matches.push({
        threatId: 'pattern_timing',
        threatName: 'Suspicious Timing Pattern',
        threatType: 'BEHAVIORAL',
        severity: 'MEDIUM',
        confidence: timingPattern.score,
        description: 'Activity detected during unusual hours'
      });
    }

    // Check for volume anomalies
    const volumePattern = this.checkVolumePattern(activityData);
    if (volumePattern.score > 0.7) {
      matches.push({
        threatId: 'pattern_volume',
        threatName: 'Volume Anomaly',
        threatType: 'BEHAVIORAL',
        severity: 'HIGH',
        confidence: volumePattern.score,
        description: 'Unusual data volume detected'
      });
    }

    // Check for lateral movement patterns
    const lateralPattern = this.checkLateralMovementPattern(activityData);
    if (lateralPattern.score > 0.7) {
      matches.push({
        threatId: 'pattern_lateral',
        threatName: 'Lateral Movement',
        threatType: 'ADVANCED_PERSISTENT_THREAT',
        severity: 'CRITICAL',
        confidence: lateralPattern.score,
        description: 'Potential lateral movement detected'
      });
    }

    return matches;
  }

  /**
   * Check timing pattern
   * @param {Object} activityData - Activity data
   * @returns {Object} Timing pattern analysis
   */
  checkTimingPattern(activityData) {
    const timestamp = new Date(activityData.timestamp);
    const hour = timestamp.getHours();
    const day = timestamp.getDay();

    let score = 0;

    // Check for off-hours activity
    if (hour < 6 || hour > 22) {
      score += 0.4;
    }

    // Check for weekend activity
    if (day === 0 || day === 6) {
      score += 0.3;
    }

    // Check for holiday activity (simplified)
    const month = timestamp.getMonth();
    const date = timestamp.getDate();
    if ((month === 11 && date === 25) || (month === 0 && date === 1)) {
      score += 0.3;
    }

    return { score: Math.min(score, 1.0) };
  }

  /**
   * Check volume pattern
   * @param {Object} activityData - Activity data
   * @returns {Object} Volume pattern analysis
   */
  checkVolumePattern(activityData) {
    let score = 0;

    // Check data size
    if (activityData.dataSize && activityData.dataSize > 1000000) { // 1MB
      score += 0.4;
    }

    // Check request frequency
    if (activityData.requestCount && activityData.requestCount > 100) {
      score += 0.3;
    }

    // Check concurrent connections
    if (activityData.concurrentConnections && activityData.concurrentConnections > 50) {
      score += 0.3;
    }

    return { score: Math.min(score, 1.0) };
  }

  /**
   * Check lateral movement pattern
   * @param {Object} activityData - Activity data
   * @returns {Object} Lateral movement analysis
   */
  checkLateralMovementPattern(activityData) {
    let score = 0;

    // Check for multiple service access
    if (activityData.servicesAccessed && activityData.servicesAccessed.length > 5) {
      score += 0.3;
    }

    // Check for privilege escalation attempts
    if (activityData.privilegeEscalation) {
      score += 0.4;
    }

    // Check for network scanning
    if (activityData.networkScanning) {
      score += 0.3;
    }

    return { score: Math.min(score, 1.0) };
  }

  /**
   * Calculate overall risk score
   * @param {Array} threats - Detected threats
   * @returns {number} Risk score between 0 and 1
   */
  calculateRiskScore(threats) {
    if (threats.length === 0) return 0;

    let totalScore = 0;
    let totalWeight = 0;

    for (const threat of threats) {
      const severityWeight = this.threatLevels[threat.severity] / 4; // Normalize to 0-1
      const confidenceWeight = threat.confidence;
      const threatScore = severityWeight * confidenceWeight;
      
      totalScore += threatScore;
      totalWeight += severityWeight;
    }

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  /**
   * Determine recommended action
   * @param {number} riskScore - Risk score
   * @returns {string} Recommended action
   */
  determineAction(riskScore) {
    if (riskScore >= 0.9) return 'IMMEDIATE_RESPONSE';
    if (riskScore >= 0.7) return 'HIGH_PRIORITY';
    if (riskScore >= 0.5) return 'INVESTIGATE';
    if (riskScore >= 0.3) return 'MONITOR';
    return 'ALLOW';
  }

  /**
   * Generate security recommendations
   * @param {Object} analysis - Threat analysis
   * @returns {Array} Recommendations
   */
  generateRecommendations(analysis) {
    const recommendations = [];

    if (analysis.riskScore >= 0.9) {
      recommendations.push('Immediate incident response required');
      recommendations.push('Isolate affected systems');
      recommendations.push('Notify security team and management');
      recommendations.push('Activate emergency response procedures');
    } else if (analysis.riskScore >= 0.7) {
      recommendations.push('High priority investigation required');
      recommendations.push('Increase monitoring of affected systems');
      recommendations.push('Consider temporary access restrictions');
    } else if (analysis.riskScore >= 0.5) {
      recommendations.push('Schedule investigation within 24 hours');
      recommendations.push('Monitor for additional indicators');
    } else if (analysis.riskScore >= 0.3) {
      recommendations.push('Continue monitoring');
      recommendations.push('Document for trend analysis');
    }

    // Add specific recommendations based on threat types
    const threatTypes = new Set(analysis.threats.map(t => t.threatType));
    
    if (threatTypes.has('MALWARE')) {
      recommendations.push('Run full system scan');
      recommendations.push('Check for malware signatures');
    }
    
    if (threatTypes.has('PHISHING')) {
      recommendations.push('Verify email authenticity');
      recommendations.push('Educate users about phishing');
    }
    
    if (threatTypes.has('RANSOMWARE')) {
      recommendations.push('Check backup integrity');
      recommendations.push('Isolate affected systems immediately');
    }

    return recommendations;
  }

  /**
   * Log security incident
   * @param {Object} analysis - Threat analysis
   */
  logIncident(analysis) {
    const incident = {
      id: this.generateIncidentId(),
      timestamp: new Date().toISOString(),
      riskScore: analysis.riskScore,
      threats: analysis.threats,
      action: analysis.action,
      status: 'OPEN',
      assignedTo: null,
      resolution: null
    };

    this.incidentHistory.push(incident);
    
    console.log(`🚨 Security Incident Logged: ${incident.id}`);
    console.log(`   Risk Score: ${incident.riskScore}`);
    console.log(`   Threats: ${incident.threats.length}`);
    console.log(`   Action: ${incident.action}`);
  }

  /**
   * Update threat indicators
   * @param {Object} threat - Threat data
   */
  updateThreatIndicators(threat) {
    for (const indicator of threat.indicators) {
      if (!this.threatIndicators.has(indicator)) {
        this.threatIndicators.set(indicator, []);
      }
      this.threatIndicators.get(indicator).push(threat.id);
    }
  }

  /**
   * Start real-time monitoring
   */
  startRealTimeMonitoring() {
    console.log('🔄 Starting real-time threat monitoring...');
    
    // In a real implementation, this would connect to live data streams
    setInterval(() => {
      this.updateThreatFeeds();
    }, 300000); // Update every 5 minutes
  }

  /**
   * Update threat feeds
   */
  async updateThreatFeeds() {
    console.log('📡 Updating threat feeds...');
    
    // In a real implementation, this would fetch from external APIs
    // For now, we'll simulate updates
    const newThreats = [
      {
        id: `threat_${Date.now()}`,
        type: 'ZERO_DAY',
        name: 'New Zero-Day Exploit',
        description: 'Recently discovered zero-day exploit',
        severity: 'CRITICAL',
        indicators: ['zero-day', 'exploit', 'vulnerability'],
        sources: ['CVE', 'Security Researcher'],
        lastSeen: new Date().toISOString(),
        confidence: 0.8
      }
    ];

    for (const threat of newThreats) {
      this.threatFeeds.set(threat.id, threat);
      this.updateThreatIndicators(threat);
    }
  }

  /**
   * Get threat intelligence summary
   * @returns {Object} Summary of threat intelligence
   */
  getThreatIntelligenceSummary() {
    const totalThreats = this.threatFeeds.size;
    const activeIncidents = this.incidentHistory.filter(i => i.status === 'OPEN').length;
    const resolvedIncidents = this.incidentHistory.filter(i => i.status === 'RESOLVED').length;

    const threatTypes = {};
    for (const threat of this.threatFeeds.values()) {
      threatTypes[threat.type] = (threatTypes[threat.type] || 0) + 1;
    }

    return {
      totalThreats,
      activeIncidents,
      resolvedIncidents,
      threatTypes,
      lastUpdate: new Date().toISOString(),
      status: 'ACTIVE'
    };
  }

  /**
   * Generate activity ID
   * @returns {string} Activity ID
   */
  generateActivityId() {
    return `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate incident ID
   * @returns {string} Incident ID
   */
  generateIncidentId() {
    return `incident_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

module.exports = ThreatIntelligenceService;
