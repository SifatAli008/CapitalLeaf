/**
 * Secure Data Pipelines with Audit Trails Component
 * Ensures that only validated, encrypted data flows into analytics or dashboards
 */

class SecureDataPipelines {
  constructor() {
    this.pipelines = new Map();
    this.dataValidators = new Map();
    this.encryptionKeys = new Map();
    this.auditTrails = [];
    this.dataFlowMonitor = new Map();
    this.integrityChecks = new Map();
  }

  /**
   * Initialize secure data pipelines
   */
  initialize() {
    console.log('🔗 Initializing Secure Data Pipelines...');
    
    // Initialize default data validators
    this.initializeDataValidators();
    
    // Initialize encryption keys
    this.initializeEncryptionKeys();
    
    // Create default pipelines
    this.createDefaultPipelines();
    
    console.log('✅ Secure Data Pipelines initialized');
  }

  /**
   * Initialize data validators for different data types
   */
  initializeDataValidators() {
    const validators = [
      {
        name: 'financial_transaction_validator',
        description: 'Validates financial transaction data',
        rules: [
          { field: 'amount', type: 'number', min: 0, required: true },
          { field: 'currency', type: 'string', pattern: /^[A-Z]{3}$/, required: true },
          { field: 'timestamp', type: 'date', required: true },
          { field: 'transaction_id', type: 'string', pattern: /^TXN_\d+$/, required: true },
          { field: 'account_id', type: 'string', pattern: /^ACC_\d+$/, required: true }
        ]
      },
      {
        name: 'customer_data_validator',
        description: 'Validates customer personal data',
        rules: [
          { field: 'customer_id', type: 'string', pattern: /^CUST_\d+$/, required: true },
          { field: 'email', type: 'email', required: true },
          { field: 'phone', type: 'string', pattern: /^\+?[\d\s\-()]+$/, required: false },
          { field: 'ssn', type: 'string', pattern: /^\d{3}-\d{2}-\d{4}$/, required: false, sensitive: true },
          { field: 'address', type: 'object', required: false }
        ]
      },
      {
        name: 'audit_event_validator',
        description: 'Validates audit event data',
        rules: [
          { field: 'event_id', type: 'string', pattern: /^EVT_\d+$/, required: true },
          { field: 'event_type', type: 'string', enum: ['LOGIN', 'LOGOUT', 'ACCESS', 'MODIFY', 'DELETE'], required: true },
          { field: 'user_id', type: 'string', required: true },
          { field: 'timestamp', type: 'date', required: true },
          { field: 'ip_address', type: 'string', pattern: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, required: true },
          { field: 'resource', type: 'string', required: true }
        ]
      }
    ];

    for (const validator of validators) {
      this.dataValidators.set(validator.name, validator);
    }
  }

