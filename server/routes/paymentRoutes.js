const express = require('express');
const router = express.Router();
const { addPayment, getClientPayments } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');
const { validateAddPayment } = require('../middleware/validation');

router.use(protect);

// collector+ can record payments
router.post('/', requireRole('collector'), validateAddPayment, addPayment);

// Any authenticated user can view payments for a client
router.get('/:clientId', getClientPayments);

module.exports = router;
