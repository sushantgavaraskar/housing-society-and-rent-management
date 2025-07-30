// utils/logger.js
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Morgan middleware for HTTP request logging
const morganLogger = morgan(':method :url :status :res[content-length] - :response-time ms');

// File-based logger for application logs
class Logger {
  constructor() {
    this.logFile = path.join(logsDir, 'app.log');
  }

  info(message, data = null) {
    const logEntry = {
      level: 'INFO',
      timestamp: new Date().toISOString(),
      message,
      data
    };
    this.writeLog(logEntry);
  }

  error(message, error = null) {
    const logEntry = {
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      message,
      error: error ? error.stack : null
    };
    this.writeLog(logEntry);
  }

  warn(message, data = null) {
    const logEntry = {
      level: 'WARN',
      timestamp: new Date().toISOString(),
      message,
      data
    };
    this.writeLog(logEntry);
  }

  debug(message, data = null) {
    if (process.env.NODE_ENV === 'development') {
      const logEntry = {
        level: 'DEBUG',
        timestamp: new Date().toISOString(),
        message,
        data
      };
      this.writeLog(logEntry);
    }
  }

  writeLog(logEntry) {
    const logString = JSON.stringify(logEntry) + '\n';
    fs.appendFileSync(this.logFile, logString);
    
    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${logEntry.level}] ${logEntry.message}`);
    }
  }
}

const logger = new Logger();

module.exports = { morganLogger, logger };
