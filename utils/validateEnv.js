// utils/validateEnv.js
const required = [
    'PORT', 'MONGO_URI', 'JWT_SECRET', 'EMAIL_USER', 'EMAIL_PASS', 'CLIENT_URL'
  ];
  
  const optional = [
    'JWT_EXPIRES_IN', 'NODE_ENV'
  ];
  
  module.exports = function validateEnv() {
    required.forEach(key => {
      if (!process.env[key]) {
        throw new Error(`❌ Missing required environment variable: ${key}`);
      }
    });
    
    // Set defaults for optional variables
    if (!process.env.JWT_EXPIRES_IN) {
      process.env.JWT_EXPIRES_IN = '7d';
    }
    
    if (!process.env.NODE_ENV) {
      process.env.NODE_ENV = 'development';
    }
  };
  