/**
 * Role-Based Access to Data Vaults Component
 * Protects financial records and customer data with strict role-based permissions
 */

class RoleBasedAccessControl {
  constructor() {
    this.roles = new Map();
    this.permissions = new Map();
    this.dataVaults = new Map();
    this.accessLogs = [];
    this.sessionManager = new Map();
  }

  /**
   * Initialize default roles and permissions
   */
  initialize() {
    console.log('🔐 Initializing Role-Based Access Control...');
    
    // Define roles hierarchy
    this.defineRole('admin', {
      level: 10,
      description: 'Full system administrator access',
      permissions: ['READ', 'WRITE', 'DELETE', 'ADMIN', 'AUDIT']
    });

    this.defineRole('security_officer', {
      level: 8,
      description: 'Security operations and monitoring',
      permissions: ['READ', 'AUDIT', 'SECURITY_MONITOR', 'INCIDENT_RESPONSE']
    });

    this.defineRole('data_analyst', {
      level: 6,
      description: 'Data analysis and reporting',
      permissions: ['READ', 'ANALYZE', 'EXPORT']
    });

    this.defineRole('customer_service', {
      level: 4,
      description: 'Customer service representative',
      permissions: ['READ_CUSTOMER_DATA', 'UPDATE_CUSTOMER_INFO']
    });

    this.defineRole('auditor', {
      level: 7,
      description: 'Internal and external auditor',
      permissions: ['READ', 'AUDIT', 'EXPORT_AUDIT_LOGS']
    });

    this.defineRole('read_only', {
      level: 2,
      description: 'Read-only access for viewing',
      permissions: ['READ']
    });

    // Initialize data vaults
    this.initializeDataVaults();
    
    console.log('✅ Role-Based Access Control initialized');
  }

  /**
   * Define a role with permissions
   * @param {string} roleName - Name of the role
   * @param {Object} roleConfig - Role configuration
   */
  defineRole(roleName, roleConfig) {
    const role = {
      name: roleName,
      level: roleConfig.level,
      description: roleConfig.description,
      permissions: roleConfig.permissions,
      createdAt: new Date().toISOString(),
      isActive: true
    };

    this.roles.set(roleName, role);
    
    // Update permissions mapping
    for (const permission of roleConfig.permissions) {
      if (!this.permissions.has(permission)) {
        this.permissions.set(permission, []);
      }
      this.permissions.get(permission).push(roleName);
    }
  }

  /**
   * Initialize data vaults with access controls
   */
  initializeDataVaults() {
    const vaults = [
      {
        name: 'customer_data_vault',
        description: 'Customer personal and financial information',
        sensitivity: 'HIGH',
        encryption: true,
        allowedRoles: ['admin', 'security_officer', 'customer_service', 'auditor'],
        restrictedRoles: ['read_only'],
        accessLogging: true
      },
      {
        name: 'financial_records_vault',
        description: 'Financial transactions and account data',
        sensitivity: 'CRITICAL',
        encryption: true,
        allowedRoles: ['admin', 'security_officer', 'data_analyst', 'auditor'],
        restrictedRoles: ['customer_service', 'read_only'],
        accessLogging: true
      },
      {
        name: 'audit_logs_vault',
        description: 'System audit logs and security events',
        sensitivity: 'HIGH',
        encryption: true,
        allowedRoles: ['admin', 'security_officer', 'auditor'],
        restrictedRoles: ['data_analyst', 'customer_service', 'read_only'],
        accessLogging: true
      },
      {
        name: 'analytics_data_vault',
        description: 'Analytics and reporting data',
        sensitivity: 'MEDIUM',
        encryption: false,
        allowedRoles: ['admin', 'data_analyst', 'auditor'],
        restrictedRoles: ['customer_service'],
        accessLogging: true
      },
      {
        name: 'system_config_vault',
        description: 'System configuration and settings',
        sensitivity: 'HIGH',
        encryption: true,
        allowedRoles: ['admin', 'security_officer'],
        restrictedRoles: ['data_analyst', 'customer_service', 'auditor', 'read_only'],
        accessLogging: true
      }
    ];

    for (const vault of vaults) {
      this.dataVaults.set(vault.name, {
        ...vault,
        createdAt: new Date().toISOString(),
        lastAccessed: null,
        accessCount: 0,
        activeSessions: new Set()
      });
    }
  }

