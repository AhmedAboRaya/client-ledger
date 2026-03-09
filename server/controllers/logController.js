const ActivityLog = require('../models/ActivityLog');

// @desc   Get all activity logs
// @route  GET /api/logs
// @access Private (admin+)
const getLogs = async (req, res, next) => {
  try {
    let filter = {};

    if (req.user.role !== 'super_admin' && req.user.role !== 'admin') {
      if (req.user.clientAccess !== 'all') {
        const accessibleClientIds = Array.isArray(req.user.clientAccess) 
          ? req.user.clientAccess.map(id => id.toString()) 
          : [];
        filter = {
          $or: [
            { targetId: { $in: accessibleClientIds } }, // Activity on clients they can access
            { userId: req.user._id } // Their own activity
          ]
        };
      }
    }

    const logs = await ActivityLog.find(filter)
      .populate('userId', 'name email role')
      .sort({ date: -1 });

    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    next(error);
  }
};

module.exports = { getLogs };
