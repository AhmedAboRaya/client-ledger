import { User, Client, Debt, Payment, ActivityLog } from '@/types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'Ahmed Hassan', email: 'admin@company.com', password: 'admin123', role: 'super_admin', clientAccess: 'all', createdAt: '2024-01-01' },
  { id: 'u2', name: 'Sara Mohamed', email: 'sara@company.com', password: 'pass123', role: 'admin', clientAccess: 'all', createdAt: '2024-01-15' },
  { id: 'u3', name: 'Omar Ali', email: 'omar@company.com', password: 'pass123', role: 'accounts', clientAccess: 'all', createdAt: '2024-02-01' },
  { id: 'u4', name: 'Fatma Nour', email: 'fatma@company.com', password: 'pass123', role: 'collector', clientAccess: ['c1', 'c2', 'c3'], createdAt: '2024-02-15' },
  { id: 'u5', name: 'Youssef Karim', email: 'youssef@company.com', password: 'pass123', role: 'viewer', clientAccess: ['c1', 'c2'], createdAt: '2024-03-01' },
];

export const mockClients: Client[] = [
  { id: 'c1', name: 'Nile Trading Co.', phone: '+20 100 123 4567', totalDebt: 15000, createdBy: 'u1', createdAt: '2024-01-10' },
  { id: 'c2', name: 'Delta Electronics', phone: '+20 111 234 5678', totalDebt: 8500, createdBy: 'u2', createdAt: '2024-01-20' },
  { id: 'c3', name: 'Pyramid Supplies', phone: '+20 122 345 6789', totalDebt: 22000, createdBy: 'u1', createdAt: '2024-02-05' },
  { id: 'c4', name: 'Cairo Textiles', phone: '+20 100 456 7890', totalDebt: 5200, createdBy: 'u3', createdAt: '2024-02-18' },
  { id: 'c5', name: 'Alexandria Imports', phone: '+20 111 567 8901', totalDebt: 31000, createdBy: 'u2', createdAt: '2024-03-01' },
  { id: 'c6', name: 'Red Sea Logistics', phone: '+20 122 678 9012', totalDebt: 0, createdBy: 'u1', createdAt: '2024-03-10' },
];

export const mockDebts: Debt[] = [
  { id: 'd1', clientId: 'c1', amount: 5000, reason: 'Office supplies order', addedBy: 'u3', date: '2024-02-01' },
  { id: 'd2', clientId: 'c1', amount: 10000, reason: 'Equipment purchase', addedBy: 'u3', date: '2024-02-15' },
  { id: 'd3', clientId: 'c2', amount: 8500, reason: 'Electronics inventory', addedBy: 'u3', date: '2024-02-10' },
  { id: 'd4', clientId: 'c3', amount: 12000, reason: 'Bulk materials', addedBy: 'u3', date: '2024-02-20' },
  { id: 'd5', clientId: 'c3', amount: 10000, reason: 'Monthly supply contract', addedBy: 'u3', date: '2024-03-01' },
  { id: 'd6', clientId: 'c4', amount: 5200, reason: 'Fabric order', addedBy: 'u3', date: '2024-03-05' },
  { id: 'd7', clientId: 'c5', amount: 31000, reason: 'Import shipment', addedBy: 'u3', date: '2024-03-10' },
];

export const mockPayments: Payment[] = [
  { id: 'p1', clientId: 'c1', amount: 3000, method: 'bank_transfer', receivedBy: 'u4', date: '2024-02-20' },
  { id: 'p2', clientId: 'c2', amount: 2000, method: 'cash', receivedBy: 'u4', date: '2024-02-25' },
  { id: 'p3', clientId: 'c3', amount: 5000, method: 'vodafone_cash', receivedBy: 'u4', date: '2024-03-05' },
  { id: 'p4', clientId: 'c1', amount: 2000, method: 'instapay', receivedBy: 'u4', date: '2024-03-10' },
];

export const mockActivityLogs: ActivityLog[] = [
  { id: 'a1', userId: 'u3', action: 'Added debt', targetId: 'c1', amount: 5000, date: '2024-02-01' },
  { id: 'a2', userId: 'u3', action: 'Added debt', targetId: 'c1', amount: 10000, date: '2024-02-15' },
  { id: 'a3', userId: 'u4', action: 'Recorded payment', targetId: 'c1', amount: 3000, date: '2024-02-20' },
  { id: 'a4', userId: 'u1', action: 'Created client', targetId: 'c3', date: '2024-02-05' },
  { id: 'a5', userId: 'u4', action: 'Recorded payment', targetId: 'c3', amount: 5000, date: '2024-03-05' },
  { id: 'a6', userId: 'u2', action: 'Created user', targetId: 'u5', date: '2024-03-01' },
];
