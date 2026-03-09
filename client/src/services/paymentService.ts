import api from '@/lib/api';
import { Payment } from '@/types';

interface PaymentsResponse {
  success: boolean;
  count: number;
  data: Payment[];
}

interface PaymentResponse {
  success: boolean;
  data: Payment;
}

export const paymentService = {
  /** GET /api/payments/:clientId — get all payments for a client */
  async getByClient(clientId: string): Promise<Payment[]> {
    const { data } = await api.get<PaymentsResponse>(`/payments/${clientId}`);
    return data.data;
  },

  /** POST /api/payments — record a payment (collector+) */
  async record(payload: {
    clientId: string;
    amount: number;
    method: Payment['method'];
  }): Promise<Payment> {
    const { data } = await api.post<PaymentResponse>('/payments', payload);
    return data.data;
  },
};