  /**
   * Check access permission for user to data vault
   * @param {string} userId - User ID
   * @param {string} userRole - User role
   * @param {string} vaultName - Data vault name
   * @param {string} action - Action being performed
   * @param {Object} context - Additional context
   * @returns {Object} Access decision
   */
  async checkAccess(userId, userRole, vaultName, action, context = {}) {
    const timestamp = new Date().toISOString();
    
    const accessDecision = {
      userId,
      userRole,
      vaultName,
      action,
      timestamp,
      allowed: false,
      reason: '',
      riskLevel: 'LOW',
      sessionId: null,
      recommendations: []
    };

    // Validate user role
    const role = this.roles.get(userRole);
    if (!role || !role.isActive) {
      accessDecision.allowed = false;
      accessDecision.reason = 'Invalid or inactive user role';
      accessDecision.riskLevel = 'HIGH';
      return accessDecision;
    }

    // Validate data vault
    const vault = this.dataVaults.get(vaultName);
    if (!vault) {
      accessDecision.allowed = false;
      accessDecision.reason = 'Data vault not found';
      accessDecision.riskLevel = 'MEDIUM';
      return accessDecision;
    }

    // Check role-based access
    const hasRoleAccess = vault.allowedRoles.includes(userRole);
    const isRestrictedRole = vault.restrictedRoles.includes(userRole);

    if (isRestrictedRole) {
      accessDecision.allowed = false;
      accessDecision.reason = 'Role explicitly restricted from this vault';
      accessDecision.riskLevel = 'HIGH';
      accessDecision.recommendations.push('Contact administrator for access request');
      return accessDecision;
    }

    if (!hasRoleAccess) {
      accessDecision.allowed = false;
      accessDecision.reason = 'Role not authorized for this vault';
      accessDecision.riskLevel = 'MEDIUM';
      accessDecision.recommendations.push('Request role upgrade or vault access');
      return accessDecision;
    }

    // Check action permissions
    const hasActionPermission = this.checkActionPermission(userRole, action);
    if (!hasActionPermission) {
      accessDecision.allowed = false;
      accessDecision.reason = `Action '${action}' not permitted for role '${userRole}'`;
      accessDecision.riskLevel = 'HIGH';
      accessDecision.recommendations.push('Request additional permissions');
      return accessDecision;
    }

    // Check vault-specific restrictions
    const vaultRestrictions = this.checkVaultRestrictions(vault, action, context);
    if (!vaultRestrictions.allowed) {
      accessDecision.allowed = false;
      accessDecision.reason = vaultRestrictions.reason;
      accessDecision.riskLevel = vaultRestrictions.riskLevel;
      accessDecision.recommendations.push(...vaultRestrictions.recommendations);
      return accessDecision;
    }

    // Check time-based restrictions
    const timeRestrictions = this.checkTimeRestrictions(userRole, vault, context);
    if (!timeRestrictions.allowed) {
      accessDecision.allowed = false;
      accessDecision.reason = timeRestrictions.reason;
      accessDecision.riskLevel = timeRestrictions.riskLevel;
      accessDecision.recommendations.push(...timeRestrictions.recommendations);
      return accessDecision;
    }

    // Check concurrent session limits
    const sessionCheck = this.checkSessionLimits(userId, vault);
    if (!sessionCheck.allowed) {
      accessDecision.allowed = false;
      accessDecision.reason = sessionCheck.reason;
      accessDecision.riskLevel = sessionCheck.riskLevel;
      accessDecision.recommendations.push(...sessionCheck.recommendations);
      return accessDecision;
    }

    // All checks passed - grant access
    accessDecision.allowed = true;
    accessDecision.reason = 'Access granted based on role and permissions';
    accessDecision.riskLevel = 'LOW';
    accessDecision.sessionId = this.createSession(userId, vaultName, action);

    // Log successful access
    this.logAccess(accessDecision);

    // Update vault statistics
    this.updateVaultStats(vaultName, userId, action);

    return accessDecision;
  }

