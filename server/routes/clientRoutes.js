const express = require('express');
const router = express.Router();
const { getAllClients, createClient, updateClient, deleteClient } = require('../controllers/clientController');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');
const { validateCreateClient } = require('../middleware/validation');

router.use(protect);

// Any authenticated user can list clients (controller filters by clientAccess)
router.get('/', getAllClients);

// accounts+ can create and update clients
router.post('/', requireRole('accounts'), validateCreateClient, createClient);
router.patch('/:id', requireRole('accounts'), updateClient);

// admin+ can delete clients
router.delete('/:id', requireRole('admin'), deleteClient);

module.exports = router;
