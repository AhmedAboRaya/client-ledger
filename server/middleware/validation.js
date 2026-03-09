const { body, validationResult } = require('express-validator');

// Returns 400 with validation errors if any exist
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// ── Auth ───────────────────────────────────────────────────────────────────
const validateLogin = [
  body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

// ── Users ──────────────────────────────────────────────────────────────────
const validateCreateUser = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .isIn(['super_admin', 'admin', 'accounts', 'collector', 'viewer'])
    .withMessage('Invalid role'),
  validate,
];

// ── Clients ────────────────────────────────────────────────────────────────
const validateCreateClient = [
  body('name').trim().notEmpty().withMessage('Client name is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  validate,
];

// ── Debts ──────────────────────────────────────────────────────────────────
const validateAddDebt = [
  body('clientId').notEmpty().withMessage('Client ID is required'),
  body('amount')
    .isNumeric()
    .withMessage('Amount must be a number')
    .isFloat({ min: 1 })
    .withMessage('Amount must be at least 1'),
  body('reason').trim().notEmpty().withMessage('Reason is required'),
  validate,
];

// ── Payments ───────────────────────────────────────────────────────────────
const validateAddPayment = [
  body('clientId').notEmpty().withMessage('Client ID is required'),
  body('amount')
    .isNumeric()
    .withMessage('Amount must be a number')
    .isFloat({ min: 1 })
    .withMessage('Amount must be at least 1'),
  body('method')
    .isIn(['cash', 'bank_transfer', 'vodafone_cash', 'instapay'])
    .withMessage('Invalid payment method'),
  validate,
];

module.exports = {
  validateLogin,
  validateCreateUser,
  validateCreateClient,
  validateAddDebt,
  validateAddPayment,
};
