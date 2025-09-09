/**
 * AI-Driven Intrusion Detection Component
 * Monitors login and access patterns to flag anomalous behaviors and compromised accounts
 */

class AIIntrusionDetection {
  constructor() {
    this.loginPatterns = new Map();
    this.accessPatterns = new Map();
    this.anomalyThreshold = 0.8;
    this.learningRate = 0.1;
  }

  /**
   * Analyze login attempt for anomalies
   * @param {Object} loginAttempt - Login attempt data
   * @returns {Object} Analysis result with anomaly score
   */
  async analyzeLoginAttempt(loginAttempt) {
    const userId = loginAttempt.userId;
    const userPattern = this.loginPatterns.get(userId) || this.initializeUserPattern();
    
    const anomalyScore = await this.calculateLoginAnomaly(loginAttempt, userPattern);
    
    const result = {
      userId,
      anomalyScore,
      isAnomalous: anomalyScore > this.anomalyThreshold,
      riskLevel: this.getRiskLevel(anomalyScore),
      timestamp: new Date().toISOString(),
      recommendations: this.getRecommendations(anomalyScore)
    };

    // Update user pattern with new data
    this.updateUserPattern(userId, loginAttempt, anomalyScore);

    return result;
  }

  /**
   * Analyze access pattern for anomalies
   * @param {Object} accessAttempt - Access attempt data
   * @returns {Object} Analysis result
   */
  async analyzeAccessPattern(accessAttempt) {
    const userId = accessAttempt.userId;
    const resource = accessAttempt.resource;
    
    const accessKey = `${userId}_${resource}`;
    const pattern = this.accessPatterns.get(accessKey) || this.initializeAccessPattern();
    
    const anomalyScore = await this.calculateAccessAnomaly(accessAttempt, pattern);
    
    const result = {
      userId,
      resource,
      anomalyScore,
      isAnomalous: anomalyScore > this.anomalyThreshold,
      riskLevel: this.getRiskLevel(anomalyScore),
      timestamp: new Date().toISOString()
    };

    this.updateAccessPattern(accessKey, accessAttempt, anomalyScore);

    return result;
  }

  /**
   * Calculate login anomaly score
   * @param {Object} loginAttempt - Current login attempt
   * @param {Object} userPattern - User's historical pattern
   * @returns {number} Anomaly score between 0 and 1
   */
  async calculateLoginAnomaly(loginAttempt, userPattern) {
    let anomalyScore = 0;

    // Time-based anomaly
    const timeAnomaly = this.calculateTimeAnomaly(loginAttempt.timestamp, userPattern.loginTimes);
    anomalyScore += timeAnomaly * 0.3;

    // Location-based anomaly
    const locationAnomaly = this.calculateLocationAnomaly(loginAttempt.location, userPattern.locations);
    anomalyScore += locationAnomaly * 0.3;

    // Device-based anomaly
    const deviceAnomaly = this.calculateDeviceAnomaly(loginAttempt.deviceFingerprint, userPattern.devices);
    anomalyScore += deviceAnomaly * 0.2;

    // Frequency anomaly
    const frequencyAnomaly = this.calculateFrequencyAnomaly(loginAttempt.timestamp, userPattern.loginFrequency);
    anomalyScore += frequencyAnomaly * 0.2;

    return Math.min(anomalyScore, 1.0);
  }

  /**
   * Calculate access anomaly score
   * @param {Object} accessAttempt - Current access attempt
   * @param {Object} pattern - Access pattern
   * @returns {number} Anomaly score
   */
  async calculateAccessAnomaly(accessAttempt, pattern) {
    let anomalyScore = 0;

    // Volume anomaly
    const volumeAnomaly = this.calculateVolumeAnomaly(accessAttempt.dataVolume, pattern.avgVolume);
    anomalyScore += volumeAnomaly * 0.4;

    // Time anomaly
    const timeAnomaly = this.calculateTimeAnomaly(accessAttempt.timestamp, pattern.accessTimes);
    anomalyScore += timeAnomaly * 0.3;

    // Pattern anomaly
    const patternAnomaly = this.calculatePatternAnomaly(accessAttempt.action, pattern.commonActions);
    anomalyScore += patternAnomaly * 0.3;

    return Math.min(anomalyScore, 1.0);
  }

  /**
   * Calculate time-based anomaly
   * @param {string} timestamp - Current timestamp
   * @param {Array} historicalTimes - Historical timestamps
   * @returns {number} Time anomaly score
   */
  calculateTimeAnomaly(timestamp, historicalTimes) {
    if (historicalTimes.length === 0) return 0.5;
    
    const currentHour = new Date(timestamp).getHours();
    const historicalHours = historicalTimes.map(t => new Date(t).getHours());
    
    const avgHour = historicalHours.reduce((a, b) => a + b, 0) / historicalHours.length;
    const hourDiff = Math.abs(currentHour - avgHour);
    
    return Math.min(hourDiff / 12, 1.0); // Normalize to 0-1
  }

  /**
   * Calculate location-based anomaly
   * @param {Object} currentLocation - Current location
   * @param {Array} historicalLocations - Historical locations
   * @returns {number} Location anomaly score
   */
  calculateLocationAnomaly(currentLocation, historicalLocations) {
    if (historicalLocations.length === 0) return 0.5;
    
    // Simple distance-based anomaly (in real implementation, use proper geolocation)
    const isNewLocation = !historicalLocations.some(loc => 
      loc.country === currentLocation.country && loc.city === currentLocation.city
    );
    
    return isNewLocation ? 0.8 : 0.1;
  }

