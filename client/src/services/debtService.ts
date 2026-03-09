import api from '@/lib/api';
import { Debt } from '@/types';

interface DebtsResponse {
  success: boolean;
  count: number;
  data: Debt[];
}

interface DebtResponse {
  success: boolean;
  data: Debt;
}

export const debtService = {
  /** GET /api/debts/:clientId — get all debts for a client */
  async getByClient(clientId: string): Promise<Debt[]> {
    const { data } = await api.get<DebtsResponse>(`/debts/${clientId}`);
    return data.data;
  },

  /** POST /api/debts — add a debt (accounts+) */
  async add(payload: { clientId: string; amount: number; reason: string }): Promise<Debt> {
    const { data } = await api.post<DebtResponse>('/debts', payload);
    return data.data;
  },
};
