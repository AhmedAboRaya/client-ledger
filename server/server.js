/**
 * server.js
 * Main Express backend for Client Ledger
 */

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();

/* ---------------- CORS CONFIG ---------------- */

const allowedOrigins = [
  'http://localhost:8080',
  'https://client-ledger-abo-raya.vercel.app',
  'https://client-ledger-abo-raya-git-main-ahmed-aborayas-projects.vercel.app',
  'https://client-ledger-abo-raya-lpnz5o0oh-ahmed-aborayas-projects.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // IMPORTANT for preflight

/* ------------------------------------------------ */

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/* ---------------- ROUTES ---------------- */

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/debts', require('./routes/debtRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/logs', require('./routes/logRoutes'));

/* ---------------------------------------- */

app.get('/', (req, res) => {
  res.send('Client Ledger API running');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/favicon.ico', (req, res) =>
  res.sendFile(path.join(__dirname, 'favicon.png'))
);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});