  /**
   * Calculate device-based anomaly
   * @param {string} currentDevice - Current device fingerprint
   * @param {Array} historicalDevices - Historical devices
   * @returns {number} Device anomaly score
   */
  calculateDeviceAnomaly(currentDevice, historicalDevices) {
    if (historicalDevices.length === 0) return 0.5;
    
    const isKnownDevice = historicalDevices.includes(currentDevice);
    return isKnownDevice ? 0.1 : 0.8;
  }

  /**
   * Calculate frequency anomaly
   * @param {string} timestamp - Current timestamp
   * @param {Object} frequencyPattern - Frequency pattern
   * @returns {number} Frequency anomaly score
   */
  calculateFrequencyAnomaly(timestamp, frequencyPattern) {
    const currentHour = new Date(timestamp).getHours();
    const expectedFrequency = frequencyPattern[currentHour] || 0;
    const actualFrequency = 1; // Current attempt
    
    if (expectedFrequency === 0) return 0.8;
    
    const frequencyRatio = actualFrequency / expectedFrequency;
    return Math.min(Math.abs(frequencyRatio - 1), 1.0);
  }

  /**
   * Calculate volume anomaly
   * @param {number} currentVolume - Current data volume
   * @param {number} avgVolume - Average historical volume
   * @returns {number} Volume anomaly score
   */
  calculateVolumeAnomaly(currentVolume, avgVolume) {
    if (avgVolume === 0) return 0.5;
    
    const volumeRatio = currentVolume / avgVolume;
    return Math.min(Math.abs(volumeRatio - 1), 1.0);
  }

  /**
   * Calculate pattern anomaly
   * @param {string} currentAction - Current action
   * @param {Array} commonActions - Common actions
   * @returns {number} Pattern anomaly score
   */
  calculatePatternAnomaly(currentAction, commonActions) {
    const isCommonAction = commonActions.includes(currentAction);
    return isCommonAction ? 0.1 : 0.8;
  }

  /**
   * Get risk level based on anomaly score
   * @param {number} anomalyScore - Anomaly score
   * @returns {string} Risk level
   */
  getRiskLevel(anomalyScore) {
    if (anomalyScore < 0.3) return 'LOW';
    if (anomalyScore < 0.6) return 'MEDIUM';
    if (anomalyScore < 0.8) return 'HIGH';
    return 'CRITICAL';
  }

  /**
   * Get security recommendations
   * @param {number} anomalyScore - Anomaly score
   * @returns {Array} Recommendations
   */
  getRecommendations(anomalyScore) {
    const recommendations = [];
    
    if (anomalyScore > 0.5) {
      recommendations.push('Enable additional MFA verification');
    }
    
    if (anomalyScore > 0.7) {
      recommendations.push('Temporarily restrict account access');
      recommendations.push('Notify security team');
    }
    
    if (anomalyScore > 0.9) {
      recommendations.push('Immediate account lockdown');
      recommendations.push('Initiate incident response');
    }
    
    return recommendations;
  }

  /**
   * Initialize user pattern
   * @returns {Object} Initial user pattern
   */
  initializeUserPattern() {
    return {
      loginTimes: [],
      locations: [],
      devices: [],
      loginFrequency: {},
      totalLogins: 0
    };
  }

  /**
   * Initialize access pattern
   * @returns {Object} Initial access pattern
   */
  initializeAccessPattern() {
    return {
      accessTimes: [],
      avgVolume: 0,
      commonActions: [],
      totalAccesses: 0
    };
  }

  /**
   * Update user pattern with new data
   * @param {string} userId - User ID
   * @param {Object} loginAttempt - Login attempt
   * @param {number} anomalyScore - Anomaly score
   */
  updateUserPattern(userId, loginAttempt, _anomalyScore) {
    const pattern = this.loginPatterns.get(userId) || this.initializeUserPattern();
    
    pattern.loginTimes.push(loginAttempt.timestamp);
    pattern.locations.push(loginAttempt.location);
    pattern.devices.push(loginAttempt.deviceFingerprint);
    pattern.totalLogins++;
    
    // Update frequency pattern
    const hour = new Date(loginAttempt.timestamp).getHours();
    pattern.loginFrequency[hour] = (pattern.loginFrequency[hour] || 0) + 1;
    
    // Keep only recent data (last 100 logins)
    if (pattern.loginTimes.length > 100) {
      pattern.loginTimes.shift();
      pattern.locations.shift();
      pattern.devices.shift();
    }
    
    this.loginPatterns.set(userId, pattern);
  }

  /**
   * Update access pattern with new data
   * @param {string} accessKey - Access key
   * @param {Object} accessAttempt - Access attempt
   * @param {number} anomalyScore - Anomaly score
   */
  updateAccessPattern(accessKey, accessAttempt, _anomalyScore) {
    const pattern = this.accessPatterns.get(accessKey) || this.initializeAccessPattern();
    
    pattern.accessTimes.push(accessAttempt.timestamp);
    pattern.totalAccesses++;
    
    // Update average volume
    pattern.avgVolume = (pattern.avgVolume * (pattern.totalAccesses - 1) + accessAttempt.dataVolume) / pattern.totalAccesses;
    
    // Update common actions
    if (!pattern.commonActions.includes(accessAttempt.action)) {
      pattern.commonActions.push(accessAttempt.action);
    }
    
    // Keep only recent data
    if (pattern.accessTimes.length > 50) {
      pattern.accessTimes.shift();
    }
    
    this.accessPatterns.set(accessKey, pattern);
  }

  /**
   * Initialize AI Intrusion Detection
   */
  initialize() {
    console.log('🤖 Initializing AI Intrusion Detection...');
    console.log('✅ AI Intrusion Detection initialized');
  }
}

module.exports = AIIntrusionDetection;
