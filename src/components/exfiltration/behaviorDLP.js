/**
 * Behavior-Aware DLP Engine Component
 * Blocks transmission of financial keywords, identifiers, or behavioral anomalies
 */

class BehaviorAwareDLP {
  constructor() {
    this.financialKeywords = new Set([
      'account', 'balance', 'credit', 'debit', 'transaction', 'payment',
      'transfer', 'withdrawal', 'deposit', 'loan', 'mortgage', 'interest',
      'ssn', 'social security', 'tax id', 'ein', 'routing', 'account number',
      'card number', 'cvv', 'pin', 'password', 'username', 'email'
    ]);
    
    this.userBehaviors = new Map();
    this.transmissionPatterns = new Map();
    this.anomalyThreshold = 0.7;
    this.dataClassification = new Map();
  }

  /**
   * Analyze data transmission for potential data loss
   * @param {Object} transmissionData - Transmission data
   * @returns {Object} DLP analysis result
   */
  async analyzeTransmission(transmissionData) {
    const userId = transmissionData.userId;
    const content = transmissionData.content;
    const destination = transmissionData.destination;
    const timestamp = transmissionData.timestamp || new Date().toISOString();

    const analysis = {
      userId,
      timestamp,
      destination,
      riskScore: 0,
      violations: [],
      recommendations: [],
      action: 'ALLOW',
      confidence: 0
    };

    // Check for financial keywords
    const keywordViolations = this.detectFinancialKeywords(content);
    if (keywordViolations.length > 0) {
      analysis.violations.push(...keywordViolations);
      analysis.riskScore += keywordViolations.length * 0.2;
    }

    // Check for behavioral anomalies
    const behaviorAnomaly = await this.detectBehavioralAnomaly(userId, transmissionData);
    if (behaviorAnomaly.score > this.anomalyThreshold) {
      analysis.violations.push({
        type: 'BEHAVIORAL_ANOMALY',
        severity: 'HIGH',
        description: 'Unusual transmission pattern detected',
        score: behaviorAnomaly.score
      });
      analysis.riskScore += behaviorAnomaly.score * 0.4;
    }

    // Check for data classification violations
    const classificationViolations = this.checkDataClassification(content, destination);
    if (classificationViolations.length > 0) {
      analysis.violations.push(...classificationViolations);
      analysis.riskScore += classificationViolations.length * 0.3;
    }

    // Check for volume anomalies
    const volumeAnomaly = this.detectVolumeAnomaly(userId, transmissionData);
    if (volumeAnomaly > 0.5) {
      analysis.violations.push({
        type: 'VOLUME_ANOMALY',
        severity: 'MEDIUM',
        description: 'Unusual data volume detected',
        score: volumeAnomaly
      });
      analysis.riskScore += volumeAnomaly * 0.2;
    }

    // Check for timing anomalies
    const timingAnomaly = this.detectTimingAnomaly(userId, transmissionData);
    if (timingAnomaly > 0.5) {
      analysis.violations.push({
        type: 'TIMING_ANOMALY',
        severity: 'MEDIUM',
        description: 'Unusual transmission timing detected',
        score: timingAnomaly
      });
      analysis.riskScore += timingAnomaly * 0.1;
    }

    // Determine action based on risk score
    analysis.action = this.determineAction(analysis.riskScore);
    analysis.confidence = Math.min(analysis.riskScore, 1.0);

    // Generate recommendations
    analysis.recommendations = this.generateRecommendations(analysis);

    // Update user behavior patterns
    this.updateUserBehavior(userId, transmissionData, analysis);

    return analysis;
  }

  /**
   * Detect financial keywords in content
   * @param {string} content - Content to analyze
   * @returns {Array} List of violations
   */
  detectFinancialKeywords(content) {
    const violations = [];
    const lowerContent = content.toLowerCase();

    for (const keyword of this.financialKeywords) {
      if (lowerContent.includes(keyword.toLowerCase())) {
        violations.push({
          type: 'FINANCIAL_KEYWORD',
          severity: 'HIGH',
          description: `Financial keyword detected: ${keyword}`,
          keyword,
          score: 0.8
        });
      }
    }

    return violations;
  }