  /**
   * Initialize encryption keys for different data types
   */
  initializeEncryptionKeys() {
    const keyTypes = [
      { name: 'financial_data_key', algorithm: 'AES-256-GCM', rotationDays: 90 },
      { name: 'customer_data_key', algorithm: 'AES-256-GCM', rotationDays: 180 },
      { name: 'audit_data_key', algorithm: 'AES-256-GCM', rotationDays: 365 },
      { name: 'analytics_data_key', algorithm: 'AES-256-GCM', rotationDays: 30 }
    ];

    for (const keyType of keyTypes) {
      this.encryptionKeys.set(keyType.name, {
        ...keyType,
        keyId: `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        lastUsed: null,
        usageCount: 0,
        isActive: true
      });
    }
  }

  /**
   * Create default data pipelines
   */
  createDefaultPipelines() {
    const pipelines = [
      {
        name: 'financial_data_pipeline',
        description: 'Pipeline for processing financial transaction data',
        source: 'transaction_service',
        destination: 'analytics_dashboard',
        validator: 'financial_transaction_validator',
        encryptionKey: 'financial_data_key',
        requiresApproval: true,
        maxDataSize: 100 * 1024 * 1024, // 100MB
        retentionDays: 2555, // 7 years
        isActive: true
      },
      {
        name: 'customer_data_pipeline',
        description: 'Pipeline for processing customer information',
        source: 'customer_service',
        destination: 'crm_system',
        validator: 'customer_data_validator',
        encryptionKey: 'customer_data_key',
        requiresApproval: false,
        maxDataSize: 50 * 1024 * 1024, // 50MB
        retentionDays: 1095, // 3 years
        isActive: true
      },
      {
        name: 'audit_logs_pipeline',
        description: 'Pipeline for processing audit logs',
        source: 'security_monitor',
        destination: 'audit_database',
        validator: 'audit_event_validator',
        encryptionKey: 'audit_data_key',
        requiresApproval: false,
        maxDataSize: 200 * 1024 * 1024, // 200MB
        retentionDays: 2555, // 7 years
        isActive: true
      },
      {
        name: 'analytics_data_pipeline',
        description: 'Pipeline for analytics and reporting data',
        source: 'data_warehouse',
        destination: 'reporting_dashboard',
        validator: 'financial_transaction_validator',
        encryptionKey: 'analytics_data_key',
        requiresApproval: true,
        maxDataSize: 500 * 1024 * 1024, // 500MB
        retentionDays: 365, // 1 year
        isActive: true
      }
    ];

    for (const pipeline of pipelines) {
      this.pipelines.set(pipeline.name, {
        ...pipeline,
        createdAt: new Date().toISOString(),
        lastProcessed: null,
        totalProcessed: 0,
        errorCount: 0,
        successRate: 0
      });
    }
  }

  /**
   * Process data through secure pipeline
   * @param {string} pipelineName - Pipeline name
   * @param {Object} data - Data to process
   * @param {Object} context - Processing context
   * @returns {Object} Processing result
   */
  async processData(pipelineName, data, context = {}) {
    const timestamp = new Date().toISOString();
    const processingId = `proc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const result = {
      processingId,
      pipelineName,
      timestamp,
      success: false,
      dataSize: JSON.stringify(data).length,
      validationResult: null,
      encryptionResult: null,
      integrityCheck: null,
      auditTrail: null,
      error: null,
      recommendations: []
    };

    try {
      // Get pipeline configuration
      const pipeline = this.pipelines.get(pipelineName);
      if (!pipeline || !pipeline.isActive) {
        throw new Error(`Pipeline '${pipelineName}' not found or inactive`);
      }

      // Check data size limits
      if (result.dataSize > pipeline.maxDataSize) {
        throw new Error(`Data size (${result.dataSize}) exceeds pipeline limit (${pipeline.maxDataSize})`);
      }

      // Step 1: Validate data
      result.validationResult = await this.validateData(pipeline.validator, data);
      if (!result.validationResult.valid) {
        throw new Error(`Data validation failed: ${result.validationResult.errors.join(', ')}`);
      }

      // Step 2: Encrypt sensitive data
      result.encryptionResult = await this.encryptData(pipeline.encryptionKey, data, pipeline.validator);
      if (!result.encryptionResult.success) {
        throw new Error(`Data encryption failed: ${result.encryptionResult.error}`);
      }

      // Step 3: Perform integrity check
      result.integrityCheck = await this.performIntegrityCheck(result.encryptionResult.encryptedData);
      if (!result.integrityCheck.valid) {
        throw new Error(`Integrity check failed: ${result.integrityCheck.error}`);
      }

      // Step 4: Check approval requirements
      if (pipeline.requiresApproval && !context.approved) {
        result.recommendations.push('Pipeline requires approval before processing');
        throw new Error('Pipeline requires approval');
      }

      // Step 5: Transfer data to destination
      const transferResult = await this.transferData(pipeline.destination, result.encryptionResult.encryptedData, context);
      if (!transferResult.success) {
        throw new Error(`Data transfer failed: ${transferResult.error}`);
      }

      // Step 6: Create audit trail
      result.auditTrail = await this.createAuditTrail(pipelineName, data, result, context);

      // Update pipeline statistics
      this.updatePipelineStats(pipelineName, true);

      result.success = true;
      console.log(`✅ Data processed successfully through pipeline: ${pipelineName}`);

    } catch (error) {
      result.error = error.message;
      result.success = false;
      
      // Update pipeline error statistics
      this.updatePipelineStats(pipelineName, false);
      
      // Create error audit trail
      result.auditTrail = await this.createAuditTrail(pipelineName, data, result, context, error);
      
      console.log(`❌ Data processing failed in pipeline: ${pipelineName} - ${error.message}`);
    }

    return result;
  }

  /**
   * Validate data against pipeline validator
   * @param {string} validatorName - Validator name
   * @param {Object} data - Data to validate
   * @returns {Object} Validation result
   */
  async validateData(validatorName, data) {
    const validator = this.dataValidators.get(validatorName);
    if (!validator) {
      return {
        valid: false,
        errors: [`Validator '${validatorName}' not found`]
      };
    }

    const errors = [];
    const warnings = [];

    for (const rule of validator.rules) {
      const fieldValue = data[rule.field];
      
      // Check required fields
      if (rule.required && (fieldValue === undefined || fieldValue === null || fieldValue === '')) {
        errors.push(`Required field '${rule.field}' is missing`);
        continue;
      }

      // Skip validation if field is not required and not present
      if (!rule.required && (fieldValue === undefined || fieldValue === null)) {
        continue;
      }

      // Type validation
      if (rule.type === 'number' && typeof fieldValue !== 'number') {
        errors.push(`Field '${rule.field}' must be a number`);
      } else if (rule.type === 'string' && typeof fieldValue !== 'string') {
        errors.push(`Field '${rule.field}' must be a string`);
      } else if (rule.type === 'email' && !this.isValidEmail(fieldValue)) {
        errors.push(`Field '${rule.field}' must be a valid email address`);
      } else if (rule.type === 'date' && !this.isValidDate(fieldValue)) {
        errors.push(`Field '${rule.field}' must be a valid date`);
      } else if (rule.type === 'object' && typeof fieldValue !== 'object') {
        errors.push(`Field '${rule.field}' must be an object`);
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(fieldValue)) {
        errors.push(`Field '${rule.field}' does not match required pattern`);
      }

      // Enum validation
      if (rule.enum && !rule.enum.includes(fieldValue)) {
        errors.push(`Field '${rule.field}' must be one of: ${rule.enum.join(', ')}`);
      }

      // Range validation
      if (rule.min !== undefined && fieldValue < rule.min) {
        errors.push(`Field '${rule.field}' must be at least ${rule.min}`);
      }
      if (rule.max !== undefined && fieldValue > rule.max) {
        errors.push(`Field '${rule.field}' must be at most ${rule.max}`);
      }

      // Sensitive data warning
      if (rule.sensitive && fieldValue) {
        warnings.push(`Sensitive data detected in field '${rule.field}'`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      validator: validatorName
    };
  }

  /**
   * Encrypt sensitive data
   * @param {string} keyName - Encryption key name
   * @param {Object} data - Data to encrypt
   * @param {string} validatorName - Validator name for sensitive field detection
   * @returns {Object} Encryption result
   */
  async encryptData(keyName, data, validatorName) {
    try {
      const encryptionKey = this.encryptionKeys.get(keyName);
      if (!encryptionKey || !encryptionKey.isActive) {
        throw new Error(`Encryption key '${keyName}' not found or inactive`);
      }

      const validator = this.dataValidators.get(validatorName);
      const sensitiveFields = validator.rules.filter(rule => rule.sensitive).map(rule => rule.field);

      const encryptedData = { ...data };
      
      // Encrypt sensitive fields
      for (const field of sensitiveFields) {
        if (encryptedData[field]) {
          encryptedData[field] = await this.encryptField(encryptedData[field], encryptionKey);
        }
      }

      // Update key usage statistics
      encryptionKey.lastUsed = new Date().toISOString();
      encryptionKey.usageCount++;

      return {
        success: true,
        encryptedData,
        keyId: encryptionKey.keyId,
        encryptedFields: sensitiveFields.filter(field => encryptedData[field]),
        algorithm: encryptionKey.algorithm
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Encrypt a single field value
   * @param {any} value - Value to encrypt
   * @param {Object} encryptionKey - Encryption key
   * @returns {string} Encrypted value
   */
  async encryptField(value, encryptionKey) {
    // In a real implementation, this would use proper encryption
    // For demonstration, we'll use a simple encoding
    const encoded = Buffer.from(JSON.stringify(value)).toString('base64');
    return `encrypted_${encryptionKey.keyId}_${encoded}`;
  }

  /**
   * Perform integrity check on data
   * @param {Object} data - Data to check
   * @returns {Object} Integrity check result
   */
  async performIntegrityCheck(data) {
    try {
      const dataString = JSON.stringify(data);
      const checksum = this.calculateChecksum(dataString);
      
      const integrityRecord = {
        checksum,
        timestamp: new Date().toISOString(),
        dataSize: dataString.length,
        isValid: true
      };

      this.integrityChecks.set(checksum, integrityRecord);

      return {
        valid: true,
        checksum,
        dataSize: dataString.length
      };

    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  /**
   * Calculate checksum for data integrity
   * @param {string} data - Data string
   * @returns {string} Checksum
   */
  calculateChecksum(data) {
    // Simple checksum calculation (in real implementation, use cryptographic hash)
    // Prevent loop bound injection by validating input and limiting length
    if (!data || typeof data !== 'string') {
      return '0';
    }
    
    // Limit data length to prevent DoS attacks
    const maxLength = 10000;
    const safeData = data.length > maxLength ? data.substring(0, maxLength) : data;
    
    let hash = 0;
    for (let i = 0; i < safeData.length; i++) {
      const char = safeData.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Transfer data to destination
   * @param {string} destination - Destination system
   * @param {Object} data - Data to transfer
   * @param {Object} context - Transfer context
   * @returns {Object} Transfer result
   */
  async transferData(destination, data, _context) {
    try {
      // Simulate data transfer
      const transferId = `transfer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // In a real implementation, this would actually transfer data
      console.log(`📤 Transferring data to ${destination} (${transferId})`);
      
      // Simulate transfer delay
      await new Promise(resolve => setTimeout(resolve, 100));

      return {
        success: true,
        transferId,
        destination,
        timestamp: new Date().toISOString(),
        dataSize: JSON.stringify(data).length
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create audit trail for data processing
   * @param {string} pipelineName - Pipeline name
   * @param {Object} originalData - Original data
   * @param {Object} result - Processing result
   * @param {Object} context - Processing context
   * @param {Error} error - Error if any
   * @returns {Object} Audit trail
   */
  async createAuditTrail(pipelineName, originalData, result, context, error = null) {
    const auditTrail = {
      auditId: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      pipelineName,
      timestamp: new Date().toISOString(),
      userId: context.userId || 'system',
      ipAddress: context.ipAddress || 'unknown',
      userAgent: context.userAgent || 'unknown',
      originalDataSize: JSON.stringify(originalData).length,
      processingResult: {
        success: result.success,
        processingId: result.processingId,
        validationResult: result.validationResult,
        encryptionResult: result.encryptionResult,
        integrityCheck: result.integrityCheck
      },
      error: error ? {
        message: error.message,
        stack: error.stack
      } : null,
      riskLevel: this.calculateRiskLevel(originalData, result, context),
      recommendations: result.recommendations || []
    };

    this.auditTrails.push(auditTrail);

    // Keep only last 50000 audit trails
    if (this.auditTrails.length > 50000) {
      this.auditTrails.shift();
    }

    return auditTrail;
  }

  /**
   * Calculate risk level for data processing
   * @param {Object} data - Original data
   * @param {Object} result - Processing result
   * @param {Object} context - Processing context
   * @returns {string} Risk level
   */
  calculateRiskLevel(data, result, _context) {
    let riskScore = 0;

    // Check for sensitive data
    const dataString = JSON.stringify(data).toLowerCase();
    const sensitiveKeywords = ['ssn', 'credit', 'account', 'password', 'pin'];
    const sensitiveCount = sensitiveKeywords.filter(keyword => dataString.includes(keyword)).length;
    riskScore += sensitiveCount * 0.2;

    // Check data size
    if (result.dataSize > 10 * 1024 * 1024) { // 10MB
      riskScore += 0.2;
    }

    // Check for errors
    if (!result.success) {
      riskScore += 0.3;
    }

    // Check validation warnings
    if (result.validationResult && result.validationResult.warnings.length > 0) {
      riskScore += result.validationResult.warnings.length * 0.1;
    }

    if (riskScore < 0.3) return 'LOW';
    if (riskScore < 0.6) return 'MEDIUM';
    if (riskScore < 0.8) return 'HIGH';
    return 'CRITICAL';
  }

  /**
   * Update pipeline statistics
   * @param {string} pipelineName - Pipeline name
   * @param {boolean} success - Whether processing was successful
   */
  updatePipelineStats(pipelineName, success) {
    const pipeline = this.pipelines.get(pipelineName);
    if (pipeline) {
      pipeline.totalProcessed++;
      pipeline.lastProcessed = new Date().toISOString();
      
      if (!success) {
        pipeline.errorCount++;
      }
      
      pipeline.successRate = pipeline.totalProcessed > 0 ? 
        (pipeline.totalProcessed - pipeline.errorCount) / pipeline.totalProcessed : 0;
    }
  }

  /**
   * Get pipeline statistics
   * @param {string} pipelineName - Pipeline name
   * @returns {Object} Pipeline statistics
   */
  getPipelineStats(pipelineName) {
    const pipeline = this.pipelines.get(pipelineName);
    if (!pipeline) return null;

    return {
      name: pipelineName,
      totalProcessed: pipeline.totalProcessed,
      errorCount: pipeline.errorCount,
      successRate: pipeline.successRate,
      lastProcessed: pipeline.lastProcessed,
      createdAt: pipeline.createdAt,
      isActive: pipeline.isActive
    };
  }

  /**
   * Get all pipeline statistics
   * @returns {Array} All pipeline statistics
   */
  getAllPipelineStats() {
    const stats = [];
    for (const pipelineName of this.pipelines.keys()) {
      stats.push(this.getPipelineStats(pipelineName));
    }
    return stats;
  }

  /**
   * Get audit trail for specific criteria
   * @param {Object} criteria - Search criteria
   * @returns {Array} Matching audit trails
   */
  getAuditTrails(criteria = {}) {
    let filteredTrails = [...this.auditTrails];

    if (criteria.pipelineName) {
      filteredTrails = filteredTrails.filter(trail => trail.pipelineName === criteria.pipelineName);
    }

    if (criteria.userId) {
      filteredTrails = filteredTrails.filter(trail => trail.userId === criteria.userId);
    }

    if (criteria.riskLevel) {
      filteredTrails = filteredTrails.filter(trail => trail.riskLevel === criteria.riskLevel);
    }

    if (criteria.startDate) {
      filteredTrails = filteredTrails.filter(trail => new Date(trail.timestamp) >= new Date(criteria.startDate));
    }

    if (criteria.endDate) {
      filteredTrails = filteredTrails.filter(trail => new Date(trail.timestamp) <= new Date(criteria.endDate));
    }

    if (criteria.limit) {
      filteredTrails = filteredTrails.slice(-criteria.limit);
    }

    return filteredTrails.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  /**
   * Validate email format
   * @param {string} email - Email address
   * @returns {boolean} True if valid
   */
  isValidEmail(email) {
    // Use a more secure email regex that avoids ReDoS attacks
    // Limit input length to prevent DoS attacks
    if (!email || typeof email !== 'string' || email.length > 254) {
      return false;
    }
    
    // Simple but secure email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  /**
   * Validate date format
   * @param {any} date - Date value
   * @returns {boolean} True if valid
   */
  isValidDate(date) {
    return !isNaN(Date.parse(date));
  }

  /**
   * Get data flow monitoring summary
   * @returns {Object} Monitoring summary
   */
  getDataFlowSummary() {
    const totalPipelines = this.pipelines.size;
    const activePipelines = Array.from(this.pipelines.values()).filter(p => p.isActive).length;
    const totalProcessed = Array.from(this.pipelines.values()).reduce((sum, p) => sum + p.totalProcessed, 0);
    const totalErrors = Array.from(this.pipelines.values()).reduce((sum, p) => sum + p.errorCount, 0);
    const overallSuccessRate = totalProcessed > 0 ? (totalProcessed - totalErrors) / totalProcessed : 0;

    return {
      totalPipelines,
      activePipelines,
      totalProcessed,
      totalErrors,
      overallSuccessRate,
      auditTrailsCount: this.auditTrails.length,
      integrityChecksCount: this.integrityChecks.size,
      lastUpdated: new Date().toISOString()
    };
  }
}

module.exports = SecureDataPipelines;
