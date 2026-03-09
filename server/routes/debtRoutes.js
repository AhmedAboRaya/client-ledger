const express = require('express');
const router = express.Router();
const { addDebt, getClientDebts } = require('../controllers/debtController');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');
const { validateAddDebt } = require('../middleware/validation');

router.use(protect);

// accounts+ can add debts
router.post('/', requireRole('accounts'), validateAddDebt, addDebt);

// Any authenticated user can view debts for a client
router.get('/:clientId', getClientDebts);

module.exports = router;