  /**
   * Detect behavioral anomaly in transmission
   * @param {string} userId - User ID
   * @param {Object} transmissionData - Transmission data
   * @returns {Object} Anomaly analysis
   */
  async detectBehavioralAnomaly(userId, transmissionData) {
    // Get user behavior pattern for analysis
    this.userBehaviors.get(userId) || this.initializeUserBehavior();
    
    let anomalyScore = 0;

    // Check destination anomaly
    const destinationAnomaly = this.checkDestinationAnomaly(userId, transmissionData.destination);
    anomalyScore += destinationAnomaly * 0.3;

    // Check content pattern anomaly
    const contentAnomaly = this.checkContentPatternAnomaly(userId, transmissionData.content);
    anomalyScore += contentAnomaly * 0.3;

    // Check frequency anomaly
    const frequencyAnomaly = this.checkFrequencyAnomaly(userId, transmissionData.timestamp);
    anomalyScore += frequencyAnomaly * 0.2;

    // Check size anomaly
    const sizeAnomaly = this.checkSizeAnomaly(userId, transmissionData.content.length);
    anomalyScore += sizeAnomaly * 0.2;

    return {
      score: Math.min(anomalyScore, 1.0),
      factors: {
        destination: destinationAnomaly,
        content: contentAnomaly,
        frequency: frequencyAnomaly,
        size: sizeAnomaly
      }
    };
  }

  /**
   * Check destination anomaly
   * @param {string} userId - User ID
   * @param {string} destination - Destination
   * @returns {number} Anomaly score
   */
  checkDestinationAnomaly(userId, destination) {
    const userBehavior = this.userBehaviors.get(userId);
    if (!userBehavior || userBehavior.destinations.length === 0) {
      return 0.5; // New user, moderate risk
    }

    const isKnownDestination = userBehavior.destinations.includes(destination);
    return isKnownDestination ? 0.1 : 0.8;
  }

  /**
   * Check content pattern anomaly
   * @param {string} userId - User ID
   * @param {string} content - Content
   * @returns {number} Anomaly score
   */
  checkContentPatternAnomaly(userId, content) {
    const userBehavior = this.userBehaviors.get(userId);
    if (!userBehavior || userBehavior.contentPatterns.length === 0) {
      return 0.3; // New user, low risk
    }

    // Simple pattern matching (in real implementation, use ML)
    const contentLength = content.length;
    const avgLength = userBehavior.contentPatterns.reduce((a, b) => a + b, 0) / userBehavior.contentPatterns.length;
    
    const lengthRatio = Math.abs(contentLength - avgLength) / avgLength;
    return Math.min(lengthRatio, 1.0);
  }

  /**
   * Check frequency anomaly
   * @param {string} userId - User ID
   * @param {string} timestamp - Timestamp
   * @returns {number} Anomaly score
   */
  checkFrequencyAnomaly(userId, timestamp) {
    const userBehavior = this.userBehaviors.get(userId);
    if (!userBehavior || userBehavior.transmissionTimes.length === 0) {
      return 0.2; // New user, low risk
    }

    const currentTime = new Date(timestamp);
    const recentTransmissions = userBehavior.transmissionTimes.filter(time => {
      const transmissionTime = new Date(time);
      const timeDiff = currentTime - transmissionTime;
      return timeDiff < 24 * 60 * 60 * 1000; // Last 24 hours
    });

    const frequencyRatio = recentTransmissions.length / userBehavior.avgDailyTransmissions;
    return Math.min(Math.abs(frequencyRatio - 1), 1.0);
  }

  /**
   * Check size anomaly
   * @param {string} userId - User ID
   * @param {number} contentSize - Content size
   * @returns {number} Anomaly score
   */
  checkSizeAnomaly(userId, contentSize) {
    const userBehavior = this.userBehaviors.get(userId);
    if (!userBehavior || userBehavior.contentSizes.length === 0) {
      return 0.3; // New user, low risk
    }

    const avgSize = userBehavior.contentSizes.reduce((a, b) => a + b, 0) / userBehavior.contentSizes.length;
    const sizeRatio = Math.abs(contentSize - avgSize) / avgSize;
    return Math.min(sizeRatio, 1.0);
  }

