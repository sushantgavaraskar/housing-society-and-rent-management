// ✅ PATCHED: server.js with all routes
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitizeMiddleware = require('./middleware/mongoSanitizeMiddleware');
const xssMiddleware = require('./middleware/xssMiddleware');
const compression = require('compression');
const validateEnv = require('./utils/validateEnv');
const { morganLogger, logger } = require('./utils/logger');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const tenantRoutes = require('./routes/tenantRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const ownershipRequestRoutes = require('./routes/ownershipRequestRoutes');

dotenv.config();
validateEnv(); // Validate environment variables
connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// === Global Middleware ===
app.use(helmet());
app.use(mongoSanitizeMiddleware); // ✅ FIXED: Using custom MongoDB sanitization
app.use(xssMiddleware); // ✅ FIXED: Using custom XSS middleware
app.use(compression());
app.use(morganLogger); // ✅ Updated to use morganLogger
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // Increased for testing
  message: 'Too many requests from this IP, try again later.'
}));

app.use(express.json());
app.use(cookieParser());

// === Routes ===
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/tenant', tenantRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/ownership-requests', ownershipRequestRoutes); // ✅ Added

// Default Route
app.get('/', (req, res) => {
  res.send('Housing Society & Rent Management System API is running');
});

// API Documentation Route
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Housing Society Management API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      admin: '/api/admin',
      owner: '/api/owner',
      tenant: '/api/tenant',
      complaints: '/api/complaints',
      announcements: '/api/announcements',
      ownershipRequests: '/api/ownership-requests'
    },
    documentation: 'API endpoints are protected and require authentication'
  });
});

// Add this at the very end, after all other app.use and route definitions
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    data: null,
    statusCode: 404
  });
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  logger.info(`🌐 Local URL: http://localhost:${PORT}`);
  logger.info(`📚 API Documentation: http://localhost:${PORT}/api`);
});