const Debt = require('../models/Debt');
const Client = require('../models/Client');
const ActivityLog = require('../models/ActivityLog');

// @desc   Add a debt for a client
// @route  POST /api/debts
// @access Private (accounts+)
const addDebt = async (req, res, next) => {
  try {
    const { clientId, amount, reason } = req.body;

    // Verify client exists
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    // Create the debt
    const debt = await Debt.create({
      clientId,
      amount,
      reason,
      addedBy: req.user._id,
      date: new Date(),
    });

    // Update client's totalDebt
    client.totalDebt += amount;
    await client.save();

    // Log the action
    await ActivityLog.create({
      userId: req.user._id,
      action: 'Added debt',
      targetId: clientId,
      amount,
      date: new Date(),
    });

    res.status(201).json({ success: true, data: debt });
  } catch (error) {
    next(error);
  }
};

// @desc   Get all debts for a client
// @route  GET /api/debts/:clientId
// @access Private (all authenticated)
const getClientDebts = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.clientId);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    const debts = await Debt.find({ clientId: req.params.clientId })
      .populate('addedBy', 'name email')
      .sort({ date: -1 });

    res.status(200).json({ success: true, count: debts.length, data: debts });
  } catch (error) {
    next(error);
  }
};

module.exports = { addDebt, getClientDebts };
