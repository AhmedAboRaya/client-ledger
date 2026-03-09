const express = require('express');
const router = express.Router();
const { getLogs } = require('../controllers/logController');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');

router.use(protect);

// Anyone can view logs, but the controller will filter them
router.get('/', requireRole('viewer'), getLogs);

module.exports = router;
