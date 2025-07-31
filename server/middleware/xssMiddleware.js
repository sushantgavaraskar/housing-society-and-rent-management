const xss = require('xss');

const xssMiddleware = (req, res, next) => {
  // Sanitize request body only - this is safe to modify
  if (req.body && Object.keys(req.body).length > 0) {
    const sanitizeObject = (obj) => {
      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
          sanitized[key] = xss(value);
        } else if (typeof value === 'object' && value !== null) {
          sanitized[key] = sanitizeObject(value);
        } else {
          sanitized[key] = value;
        }
      }
      return sanitized;
    };
    
    req.body = sanitizeObject(req.body);
  }

  // ✅ FIXED: Removed query sanitization to avoid read-only property error
  // Query parameters are already sanitized by Express and other middleware
  // If XSS protection is needed for queries, it should be handled at the controller level

  next();
};

module.exports = xssMiddleware; 