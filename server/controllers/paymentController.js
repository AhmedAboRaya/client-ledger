/**
 * paymentController.js
 * 
 * Contains the business logic for recording and retrieving client payments.
 * It enforces business rules, such as preventing payments that exceed a client's
 * outstanding debt, updates the corresponding Client's totalDebt tally, and auto-generates
 * an ActivityLog entry for every recorded transaction to ensure auditability.
 */
const Payment = require('../models/Payment');
const Client = require('../models/Client');
const ActivityLog = require('../models/ActivityLog');

// @desc   Record a payment for a client
// @route  POST /api/payments
// @access Private (collector+)
const addPayment = async (req, res, next) => {
  try {
    const { clientId, amount, method } = req.body;

    // Verify client exists
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    if (client.totalDebt <= 0) {
      return res.status(400).json({ success: false, message: 'Client has no outstanding debt' });
    }

    if (amount > client.totalDebt) {
      return res.status(400).json({ 
        success: false, 
        message: `Payment amount (${amount}) cannot exceed current debt (${client.totalDebt})` 
      });
    }

    // Create payment record
    const payment = await Payment.create({
      clientId,
      amount,
      method,
      receivedBy: req.user._id,
      date: new Date(),
    });

    // Decrease client's totalDebt (never below 0)
    client.totalDebt = Math.max(0, client.totalDebt - amount);
    await client.save();

    // Log the action
    await ActivityLog.create({
      userId: req.user._id,
      action: 'Recorded payment',
      targetId: clientId,
      amount,
      date: new Date(),
    });

    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

// @desc   Get all payments for a client
// @route  GET /api/payments/:clientId
// @access Private (all authenticated)
const getClientPayments = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.clientId);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    const payments = await Payment.find({ clientId: req.params.clientId })
      .populate('receivedBy', 'name email')
      .sort({ date: -1 });

    res.status(200).json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    next(error);
  }
};

module.exports = { addPayment, getClientPayments };
