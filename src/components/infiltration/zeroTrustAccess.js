/**
 * Zero Trust Access Control Component
 * Continuously verifies users using behavioral, device, and contextual metrics
 * Designed specifically for fintech applications with adaptive MFA
 */

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

class ZeroTrustAccessControl {
  constructor() {
    this.riskThreshold = 0.7;
    this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
    this.activeSessions = new Map();
    this.userProfiles = new Map(); // Store user behavioral profiles
    this.deviceRegistry = new Map(); // Trusted device registry
    this.mfaMethods = ['sms', 'email', 'totp', 'biometric', 'push'];
    this.fintechRiskFactors = {
      transactionAmount: 0.3,
      unusualLocation: 0.4,
      newDevice: 0.5,
      afterHours: 0.2,
      highFrequency: 0.3,
      suspiciousPattern: 0.6
    };
  }

  /**
   * Verify user access with continuous authentication
   * @param {Object} userContext - User context including device, location, behavior
   * @param {Object} transactionContext - Transaction context for fintech operations
   * @returns {Object} Access decision with risk score and MFA requirements
   */
  async verifyAccess(userContext, transactionContext = {}) {
    // Update user behavioral profile
    await this.updateUserProfile(userContext);
    
    // Calculate comprehensive risk score
    const riskScore = await this.calculateFintechRiskScore(userContext, transactionContext);
    
    // Determine MFA requirements based on risk
    const mfaRequirements = this.determineMFARequirements(riskScore, transactionContext);
    
    const accessDecision = {
      allowed: riskScore < this.riskThreshold,
      riskScore,
      timestamp: new Date().toISOString(),
      requiresMFA: riskScore > 0.5,
      mfaMethods: mfaRequirements,
      sessionId: this.generateSessionId(),
      deviceTrusted: this.isDeviceTrusted(userContext.deviceFingerprint),
      behavioralAnomaly: await this.detectBehavioralAnomaly(userContext),
      riskFactors: this.getRiskFactors(userContext, transactionContext),
      recommendations: this.getSecurityRecommendations(riskScore)
    };

    if (accessDecision.allowed) {
      this.activeSessions.set(accessDecision.sessionId, {
        userContext,
        transactionContext,
        riskScore,
        mfaMethods: mfaRequirements,
        createdAt: Date.now(),
        lastActivity: Date.now()
      });
    }

    return accessDecision;
  }

  /**
   * Calculate comprehensive fintech risk score
   * @param {Object} userContext - User context
   * @param {Object} transactionContext - Transaction context
   * @returns {number} Risk score between 0 and 1
   */
  async calculateFintechRiskScore(userContext, transactionContext) {
    let riskScore = 0;

    // Device and browser fingerprinting
    riskScore += this.calculateDeviceRisk(userContext);
    
    // Location and geolocation analysis
    riskScore += this.calculateLocationRisk(userContext);
    
    // Behavioral pattern analysis
    riskScore += await this.calculateBehavioralRisk(userContext);
    
    // Transaction-specific risks
    riskScore += this.calculateTransactionRisk(transactionContext);
    
    // Time-based patterns
    riskScore += this.calculateTimeRisk(userContext);
    
    // Network and connection analysis
    riskScore += this.calculateNetworkRisk(userContext);
    
    // Velocity and frequency checks
    riskScore += this.calculateVelocityRisk(userContext);

    return Math.min(riskScore, 1.0);
  }

  /**
   * Calculate device-related risk factors
   * @param {Object} userContext - User context
   * @returns {number} Device risk score
   */
  calculateDeviceRisk(userContext) {
    let risk = 0;
    
    // New device risk
    if (!this.isDeviceTrusted(userContext.deviceFingerprint)) {
      risk += this.fintechRiskFactors.newDevice;
    }
    
    // Browser/OS anomalies
    if (userContext.browserAnomaly) risk += 0.2;
    if (userContext.osAnomaly) risk += 0.2;
    
    // Device characteristics
    if (userContext.isMobile && userContext.isNewMobile) risk += 0.1;
    if (userContext.isEmulator) risk += 0.4;
    
    return risk;
  }

  /**
   * Calculate location-based risk factors
   * @param {Object} userContext - User context
   * @returns {number} Location risk score
   */
  calculateLocationRisk(userContext) {
    let risk = 0;
    
    // Unusual location
    if (userContext.unusualLocation) {
      risk += this.fintechRiskFactors.unusualLocation;
    }
    
    // High-risk countries
    if (userContext.highRiskCountry) risk += 0.3;
    
    // VPN/Proxy detection
    if (userContext.isVPN) risk += 0.2;
    if (userContext.isProxy) risk += 0.3;
    
    // Location velocity (impossible travel)
    if (userContext.impossibleTravel) risk += 0.5;
    
    return risk;
  }

  /**
   * Calculate behavioral pattern risk
   * @param {Object} userContext - User context
   * @returns {number} Behavioral risk score
   */
  async calculateBehavioralRisk(userContext) {
    let risk = 0;
    
    // Login pattern anomalies
    if (userContext.unusualLoginTime) risk += 0.2;
    if (userContext.unusualLoginFrequency) risk += 0.3;
    
    // Typing patterns
    if (userContext.typingAnomaly) risk += 0.2;
    
    // Mouse movement patterns
    if (userContext.mouseAnomaly) risk += 0.1;
    
    // Session behavior
    if (userContext.sessionAnomaly) risk += 0.2;
    
    return risk;
  }

