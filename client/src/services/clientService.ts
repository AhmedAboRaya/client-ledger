import api from '@/lib/api';
import { Client } from '@/types';

interface ClientsResponse {
  success: boolean;
  count: number;
  data: Client[];
}

interface ClientResponse {
  success: boolean;
  data: Client;
}

export const clientService = {
  /** GET /api/clients — list clients (filtered by user's clientAccess on server) */
  async getAll(): Promise<Client[]> {
    const { data } = await api.get<ClientsResponse>('/clients');
    return data.data;
  },

  /** POST /api/clients — create a new client (accounts+) */
  async create(payload: { name: string; phone: string }): Promise<Client> {
    const { data } = await api.post<ClientResponse>('/clients', payload);
    return data.data;
  },

  /** PATCH /api/clients/:id — update client (accounts+) */
  async update(id: string, payload: Partial<{ name: string; phone: string }>): Promise<Client> {
    const { data } = await api.patch<ClientResponse>(`/clients/${id}`, payload);
    return data.data;
  },

  /** DELETE /api/clients/:id — delete client (admin+) */
  async remove(id: string): Promise<void> {
    await api.delete(`/clients/${id}`);
  },
};
