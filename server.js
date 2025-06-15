// ✅ PATCHED: server.js with all routes
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
// const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean');
const compression = require('compression');
const validateEnv = require('./utils/validateEnv');
const logger = require('./utils/logger');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

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

// === Global Middleware ===
app.use(helmet());
// app.use(xss());
// app.use(mongoSanitize());
app.use(compression());
app.use(logger); // ✅ Added logger middleware
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, try again later.'
}));

app.use(express.json());
app.use(cookieParser());

// ✅ CORS for dev/prod
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

// === Routes ===
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/tenant', tenantRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/announcements', announcementRoutes); // ✅ Added
app.use('/api/ownership-requests', ownershipRequestRoutes); // ✅ Added

// Default Route
app.get('/', (req, res) => {
  res.send('Housing Society & Rent Management System API is running');
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});