import api from '@/lib/api';
import { ActivityLog } from '@/types';

interface LogsResponse {
  success: boolean;
  count: number;
  data: ActivityLog[];
}

export const logService = {
  /** GET /api/logs — get all activity logs (admin+) */
  async getAll(): Promise<ActivityLog[]> {
    const { data } = await api.get<LogsResponse>('/logs');
    return data.data;
  },
};
