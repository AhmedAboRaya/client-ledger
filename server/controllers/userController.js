const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

// @desc   Get all users
// @route  GET /api/users
// @access Private (admin+)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc   Create a new user
// @route  POST /api/users
// @access Private (admin+)
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, clientAccess } = req.body;

    // super_admin can only be created by super_admin
    if (role === 'super_admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only a super_admin can create another super_admin',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'viewer',
      clientAccess: clientAccess || 'all',
    });

    // Log the action
    await ActivityLog.create({
      userId: req.user._id,
      action: 'Created user',
      targetId: user._id.toString(),
      date: new Date(),
    });

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc   Update user role or clientAccess
// @route  PATCH /api/users/:id
// @access Private (admin+)
const updateUser = async (req, res, next) => {
  try {
    const { role, clientAccess, name, email } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent non-super_admin from modifying super_admin accounts
    if (user.role === 'super_admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot modify a super_admin account',
      });
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (role !== undefined) user.role = role;
    if (clientAccess !== undefined) user.clientAccess = clientAccess;

    await user.save();

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete a user
// @route  DELETE /api/users/:id
// @access Private (admin+)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
    }

    // Prevent non-super_admin from deleting super_admin
    if (user.role === 'super_admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Cannot delete a super_admin' });
    }

    await user.deleteOne();

    // Log the action
    await ActivityLog.create({
      userId: req.user._id,
      action: 'Deleted user',
      targetId: req.params.id,
      date: new Date(),
    });

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, createUser, updateUser, deleteUser };
