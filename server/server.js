/**
 * server.js
 *
 * Main Express backend for Client Ledger
 * Ready for Vercel deployment
 */

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging in development
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

// Serve favicon
app.get('/favicon.ico', (req, res) => res.sendFile(path.join(__dirname, 'favicon.png')));

// Root route
app.get('/', (req, res) => {
  res.send('🚀 Client Ledger API is running. Use /api/* endpoints.');
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Client Ledger API is running' });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});