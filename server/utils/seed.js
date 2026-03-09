/**
 * Seed Script — populates MongoDB with mock data matching the frontend mockData.ts
 * Run with: npm run seed
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Client = require('../models/Client');
const Debt = require('../models/Debt');
const Payment = require('../models/Payment');
const ActivityLog = require('../models/ActivityLog');

const connectDB = require('../config/db');

const seed = async () => {
  await connectDB();

  console.log('🗑  Clearing existing data...');
  await ActivityLog.deleteMany({});
  await Payment.deleteMany({});
  await Debt.deleteMany({});
  await Client.deleteMany({});
  await User.deleteMany({});

  // ── 1. Users ────────────────────────────────────────────────────────────
  console.log('👤 Seeding users...');

  const salt = await bcrypt.genSalt(10);

  const usersData = [
    { name: 'Ahmed Hassan',    email: 'admin@company.com',   role: 'super_admin', clientAccess: 'all' },
    { name: 'Sara Mohamed',    email: 'sara@company.com',    role: 'admin',       clientAccess: 'all' },
    { name: 'Omar Ali',        email: 'omar@company.com',    role: 'accounts',    clientAccess: 'all' },
    { name: 'Fatma Nour',      email: 'fatma@company.com',   role: 'collector',   clientAccess: [] }, // updated after clients
    { name: 'Youssef Karim',   email: 'youssef@company.com', role: 'viewer',      clientAccess: [] }, // updated after clients
  ];

  const plainPasswords = ['admin123', 'pass123', 'pass123', 'pass123', 'pass123'];

  const insertedUsers = [];
  for (let i = 0; i < usersData.length; i++) {
    // const hashedPassword = await bcrypt.hash(plainPasswords[i], salt);
    const user = await User.create({
      ...usersData[i],
      password: plainPasswords[i],
      createdAt: new Date('2024-01-01'),
    });
    insertedUsers.push(user);
  }

  const [u1, u2, u3, u4, u5] = insertedUsers;

  // ── 2. Clients ──────────────────────────────────────────────────────────
  console.log('🏢 Seeding clients...');

  const clientsData = [
    { name: 'Nile Trading Co.',    phone: '+20 100 123 4567', totalDebt: 15000, createdBy: u1._id, createdAt: new Date('2024-01-10') },
    { name: 'Delta Electronics',   phone: '+20 111 234 5678', totalDebt: 8500,  createdBy: u2._id, createdAt: new Date('2024-01-20') },
    { name: 'Pyramid Supplies',    phone: '+20 122 345 6789', totalDebt: 22000, createdBy: u1._id, createdAt: new Date('2024-02-05') },
    { name: 'Cairo Textiles',      phone: '+20 100 456 7890', totalDebt: 5200,  createdBy: u3._id, createdAt: new Date('2024-02-18') },
    { name: 'Alexandria Imports',  phone: '+20 111 567 8901', totalDebt: 31000, createdBy: u2._id, createdAt: new Date('2024-03-01') },
    { name: 'Red Sea Logistics',   phone: '+20 122 678 9012', totalDebt: 0,     createdBy: u1._id, createdAt: new Date('2024-03-10') },
  ];

  const insertedClients = await Client.insertMany(clientsData);
  const [c1, c2, c3, c4, c5, c6] = insertedClients;

  // Update Fatma and Youssef with their client access
  await User.findByIdAndUpdate(u4._id, { clientAccess: [c1._id, c2._id, c3._id] });
  await User.findByIdAndUpdate(u5._id, { clientAccess: [c1._id, c2._id] });

  // ── 3. Debts ─────────────────────────────────────────────────────────────
  console.log('💸 Seeding debts...');

  await Debt.insertMany([
    { clientId: c1._id, amount: 5000,  reason: 'Office supplies order',       addedBy: u3._id, date: new Date('2024-02-01') },
    { clientId: c1._id, amount: 10000, reason: 'Equipment purchase',           addedBy: u3._id, date: new Date('2024-02-15') },
    { clientId: c2._id, amount: 8500,  reason: 'Electronics inventory',        addedBy: u3._id, date: new Date('2024-02-10') },
    { clientId: c3._id, amount: 12000, reason: 'Bulk materials',               addedBy: u3._id, date: new Date('2024-02-20') },
    { clientId: c3._id, amount: 10000, reason: 'Monthly supply contract',      addedBy: u3._id, date: new Date('2024-03-01') },
    { clientId: c4._id, amount: 5200,  reason: 'Fabric order',                 addedBy: u3._id, date: new Date('2024-03-05') },
    { clientId: c5._id, amount: 31000, reason: 'Import shipment',              addedBy: u3._id, date: new Date('2024-03-10') },
  ]);

  // ── 4. Payments ───────────────────────────────────────────────────────────
  console.log('💰 Seeding payments...');

  await Payment.insertMany([
    { clientId: c1._id, amount: 3000, method: 'bank_transfer',   receivedBy: u4._id, date: new Date('2024-02-20') },
    { clientId: c2._id, amount: 2000, method: 'cash',            receivedBy: u4._id, date: new Date('2024-02-25') },
    { clientId: c3._id, amount: 5000, method: 'vodafone_cash',   receivedBy: u4._id, date: new Date('2024-03-05') },
    { clientId: c1._id, amount: 2000, method: 'instapay',        receivedBy: u4._id, date: new Date('2024-03-10') },
  ]);

  // ── 5. Activity Logs ──────────────────────────────────────────────────────
  console.log('📋 Seeding activity logs...');

  await ActivityLog.insertMany([
    { userId: u3._id, action: 'Added debt',       targetId: c1._id.toString(), amount: 5000,  date: new Date('2024-02-01') },
    { userId: u3._id, action: 'Added debt',       targetId: c1._id.toString(), amount: 10000, date: new Date('2024-02-15') },
    { userId: u4._id, action: 'Recorded payment', targetId: c1._id.toString(), amount: 3000,  date: new Date('2024-02-20') },
    { userId: u1._id, action: 'Created client',   targetId: c3._id.toString(),                date: new Date('2024-02-05') },
    { userId: u4._id, action: 'Recorded payment', targetId: c3._id.toString(), amount: 5000,  date: new Date('2024-03-05') },
    { userId: u2._id, action: 'Created user',     targetId: u5._id.toString(),                date: new Date('2024-03-01') },
  ]);

  console.log('\n✅ Database seeded successfully!');
  console.log('──────────────────────────────────────');
  console.log('Test credentials:');
  console.log('  super_admin → admin@company.com    / admin123');
  console.log('  admin       → sara@company.com     / pass123');
  console.log('  accounts    → omar@company.com     / pass123');
  console.log('  collector   → fatma@company.com    / pass123');
  console.log('  viewer      → youssef@company.com  / pass123');
  console.log('──────────────────────────────────────\n');

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