  /**
   * Calculate transaction-specific risk factors
   * @param {Object} transactionContext - Transaction context
   * @returns {number} Transaction risk score
   */
  calculateTransactionRisk(transactionContext) {
    let risk = 0;
    
    if (!transactionContext || Object.keys(transactionContext).length === 0) {
      return risk;
    }
    
    // High-value transactions
    if (transactionContext.amount > 10000) {
      risk += this.fintechRiskFactors.transactionAmount;
    }
    
    // Unusual transaction patterns
    if (transactionContext.unusualAmount) risk += 0.3;
    if (transactionContext.unusualRecipient) risk += 0.4;
    if (transactionContext.unusualPurpose) risk += 0.2;
    
    // Transaction frequency
    if (transactionContext.highFrequency) {
      risk += this.fintechRiskFactors.highFrequency;
    }
    
    return risk;
  }

  /**
   * Calculate time-based risk factors
   * @param {Object} userContext - User context
   * @returns {number} Time risk score
   */
  calculateTimeRisk(userContext) {
    let risk = 0;
    
    // After-hours access
    if (this.isUnusualTime(userContext.timestamp)) {
      risk += this.fintechRiskFactors.afterHours;
    }
    
    // Weekend access for business accounts
    if (userContext.isWeekend && userContext.accountType === 'business') {
      risk += 0.2;
    }
    
    return risk;
  }

  /**
   * Calculate network-related risk factors
   * @param {Object} userContext - User context
   * @returns {number} Network risk score
   */
  calculateNetworkRisk(userContext) {
    let risk = 0;
    
    // Suspicious IP
    if (userContext.suspiciousIP) risk += 0.3;
    
    // Tor network
    if (userContext.isTor) risk += 0.4;
    
    // Public WiFi
    if (userContext.isPublicWiFi) risk += 0.1;
    
    return risk;
  }

  /**
   * Calculate velocity-based risk factors
   * @param {Object} userContext - User context
   * @returns {number} Velocity risk score
   */
  calculateVelocityRisk(userContext) {
    let risk = 0;
    
    // High-frequency logins
    if (userContext.loginVelocity > 10) risk += 0.3;
    
    // Rapid location changes
    if (userContext.locationVelocity > 1000) risk += 0.4;
    
    return risk;
  }

  /**
   * Check if access time is unusual
   * @param {string} timestamp - Access timestamp
   * @returns {boolean} True if unusual time
   */
  isUnusualTime(timestamp) {
    const hour = new Date(timestamp).getHours();
    return hour < 6 || hour > 22; // Outside business hours
  }

  /**
   * Determine MFA requirements based on risk score and transaction context
   * @param {number} riskScore - Calculated risk score
   * @param {Object} transactionContext - Transaction context
   * @returns {Array} Required MFA methods
   */
  determineMFARequirements(riskScore, transactionContext) {
    const mfaMethods = [];
    
    // Low risk: No MFA required
    if (riskScore < 0.3) {
      return mfaMethods;
    }
    
    // Medium risk: Single MFA
    if (riskScore < 0.6) {
      mfaMethods.push('totp');
    }
    
    // High risk: Multiple MFA methods
    if (riskScore >= 0.6) {
      mfaMethods.push('totp', 'sms');
    }
    
    // Very high risk: All available MFA methods
    if (riskScore >= 0.8) {
      mfaMethods.push('biometric', 'push');
    }
    
    // Transaction-specific MFA requirements
    if (transactionContext && transactionContext.amount > 50000) {
      mfaMethods.push('biometric');
    }
    
    return [...new Set(mfaMethods)]; // Remove duplicates
  }

  /**
   * Check if device is trusted
   * @param {string} deviceFingerprint - Device fingerprint
   * @returns {boolean} True if device is trusted
   */
  isDeviceTrusted(deviceFingerprint) {
    return this.deviceRegistry.has(deviceFingerprint);
  }

  /**
   * Register a trusted device
   * @param {string} deviceFingerprint - Device fingerprint
   * @param {Object} deviceInfo - Device information
   */
  registerTrustedDevice(deviceFingerprint, deviceInfo) {
    this.deviceRegistry.set(deviceFingerprint, {
      ...deviceInfo,
      registeredAt: Date.now(),
      lastUsed: Date.now()
    });
  }

