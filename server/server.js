/**
 * server.js
 * 
 * The main entry point for the Express backend REST API.
 * This file dynamically loads environment variables, establishes the MongoDB connection,
 * configures global middleware (such as CORS, Morgan logging, and JSON parsing),
 * mounts all API routers, and defines the global error handling fallback.
 */
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/debts', require('./routes/debtRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/logs', require('./routes/logRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Client Ledger API is running' });
});

// Global error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
