/**
 * server.js
 * 
 * Main Express backend for Client Ledger
 * Ready for Vercel deployment with proper CORS
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

// CORS configuration
const allowedOrigins = [
  'http://localhost:8080',
  'https://client-ledger-abo-raya.vercel.app',
  'https://client-ledger-abo-raya-git-main-ahmed-aborayas-projects.vercel.app',
  'https://client-ledger-abo-raya-lpnz5o0oh-ahmed-aborayas-projects.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS policy: The origin ${origin} is not allowed.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // if you use cookies/auth headers
}));

// Middleware
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