  /**
   * Check data classification violations
   * @param {string} content - Content
   * @param {string} destination - Destination
   * @returns {Array} Violations
   */
  checkDataClassification(content, destination) {
    const violations = [];
    
    // Check for sensitive data patterns
    const sensitivePatterns = [
      { pattern: /\b\d{3}-\d{2}-\d{4}\b/, type: 'SSN', severity: 'CRITICAL' },
      { pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/, type: 'CREDIT_CARD', severity: 'CRITICAL' },
      { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, type: 'EMAIL', severity: 'MEDIUM' },
      { pattern: /\b\d{3}-\d{3}-\d{4}\b/, type: 'PHONE', severity: 'MEDIUM' }
    ];

    for (const { pattern, type, severity } of sensitivePatterns) {
      if (pattern.test(content)) {
        violations.push({
          type: 'DATA_CLASSIFICATION',
          severity,
          description: `Sensitive data detected: ${type}`,
          dataType: type,
          score: severity === 'CRITICAL' ? 0.9 : 0.6
        });
      }
    }

    // Check destination restrictions
    const restrictedDestinations = ['personal-email', 'cloud-storage', 'external-service'];
    if (restrictedDestinations.some(dest => destination.includes(dest))) {
      violations.push({
        type: 'DESTINATION_RESTRICTION',
        severity: 'HIGH',
        description: 'Transmission to restricted destination',
        destination,
        score: 0.7
      });
    }

    return violations;
  }

  /**
   * Detect volume anomaly
   * @param {string} userId - User ID
   * @param {Object} transmissionData - Transmission data
   * @returns {number} Volume anomaly score
   */
  detectVolumeAnomaly(userId, transmissionData) {
    const userBehavior = this.userBehaviors.get(userId);
    if (!userBehavior || userBehavior.contentSizes.length === 0) {
      return 0.3;
    }

    const currentSize = transmissionData.content.length;
    const avgSize = userBehavior.contentSizes.reduce((a, b) => a + b, 0) / userBehavior.contentSizes.length;
    
    const sizeRatio = currentSize / avgSize;
    return Math.min(Math.abs(sizeRatio - 1), 1.0);
  }

  /**
   * Detect timing anomaly
   * @param {string} userId - User ID
   * @param {Object} transmissionData - Transmission data
   * @returns {number} Timing anomaly score
   */
  detectTimingAnomaly(userId, transmissionData) {
    const userBehavior = this.userBehaviors.get(userId);
    if (!userBehavior || userBehavior.transmissionTimes.length === 0) {
      return 0.2;
    }

    const currentTime = new Date(transmissionData.timestamp);
    const hour = currentTime.getHours();
    
    // Check if transmission is outside normal hours
    const isBusinessHours = hour >= 9 && hour <= 17;
    const isWeekend = currentTime.getDay() === 0 || currentTime.getDay() === 6;
    
    if (!isBusinessHours || isWeekend) {
      return 0.6; // Higher risk for off-hours transmission
    }

    return 0.1; // Low risk for business hours
  }

  /**
   * Determine action based on risk score
   * @param {number} riskScore - Risk score
   * @returns {string} Action to take
   */
  determineAction(riskScore) {
    if (riskScore >= 0.8) return 'BLOCK';
    if (riskScore >= 0.6) return 'QUARANTINE';
    if (riskScore >= 0.4) return 'REVIEW';
    return 'ALLOW';
  }

  /**
   * Generate recommendations based on analysis
   * @param {Object} analysis - Analysis result
   * @returns {Array} Recommendations
   */
  generateRecommendations(analysis) {
    const recommendations = [];

    if (analysis.riskScore >= 0.8) {
      recommendations.push('Immediate transmission block recommended');
      recommendations.push('Notify security team for investigation');
    } else if (analysis.riskScore >= 0.6) {
      recommendations.push('Quarantine transmission for manual review');
      recommendations.push('Consider additional user verification');
    } else if (analysis.riskScore >= 0.4) {
      recommendations.push('Flag for security team review');
      recommendations.push('Monitor user activity closely');
    } else {
      recommendations.push('Transmission appears normal');
    }

    // Add specific recommendations based on violations
    for (const violation of analysis.violations) {
      if (violation.type === 'FINANCIAL_KEYWORD') {
        recommendations.push('Remove or encrypt financial information');
      } else if (violation.type === 'BEHAVIORAL_ANOMALY') {
        recommendations.push('Verify user identity and intent');
      } else if (violation.type === 'DATA_CLASSIFICATION') {
        recommendations.push('Apply appropriate data classification');
      }
    }

    return recommendations;
  }

