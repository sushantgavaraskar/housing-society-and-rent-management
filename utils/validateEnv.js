// utils/validateEnv.js
const required = [
    'PORT', 'MONGO_URI', 'JWT_SECRET', 'EMAIL_USER', 'EMAIL_PASS', 'CLIENT_URL'
  ];
  
  module.exports = function validateEnv() {
    required.forEach(key => {
      if (!process.env[key]) {
        throw new Error(`❌ Missing required environment variable: ${key}`);
      }
    });
  };
  