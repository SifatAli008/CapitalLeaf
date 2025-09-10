const Joi = require('joi');

/**
 * Validation middleware factory
 * @param {Object} schema - Joi schema
 * @param {String} property - Request property to validate ('body', 'query', 'params')
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorDetails
      });
    }

    req[property] = value;
    next();
  };
};

// Registration validation schema
const registrationSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.alphanum': 'Username must contain only alphanumeric characters',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username cannot exceed 30 characters',
      'any.required': 'Username is required'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'))
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
      'any.required': 'Password is required'
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Password confirmation is required'
    }),
  firstName: Joi.string()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.min': 'First name is required',
      'string.max': 'First name cannot exceed 50 characters',
      'any.required': 'First name is required'
    }),
  lastName: Joi.string()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.min': 'Last name is required',
      'string.max': 'Last name cannot exceed 50 characters',
      'any.required': 'Last name is required'
    })
});

// Login validation schema
const loginSchema = Joi.object({
  username: Joi.string()
    .required()
    .messages({
      'any.required': 'Username is required'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    }),
  userContext: Joi.object({
    userId: Joi.string(),
    timestamp: Joi.string(),
    deviceFingerprint: Joi.string(),
    deviceInfo: Joi.object(),
    isMobile: Joi.boolean(),
    isEmulator: Joi.boolean(),
    browserInfo: Joi.object(),
    screenInfo: Joi.object()
  }).optional()
});

// MFA verification schema
const mfaSchema = Joi.object({
  username: Joi.string()
    .required()
    .messages({
      'any.required': 'Username is required'
    }),
  code: Joi.string()
    .length(6)
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.length': 'Verification code must be 6 digits',
      'string.pattern.base': 'Verification code must contain only numbers',
      'any.required': 'Verification code is required'
    })
});

// Device registration schema
const deviceRegistrationSchema = Joi.object({
  sessionId: Joi.string()
    .required()
    .messages({
      'any.required': 'Session ID is required'
    }),
  deviceName: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.min': 'Device name is required',
      'string.max': 'Device name cannot exceed 100 characters',
      'any.required': 'Device name is required'
    }),
  deviceInfo: Joi.object({
    fingerprint: Joi.string(),
    name: Joi.string()
  }).optional()
});

// Risk assessment schema
const riskAssessmentSchema = Joi.object({
  userContext: Joi.object({
    userId: Joi.string(),
    timestamp: Joi.string(),
    deviceFingerprint: Joi.string(),
    deviceInfo: Joi.object(),
    isMobile: Joi.boolean(),
    isEmulator: Joi.boolean(),
    browserInfo: Joi.object(),
    screenInfo: Joi.object()
  }).optional(),
  transactionContext: Joi.object({
    amount: Joi.number(),
    currency: Joi.string(),
    type: Joi.string(),
    location: Joi.object(),
    timestamp: Joi.string()
  }).optional()
});

module.exports = {
  validate,
  registrationSchema,
  loginSchema,
  mfaSchema,
  deviceRegistrationSchema,
  riskAssessmentSchema
};
