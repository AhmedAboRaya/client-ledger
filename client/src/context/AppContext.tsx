/**
 * AppContext.tsx
 * 
 * Central State Management Hub for the frontend.
 * 
 * This context provider acts as the bridge between the UI and the backend API using TanStack React Query.
 * It fetches the global state (`users`, `clients`, `activityLogs`) automatically when a user logs in,
 * handles token management, and exposes strongly-typed async functions (`addClient`, `addDebt`, etc.) 
 * to UI components for mutating data and cleanly invalidating the cache.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Client, Debt, Payment, ActivityLog, UserRole, ROLE_PERMISSIONS } from '@/types';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';
import { clientService } from '@/services/clientService';
import { logService } from '@/services/logService';
import { debtService } from '@/services/debtService';
import { paymentService } from '@/services/paymentService';
import { toast } from 'sonner';

interface AppContextType {
  // Auth
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;

  // Data
  users: User[];
  clients: Client[];
  activityLogs: ActivityLog[];
  isLoadingGlobalData: boolean;

  // Actions
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'createdBy' | 'totalDebt'>) => Promise<void>;
  addDebt: (debt: Omit<Debt, 'id' | 'date' | 'addedBy'>) => Promise<void>;
  addPayment: (payment: Omit<Payment, 'id' | 'date' | 'receivedBy'>) => Promise<void>;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;

  // Helpers
  getClientById: (id: string) => Client | undefined;
  getUserById: (id: string) => User | undefined;
  getAccessibleClients: () => Client[];
  getClientDebts: (clientId: string) => Promise<Debt[]>;
  getClientPayments: (clientId: string) => Promise<Payment[]>;
}

const AppContext = createContext<AppContextType | null>(null);

// Helper to normalize _id to id from API responses
const normalizeId = <T extends any>(obj: T): T => {
  if (!obj) return obj;
  if (Array.isArray(obj)) return obj.map(normalizeId) as any;
  if (typeof obj === 'object') {
    const newObj = { ...obj };
    if ('_id' in newObj) {
      (newObj as any).id = newObj._id;
    }
    return newObj;
  }
  return obj;
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const user = authService.getStoredUser();
    return normalizeId(user);
  });

  // Global Data Fetching via React Query
  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: async () => normalizeId(await userService.getAll()),
    enabled: !!currentUser && ROLE_PERMISSIONS[currentUser.role]?.includes('manage_users'),
  });

  const { data: clients = [], isLoading: loadingClients } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => normalizeId(await clientService.getAll()),
    enabled: !!currentUser,
  });

  const { data: activityLogs = [], isLoading: loadingLogs } = useQuery({
    queryKey: ['activityLogs'],
    queryFn: async () => normalizeId(await logService.getAll()),
    enabled: !!currentUser,
  });

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const { success, user } = await authService.login(email, password);
      if (success && user) {
        const normalizedUser = normalizeId(user);
        setCurrentUser(normalizedUser);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        queryClient.invalidateQueries();
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }, [queryClient]);

  const logout = useCallback(() => {
    authService.logout();
    setCurrentUser(null);
    queryClient.clear();
  }, [queryClient]);

  const hasPermission = useCallback((permission: string): boolean => {
    if (!currentUser) return false;
    return ROLE_PERMISSIONS[currentUser.role]?.includes(permission) ?? false;
  }, [currentUser]);

  // Mutations
  const addClientMutation = useMutation({
    mutationFn: (data: Omit<Client, 'id' | 'createdAt' | 'createdBy' | 'totalDebt'>) => clientService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to add client');
      throw err;
    }
  });

  const addDebtMutation = useMutation({
    mutationFn: (data: Omit<Debt, 'id' | 'date' | 'addedBy'>) => debtService.add(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['debts', variables.clientId] });
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to add debt');
      throw err;
    }
  });

  const addPaymentMutation = useMutation({
    mutationFn: (data: Omit<Payment, 'id' | 'date' | 'receivedBy'>) => paymentService.record(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['payments', variables.clientId] });
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to record payment');
      throw err;
    }
  });

  const addUserMutation = useMutation({
    mutationFn: (data: Omit<User, 'id' | 'createdAt'>) => userService.create(data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to add user');
      throw err;
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => userService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete user');
      throw err;
    }
  });

  const addClient = useCallback(async (data: Omit<Client, 'id' | 'createdAt' | 'createdBy' | 'totalDebt'>) => {
    await addClientMutation.mutateAsync(data);
  }, [addClientMutation]);

  const addDebt = useCallback(async (data: Omit<Debt, 'id' | 'date' | 'addedBy'>) => {
    await addDebtMutation.mutateAsync(data);
  }, [addDebtMutation]);

  const addPayment = useCallback(async (data: Omit<Payment, 'id' | 'date' | 'receivedBy'>) => {
    await addPaymentMutation.mutateAsync(data);
  }, [addPaymentMutation]);

  const addUser = useCallback(async (data: Omit<User, 'id' | 'createdAt'>) => {
    await addUserMutation.mutateAsync(data);
  }, [addUserMutation]);

  const deleteUser = useCallback(async (userId: string) => {
    await deleteUserMutation.mutateAsync(userId);
  }, [deleteUserMutation]);

  const getClientById = useCallback((id: string) => clients.find(c => c.id === id), [clients]);
  const getUserById = useCallback((id: string) => users.find(u => u.id === id), [users]);

  const getAccessibleClients = useCallback(() => {
    return clients;
  }, [clients]);

  const getClientDebts = useCallback(async (clientId: string) => {
    return normalizeId(await debtService.getByClient(clientId));
  }, []);

  const getClientPayments = useCallback(async (clientId: string) => {
    return normalizeId(await paymentService.getByClient(clientId));
  }, []);

  const isLoadingGlobalData = loadingUsers || loadingClients || loadingLogs;

  useEffect(() => {
    if (currentUser) {
      authService.getMe().then(user => {
        const normalizedUser = normalizeId(user);
        setCurrentUser(normalizedUser);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
      }).catch((e) => {
        console.error('Failed to verify session', e);
        logout();
      });
    }
  }, []);

  return (
    <AppContext.Provider value={{
      currentUser, login, logout, hasPermission,
      users, clients, activityLogs, isLoadingGlobalData,
      addClient, addDebt, addPayment, addUser, deleteUser,
      getClientById, getUserById, getAccessibleClients, getClientDebts, getClientPayments,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