  /**
   * Update user behavior patterns
   * @param {string} userId - User ID
   * @param {Object} transmissionData - Transmission data
   * @param {Object} analysis - Analysis result
   */
  updateUserBehavior(userId, transmissionData, _analysis) {
    const userBehavior = this.userBehaviors.get(userId) || this.initializeUserBehavior();

    // Update destinations
    if (!userBehavior.destinations.includes(transmissionData.destination)) {
      userBehavior.destinations.push(transmissionData.destination);
    }

    // Update content patterns
    userBehavior.contentPatterns.push(transmissionData.content.length);
    userBehavior.contentSizes.push(transmissionData.content.length);

    // Update transmission times
    userBehavior.transmissionTimes.push(transmissionData.timestamp);

    // Update daily transmission count
    const today = new Date(transmissionData.timestamp).toDateString();
    userBehavior.dailyTransmissions[today] = (userBehavior.dailyTransmissions[today] || 0) + 1;

    // Recalculate average daily transmissions
    const dailyCounts = Object.values(userBehavior.dailyTransmissions);
    userBehavior.avgDailyTransmissions = dailyCounts.reduce((a, b) => a + b, 0) / dailyCounts.length;

    // Keep only recent data (last 100 transmissions)
    if (userBehavior.contentPatterns.length > 100) {
      userBehavior.contentPatterns.shift();
      userBehavior.contentSizes.shift();
      userBehavior.transmissionTimes.shift();
    }

    this.userBehaviors.set(userId, userBehavior);
  }

  /**
   * Initialize user behavior tracking
   * @returns {Object} Initial user behavior
   */
  initializeUserBehavior() {
    return {
      destinations: [],
      contentPatterns: [],
      contentSizes: [],
      transmissionTimes: [],
      dailyTransmissions: {},
      avgDailyTransmissions: 0,
      totalTransmissions: 0,
      riskScore: 0
    };
  }

  /**
   * Get user behavior summary
   * @param {string} userId - User ID
   * @returns {Object} User behavior summary
   */
  getUserBehaviorSummary(userId) {
    const userBehavior = this.userBehaviors.get(userId);
    if (!userBehavior) {
      return {
        userId,
        status: 'NO_DATA',
        message: 'No behavioral data available for user'
      };
    }

    return {
      userId,
      status: 'ACTIVE',
      totalTransmissions: userBehavior.transmissionTimes.length,
      uniqueDestinations: userBehavior.destinations.length,
      avgContentSize: userBehavior.contentSizes.reduce((a, b) => a + b, 0) / userBehavior.contentSizes.length,
      avgDailyTransmissions: userBehavior.avgDailyTransmissions,
      lastTransmission: userBehavior.transmissionTimes[userBehavior.transmissionTimes.length - 1],
      riskLevel: this.calculateUserRiskLevel(userBehavior)
    };
  }

  /**
   * Calculate user risk level
   * @param {Object} userBehavior - User behavior data
   * @returns {string} Risk level
   */
  calculateUserRiskLevel(userBehavior) {
    const totalTransmissions = userBehavior.transmissionTimes.length;
    const uniqueDestinations = userBehavior.destinations.length;
    const avgDailyTransmissions = userBehavior.avgDailyTransmissions;

    let riskScore = 0;

    // High transmission volume
    if (avgDailyTransmissions > 50) riskScore += 0.3;
    
    // Many unique destinations
    if (uniqueDestinations > 20) riskScore += 0.3;
    
    // High total transmissions
    if (totalTransmissions > 1000) riskScore += 0.2;
    
    // Recent activity
    const lastTransmission = new Date(userBehavior.transmissionTimes[userBehavior.transmissionTimes.length - 1]);
    const hoursSinceLastTransmission = (Date.now() - lastTransmission.getTime()) / (1000 * 60 * 60);
    if (hoursSinceLastTransmission < 1) riskScore += 0.2;

    if (riskScore < 0.3) return 'LOW';
    if (riskScore < 0.6) return 'MEDIUM';
    if (riskScore < 0.8) return 'HIGH';
    return 'CRITICAL';
  }
}

module.exports = BehaviorAwareDLP;
