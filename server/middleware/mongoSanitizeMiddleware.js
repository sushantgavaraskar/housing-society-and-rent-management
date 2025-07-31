// Custom MongoDB sanitization middleware to replace express-mongo-sanitize
const mongoSanitizeMiddleware = (req, res, next) => {
  // Sanitize request body to prevent NoSQL injection
  if (req.body) {
    const sanitizeObject = (obj) => {
      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        // Remove MongoDB operators from keys
        const sanitizedKey = key.replace(/[$]/g, '');
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          sanitized[sanitizedKey] = sanitizeObject(value);
        } else {
          sanitized[sanitizedKey] = value;
        }
      }
      return sanitized;
    };
    
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query parameters
  if (req.query) {
    const sanitizeQuery = (query) => {
      const sanitized = {};
      for (const [key, value] of Object.entries(query)) {
        // Remove MongoDB operators from keys
        const sanitizedKey = key.replace(/[$]/g, '');
        sanitized[sanitizedKey] = value;
      }
      return sanitized;
    };
    
    // Create a new query object instead of modifying the existing one
    req.sanitizedQuery = sanitizeQuery(req.query);
  }

  next();
};

module.exports = mongoSanitizeMiddleware; 