export type UserRole = 'super_admin' | 'admin' | 'accounts' | 'collector' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  clientAccess: 'all' | string[];
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  totalDebt: number;
  createdBy: string;
  createdAt: string;
}

export interface Debt {
  id: string;
  clientId: string;
  amount: number;
  reason: string;
  addedBy: string;
  date: string;
}

export interface Payment {
  id: string;
  clientId: string;
  amount: number;
  method: 'cash' | 'vodafone_cash' | 'instapay' | 'bank_transfer';
  receivedBy: string;
  date: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  targetId: string;
  amount?: number;
  date: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  accounts: 'Accounts',
  collector: 'Collector',
  viewer: 'Viewer',
};

export const PAYMENT_METHOD_LABELS: Record<Payment['method'], string> = {
  cash: 'Cash',
  vodafone_cash: 'Vodafone Cash',
  instapay: 'InstaPay',
  bank_transfer: 'Bank Transfer',
};

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: ['manage_users', 'manage_clients', 'add_debt', 'add_payment', 'view_all', 'create_admin'],
  admin: ['manage_users', 'manage_clients', 'add_debt', 'add_payment', 'view_all'],
  accounts: ['add_debt', 'view_clients'],
  collector: ['add_payment', 'view_clients'],
  viewer: ['view_clients'],
};
