const express = require('express');
const router = express.Router();
const { getAllUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');
const { validateCreateUser } = require('../middleware/validation');

// All user routes require authentication + admin or above
router.use(protect);
router.use(requireRole('admin'));

router.get('/', getAllUsers);
router.post('/', validateCreateUser, createUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