  /**
   * Check if role has permission for specific action
   * @param {string} userRole - User role
   * @param {string} action - Action
   * @returns {boolean} True if permitted
   */
  checkActionPermission(userRole, action) {
    const role = this.roles.get(userRole);
    if (!role) return false;

    // Map actions to permissions
    const actionPermissionMap = {
      'READ': 'READ',
      'WRITE': 'WRITE',
      'DELETE': 'DELETE',
      'UPDATE': 'WRITE',
      'EXPORT': 'EXPORT',
      'ANALYZE': 'ANALYZE',
      'AUDIT': 'AUDIT',
      'ADMIN': 'ADMIN'
    };

    const requiredPermission = actionPermissionMap[action];
    if (!requiredPermission) return false;

    return role.permissions.includes(requiredPermission);
  }

  /**
   * Check vault-specific restrictions
   * @param {Object} vault - Data vault
   * @param {string} action - Action
   * @param {Object} context - Context
   * @returns {Object} Restriction check result
   */
  checkVaultRestrictions(vault, action, context) {
    const result = {
      allowed: true,
      reason: '',
      riskLevel: 'LOW',
      recommendations: []
    };

    // Check sensitivity-based restrictions
    if (vault.sensitivity === 'CRITICAL' && action === 'DELETE') {
      result.allowed = false;
      result.reason = 'Delete operations not allowed on critical data vaults';
      result.riskLevel = 'CRITICAL';
      result.recommendations.push('Use soft delete or archive instead');
      return result;
    }

    // Check encryption requirements
    if (vault.encryption && !context.encrypted) {
      result.allowed = false;
      result.reason = 'Encrypted access required for this vault';
      result.riskLevel = 'HIGH';
      result.recommendations.push('Enable encryption for data access');
      return result;
    }

    // Check data volume restrictions
    if (context.dataSize && context.dataSize > this.getVaultSizeLimit(vault)) {
      result.allowed = false;
      result.reason = 'Data size exceeds vault limits';
      result.riskLevel = 'MEDIUM';
      result.recommendations.push('Split large data operations');
      return result;
    }

    return result;
  }

  /**
   * Check time-based access restrictions
   * @param {string} userRole - User role
   * @param {Object} vault - Data vault
   * @param {Object} context - Context
   * @returns {Object} Time restriction check result
   */
  checkTimeRestrictions(userRole, vault, context) {
    const result = {
      allowed: true,
      reason: '',
      riskLevel: 'LOW',
      recommendations: []
    };

    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();

    // Business hours restriction for sensitive vaults
    if (vault.sensitivity === 'CRITICAL' && (hour < 8 || hour > 18)) {
      const role = this.roles.get(userRole);
      if (role.level < 8) { // Only high-level roles can access outside business hours
        result.allowed = false;
        result.reason = 'Access to critical vaults restricted outside business hours';
        result.riskLevel = 'HIGH';
        result.recommendations.push('Access during business hours (8 AM - 6 PM)');
        return result;
      }
    }

    // Weekend restrictions for certain roles
    if (day === 0 || day === 6) { // Weekend
      const role = this.roles.get(userRole);
      if (role.level < 7 && vault.sensitivity === 'HIGH') {
        result.allowed = false;
        result.reason = 'Weekend access restricted for this role and vault sensitivity';
        result.riskLevel = 'MEDIUM';
        result.recommendations.push('Request weekend access approval');
        return result;
      }
    }

    return result;
  }

