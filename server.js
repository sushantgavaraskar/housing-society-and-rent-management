const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const societyRoutes = require('./routes/societyRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const requestRoutes = require('./routes/requestRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.use('/api/properties', propertyRoutes);

app.use('/api/societies', societyRoutes);

app.use('/api/maintenance', maintenanceRoutes);

app.use('/api/requests', requestRoutes);

app.use('/api/payments', paymentRoutes);

app.use('/api/dashboard', dashboardRoutes);