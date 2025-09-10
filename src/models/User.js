const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'viewer'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  deviceFingerprints: [{
    fingerprint: String,
    deviceName: String,
    isTrusted: {
      type: Boolean,
      default: false
    },
    lastUsed: {
      type: Date,
      default: Date.now
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    deviceType: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet', 'unknown'],
      default: 'unknown'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  maxDevices: {
    type: Number,
    default: 2
  },
  activeSessions: [{
    sessionId: String,
    deviceFingerprint: String,
    deviceName: String,
    loginTime: {
      type: Date,
      default: Date.now
    },
    lastActivity: {
      type: Date,
      default: Date.now
    },
    ipAddress: String,
    userAgent: String,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  mfaEnabled: {
    type: Boolean,
    default: false
  },
  mfaSecret: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better performance
userSchema.index({ createdAt: -1 });

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to update updatedAt
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Instance method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Instance method to update last login
userSchema.methods.updateLastLogin = function() {
  return this.updateOne({
    $set: { lastLogin: Date.now() },
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Instance method to add device fingerprint with device limit enforcement
userSchema.methods.addDeviceFingerprint = function(fingerprint, deviceName, deviceType = 'unknown', isTrusted = false) {
  const existingDevice = this.deviceFingerprints.find(device => device.fingerprint === fingerprint);
  
  if (existingDevice) {
    existingDevice.lastUsed = Date.now();
    existingDevice.isTrusted = isTrusted || existingDevice.isTrusted;
    existingDevice.deviceName = deviceName;
    existingDevice.deviceType = deviceType;
    existingDevice.isActive = true;
  } else {
    // Check device limit
    const activeDevices = this.deviceFingerprints.filter(device => device.isActive);
    if (activeDevices.length >= this.maxDevices) {
      throw new Error(`Device limit exceeded. Maximum ${this.maxDevices} devices allowed.`);
    }
    
    this.deviceFingerprints.push({
      fingerprint,
      deviceName,
      deviceType,
      isTrusted,
      lastUsed: Date.now(),
      registeredAt: Date.now(),
      isActive: true
    });
  }
  
  return this.save();
};

// Instance method to remove device
userSchema.methods.removeDevice = function(fingerprint) {
  const deviceIndex = this.deviceFingerprints.findIndex(device => device.fingerprint === fingerprint);
  if (deviceIndex !== -1) {
    this.deviceFingerprints[deviceIndex].isActive = false;
    // Also remove any active sessions for this device
    this.activeSessions = this.activeSessions.filter(session => session.deviceFingerprint !== fingerprint);
  }
  return this.save();
};

// Instance method to get active devices
userSchema.methods.getActiveDevices = function() {
  return this.deviceFingerprints.filter(device => device.isActive);
};

// Instance method to check if device is registered and active
userSchema.methods.isDeviceRegistered = function(fingerprint) {
  const device = this.deviceFingerprints.find(device => 
    device.fingerprint === fingerprint && device.isActive
  );
  return !!device;
};

// Instance method to add active session
userSchema.methods.addActiveSession = function(sessionData) {
  const { sessionId, deviceFingerprint, deviceName, ipAddress, userAgent } = sessionData;
  
  // Remove any existing session for this device
  this.activeSessions = this.activeSessions.filter(session => session.deviceFingerprint !== deviceFingerprint);
  
  // Check if we're at the device limit and this is a new device
  if (!this.isDeviceRegistered(deviceFingerprint)) {
    const activeDevices = this.getActiveDevices();
    if (activeDevices.length >= this.maxDevices) {
      throw new Error(`Device limit exceeded. Maximum ${this.maxDevices} devices allowed.`);
    }
  }
  
  this.activeSessions.push({
    sessionId,
    deviceFingerprint,
    deviceName,
    loginTime: Date.now(),
    lastActivity: Date.now(),
    ipAddress,
    userAgent,
    isActive: true
  });
  
  return this.save();
};

// Instance method to remove active session
userSchema.methods.removeActiveSession = function(sessionId) {
  this.activeSessions = this.activeSessions.filter(session => session.sessionId !== sessionId);
  return this.save();
};

// Instance method to update session activity
userSchema.methods.updateSessionActivity = function(sessionId) {
  const session = this.activeSessions.find(s => s.sessionId === sessionId);
  if (session) {
    session.lastActivity = Date.now();
  }
  return this.save();
};

// Instance method to get active sessions count
userSchema.methods.getActiveSessionsCount = function() {
  return this.activeSessions.filter(session => session.isActive).length;
};

// Instance method to check if user can login (device limit check)
userSchema.methods.canLogin = function(deviceFingerprint) {
  // If device is already registered and active, allow login
  if (this.isDeviceRegistered(deviceFingerprint)) {
    return { canLogin: true, reason: 'Device is registered' };
  }
  
  // Check if we can register a new device
  const activeDevices = this.getActiveDevices();
  if (activeDevices.length < this.maxDevices) {
    return { canLogin: true, reason: 'Can register new device' };
  }
  
  return { 
    canLogin: false, 
    reason: `Device limit exceeded. Maximum ${this.maxDevices} devices allowed.`,
    activeDevices: activeDevices.length
  };
};

// Static method to find user by username or email
userSchema.statics.findByLogin = function(login) {
  return this.findOne({
    $or: [
      { username: login },
      { email: login }
    ]
  });
};

// Transform JSON output to remove sensitive data
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.mfaSecret;
  delete userObject.__v;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