  /**
   * Check concurrent session limits
   * @param {string} userId - User ID
   * @param {Object} vault - Data vault
   * @returns {Object} Session check result
   */
  checkSessionLimits(userId, vault) {
    const result = {
      allowed: true,
      reason: '',
      riskLevel: 'LOW',
      recommendations: []
    };

    const userSessions = Array.from(vault.activeSessions).filter(sessionId => {
      const session = this.sessionManager.get(sessionId);
      return session && session.userId === userId;
    });

    const maxSessions = this.getMaxSessionsForVault(vault);
    if (userSessions.length >= maxSessions) {
      result.allowed = false;
      result.reason = `Maximum concurrent sessions (${maxSessions}) exceeded for this vault`;
      result.riskLevel = 'MEDIUM';
      result.recommendations.push('Close existing sessions before opening new ones');
      return result;
    }

    return result;
  }

  /**
   * Create a new access session
   * @param {string} userId - User ID
   * @param {string} vaultName - Vault name
   * @param {string} action - Action
   * @returns {string} Session ID
   */
  createSession(userId, vaultName, action) {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session = {
      sessionId,
      userId,
      vaultName,
      action,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      isActive: true
    };

    this.sessionManager.set(sessionId, session);
    
    const vault = this.dataVaults.get(vaultName);
    if (vault) {
      vault.activeSessions.add(sessionId);
    }

    return sessionId;
  }

  /**
   * Log access attempt
   * @param {Object} accessDecision - Access decision
   */
  logAccess(accessDecision) {
    const logEntry = {
      ...accessDecision,
      logId: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ipAddress: accessDecision.context?.ipAddress || 'unknown',
      userAgent: accessDecision.context?.userAgent || 'unknown'
    };

    this.accessLogs.push(logEntry);

    // Keep only last 10000 log entries
    if (this.accessLogs.length > 10000) {
      this.accessLogs.shift();
    }

    // Log to console for monitoring
    if (accessDecision.allowed) {
      console.log(`✅ Access granted: ${accessDecision.userId} (${accessDecision.userRole}) -> ${accessDecision.vaultName} (${accessDecision.action})`);
    } else {
      console.log(`❌ Access denied: ${accessDecision.userId} (${accessDecision.userRole}) -> ${accessDecision.vaultName} (${accessDecision.action}) - ${accessDecision.reason}`);
    }
  }

  /**
   * Update vault statistics
   * @param {string} vaultName - Vault name
   * @param {string} userId - User ID
   * @param {string} action - Action
   */
  updateVaultStats(vaultName, userId, action) {
    const vault = this.dataVaults.get(vaultName);
    if (vault) {
      vault.accessCount++;
      vault.lastAccessed = new Date().toISOString();
    }
  }

  /**
   * Get vault size limit based on sensitivity
   * @param {Object} vault - Data vault
   * @returns {number} Size limit in bytes
   */
  getVaultSizeLimit(vault) {
    const limits = {
      'LOW': 100 * 1024 * 1024,      // 100MB
      'MEDIUM': 50 * 1024 * 1024,    // 50MB
      'HIGH': 10 * 1024 * 1024,      // 10MB
      'CRITICAL': 1 * 1024 * 1024    // 1MB
    };
    return limits[vault.sensitivity] || limits['MEDIUM'];
  }

  /**
   * Get maximum sessions for vault based on sensitivity
   * @param {Object} vault - Data vault
   * @returns {number} Maximum sessions
   */
  getMaxSessionsForVault(vault) {
    const limits = {
      'LOW': 10,
      'MEDIUM': 5,
      'HIGH': 3,
      'CRITICAL': 1
    };
    return limits[vault.sensitivity] || limits['MEDIUM'];
  }