  /**
   * Update user behavioral profile
   * @param {Object} userContext - User context
   */
  async updateUserProfile(userContext) {
    const userId = userContext.userId;
    if (!userId) return;
    
    const profile = this.userProfiles.get(userId) || {
      loginTimes: [],
      locations: [],
      devices: [],
      behaviors: []
    };
    
    // Update login times
    profile.loginTimes.push(new Date(userContext.timestamp));
    if (profile.loginTimes.length > 100) {
      profile.loginTimes = profile.loginTimes.slice(-50); // Keep last 50
    }
    
    // Update locations
    if (userContext.location) {
      profile.locations.push({
        ...userContext.location,
        timestamp: userContext.timestamp
      });
      if (profile.locations.length > 50) {
        profile.locations = profile.locations.slice(-25); // Keep last 25
      }
    }
    
    // Update devices
    if (userContext.deviceFingerprint) {
      const deviceExists = profile.devices.some(d => d.fingerprint === userContext.deviceFingerprint);
      if (!deviceExists) {
        profile.devices.push({
          fingerprint: userContext.deviceFingerprint,
          firstSeen: userContext.timestamp,
          lastSeen: userContext.timestamp
        });
      } else {
        const device = profile.devices.find(d => d.fingerprint === userContext.deviceFingerprint);
        device.lastSeen = userContext.timestamp;
      }
    }
    
    this.userProfiles.set(userId, profile);
  }

  /**
   * Detect behavioral anomalies
   * @param {Object} userContext - User context
   * @returns {Object} Anomaly detection results
   */
  async detectBehavioralAnomaly(userContext) {
    const userId = userContext.userId;
    if (!userId) return { detected: false };
    
    const profile = this.userProfiles.get(userId);
    if (!profile) return { detected: false };
    
    const anomalies = [];
    
    // Check login time patterns
    if (profile.loginTimes.length > 5) {
      const currentHour = new Date(userContext.timestamp).getHours();
      const usualHours = profile.loginTimes.map(t => new Date(t).getHours());
      const hourFrequency = usualHours.reduce((acc, hour) => {
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {});
      
      const mostCommonHours = Object.keys(hourFrequency)
        .sort((a, b) => hourFrequency[b] - hourFrequency[a])
        .slice(0, 3);
      
      if (!mostCommonHours.includes(currentHour.toString())) {
        anomalies.push('unusual_login_time');
      }
    }
    
    // Check location patterns
    if (profile.locations.length > 3 && userContext.location) {
      const recentLocations = profile.locations.slice(-10);
      const currentLocation = userContext.location;
      
      const isNewLocation = !recentLocations.some(loc => 
        Math.abs(loc.lat - currentLocation.lat) < 0.01 && 
        Math.abs(loc.lng - currentLocation.lng) < 0.01
      );
      
      if (isNewLocation) {
        anomalies.push('unusual_location');
      }
    }
    
    return {
      detected: anomalies.length > 0,
      anomalies,
      confidence: anomalies.length / 3 // Normalize to 0-1
    };
  }

  /**
   * Get risk factors breakdown
   * @param {Object} userContext - User context
   * @param {Object} transactionContext - Transaction context
   * @returns {Object} Risk factors breakdown
   */
  getRiskFactors(userContext, transactionContext) {
    return {
      device: this.calculateDeviceRisk(userContext),
      location: this.calculateLocationRisk(userContext),
      transaction: this.calculateTransactionRisk(transactionContext),
      time: this.calculateTimeRisk(userContext),
      network: this.calculateNetworkRisk(userContext),
      velocity: this.calculateVelocityRisk(userContext)
    };
  }

  /**
   * Get security recommendations based on risk score
   * @param {number} riskScore - Risk score
   * @returns {Array} Security recommendations
   */
  getSecurityRecommendations(riskScore) {
    const recommendations = [];
    
    if (riskScore > 0.8) {
      recommendations.push('Immediate account review required');
      recommendations.push('Contact security team');
      recommendations.push('Enable all MFA methods');
    } else if (riskScore > 0.6) {
      recommendations.push('Enhanced monitoring recommended');
      recommendations.push('Consider additional MFA');
    } else if (riskScore > 0.4) {
      recommendations.push('Monitor for additional anomalies');
    }
    
    return recommendations;
  }

  /**
   * Generate unique session ID
   * @returns {string} Session ID
   */
  generateSessionId() {
    // Use crypto.randomBytes for cryptographically secure random generation
    const randomBytes = crypto.randomBytes(16).toString('hex');
    return `session_${Date.now()}_${randomBytes}`;
  }

  /**
   * Clean up expired sessions
   */
  cleanupExpiredSessions() {
    const now = Date.now();
    for (const [sessionId, session] of this.activeSessions) {
      if (now - session.createdAt > this.sessionTimeout) {
        this.activeSessions.delete(sessionId);
      }
    }
  }

  /**
   * Initialize Zero Trust Access Control
   */
  initialize() {
    console.log('🔐 Initializing Zero Trust Access Control...');
    
    // Set up periodic cleanup
    setInterval(() => {
      this.cleanupExpiredSessions();
    }, 5 * 60 * 1000); // Clean up every 5 minutes
    
    console.log('✅ Zero Trust Access Control initialized');
  }

  /**
   * Get system statistics
   * @returns {Object} System statistics
   */
  getStats() {
    return {
      activeSessions: this.activeSessions.size,
      registeredDevices: this.deviceRegistry.size,
      userProfiles: this.userProfiles.size,
      riskThreshold: this.riskThreshold,
      sessionTimeout: this.sessionTimeout
    };
  }
}

module.exports = ZeroTrustAccessControl;
