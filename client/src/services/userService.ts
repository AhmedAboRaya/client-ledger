import api from '@/lib/api';
import { User, UserRole } from '@/types';

interface UsersResponse {
  success: boolean;
  count: number;
  data: User[];
}

interface UserResponse {
  success: boolean;
  data: User;
}

export const userService = {
  /** GET /api/users — list all users (admin+) */
  async getAll(): Promise<User[]> {
    const { data } = await api.get<UsersResponse>('/users');
    return data.data;
  },

  /** POST /api/users — create a new user (admin+) */
  async create(payload: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    clientAccess?: 'all' | string[];
  }): Promise<User> {
    const { data } = await api.post<UserResponse>('/users', payload);
    return data.data;
  },

  /** PATCH /api/users/:id — update role or clientAccess (admin+) */
  async update(
    id: string,
    payload: Partial<{ name: string; email: string; role: UserRole; clientAccess: 'all' | string[] }>
  ): Promise<User> {
    const { data } = await api.patch<UserResponse>(`/users/${id}`, payload);
    return data.data;
  },

  /** DELETE /api/users/:id — delete a user (admin+) */
  async remove(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};