  /**
   * Get access summary for user
   * @param {string} userId - User ID
   * @returns {Object} Access summary
   */
  getUserAccessSummary(userId) {
    const userLogs = this.accessLogs.filter(log => log.userId === userId);
    const recentLogs = userLogs.filter(log => {
      const logTime = new Date(log.timestamp);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return logTime > oneDayAgo;
    });

    const vaultsAccessed = [...new Set(recentLogs.map(log => log.vaultName))];
    const actionsPerformed = [...new Set(recentLogs.map(log => log.action))];
    const deniedAccess = recentLogs.filter(log => !log.allowed).length;

    return {
      userId,
      totalAccessAttempts: userLogs.length,
      recentAccessAttempts: recentLogs.length,
      vaultsAccessed,
      actionsPerformed,
      deniedAccessCount: deniedAccess,
      successRate: recentLogs.length > 0 ? (recentLogs.length - deniedAccess) / recentLogs.length : 0,
      lastAccess: userLogs.length > 0 ? userLogs[userLogs.length - 1].timestamp : null
    };
  }

  /**
   * Get vault access summary
   * @param {string} vaultName - Vault name
   * @returns {Object} Vault summary
   */
  getVaultAccessSummary(vaultName) {
    const vault = this.dataVaults.get(vaultName);
    if (!vault) return null;

    const vaultLogs = this.accessLogs.filter(log => log.vaultName === vaultName);
    const recentLogs = vaultLogs.filter(log => {
      const logTime = new Date(log.timestamp);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return logTime > oneDayAgo;
    });

    const uniqueUsers = [...new Set(recentLogs.map(log => log.userId))];
    const rolesUsed = [...new Set(recentLogs.map(log => log.userRole))];

    return {
      vaultName,
      sensitivity: vault.sensitivity,
      totalAccesses: vault.accessCount,
      recentAccesses: recentLogs.length,
      uniqueUsers: uniqueUsers.length,
      rolesUsed,
      activeSessions: vault.activeSessions.size,
      lastAccessed: vault.lastAccessed,
      encryptionRequired: vault.encryption
    };
  }

  /**
   * Revoke user access to vault
   * @param {string} userId - User ID
   * @param {string} vaultName - Vault name
   * @returns {boolean} Success status
   */
  revokeAccess(userId, vaultName) {
    const vault = this.dataVaults.get(vaultName);
    if (!vault) return false;

    // Close all active sessions for this user and vault
    for (const sessionId of vault.activeSessions) {
      const session = this.sessionManager.get(sessionId);
      if (session && session.userId === userId) {
        session.isActive = false;
        session.endedAt = new Date().toISOString();
        vault.activeSessions.delete(sessionId);
      }
    }

    console.log(`🚫 Access revoked for user ${userId} to vault ${vaultName}`);
    return true;
  }

  /**
   * Get all roles and their permissions
   * @returns {Array} Roles information
   */
  getAllRoles() {
    const roles = [];
    for (const [roleName, role] of this.roles) {
      roles.push({
        name: roleName,
        level: role.level,
        description: role.description,
        permissions: role.permissions,
        isActive: role.isActive,
        createdAt: role.createdAt
      });
    }
    return roles.sort((a, b) => b.level - a.level);
  }

  /**
   * Get all data vaults
   * @returns {Array} Data vaults information
   */
  getAllVaults() {
    const vaults = [];
    for (const [vaultName, vault] of this.dataVaults) {
      vaults.push({
        name: vaultName,
        description: vault.description,
        sensitivity: vault.sensitivity,
        encryption: vault.encryption,
        allowedRoles: vault.allowedRoles,
        restrictedRoles: vault.restrictedRoles,
        accessCount: vault.accessCount,
        activeSessions: vault.activeSessions.size,
        lastAccessed: vault.lastAccessed,
        createdAt: vault.createdAt
      });
    }
    return vaults;
  }
}

module.exports = RoleBasedAccessControl;
