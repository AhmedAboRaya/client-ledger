const Client = require('../models/Client');
const ActivityLog = require('../models/ActivityLog');

// @desc   Get all clients (filtered by user's clientAccess)
// @route  GET /api/clients
// @access Private (all authenticated)
const getAllClients = async (req, res, next) => {
  try {
    let clients;

    if (req.user.clientAccess === 'all') {
      clients = await Client.find().populate('createdBy', 'name email').sort({ createdAt: -1 });
    } else {
      // clientAccess is an array of ObjectId references
      const accessList = req.user.clientAccess;
      clients = await Client.find({ _id: { $in: accessList } })
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });
    }

    res.status(200).json({ success: true, count: clients.length, data: clients });
  } catch (error) {
    next(error);
  }
};

// @desc   Create a new client
// @route  POST /api/clients
// @access Private (accounts+)
const createClient = async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    const client = await Client.create({
      name,
      phone,
      totalDebt: 0,
      createdBy: req.user._id,
    });

    // Log the action
    await ActivityLog.create({
      userId: req.user._id,
      action: 'Created client',
      targetId: client._id.toString(),
      date: new Date(),
    });

    res.status(201).json({ success: true, data: client });
  } catch (error) {
    next(error);
  }
};

// @desc   Update a client
// @route  PATCH /api/clients/:id
// @access Private (accounts+)
const updateClient = async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    if (name !== undefined) client.name = name;
    if (phone !== undefined) client.phone = phone;

    await client.save();

    res.status(200).json({ success: true, data: client });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete a client
// @route  DELETE /api/clients/:id
// @access Private (admin+)
const deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    await client.deleteOne();

    res.status(200).json({ success: true, message: 'Client deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllClients, createClient, updateClient, deleteClient };
