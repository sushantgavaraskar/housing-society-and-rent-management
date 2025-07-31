// utils/validateEnv.js
const required = [
  'PORT', 'MONGO_URI', 'JWT_SECRET'
];

const productionRequired = [
  'EMAIL_USER', 'EMAIL_PASS', 'CLIENT_URL'
];

const optional = [
  'JWT_EXPIRES_IN', 'NODE_ENV'
];

module.exports = function validateEnv() {
  // Check required variables
  required.forEach(key => {
    if (!process.env[key]) {
      throw new Error(`❌ Missing required environment variable: ${key}`);
    }
  });

  // ✅ IMPROVED: Only require email credentials in production
  if (process.env.NODE_ENV === 'production') {
    productionRequired.forEach(key => {
      if (!process.env[key]) {
        throw new Error(`❌ Missing required environment variable for production: ${key}`);
      }
    });
  }
  
  // Set defaults for optional variables
  if (!process.env.JWT_EXPIRES_IN) {
    process.env.JWT_EXPIRES_IN = '7d';
  }
  
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
  }

  // ✅ ADDED: Warn about missing optional variables in development
  if (process.env.NODE_ENV === 'development') {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️  EMAIL credentials not set - email functionality will be disabled');
    }
    if (!process.env.CLIENT_URL) {
      console.warn('⚠️  CLIENT_URL not set - CORS might need adjustment');
    }
  }
};
  