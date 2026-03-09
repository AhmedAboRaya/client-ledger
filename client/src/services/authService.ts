import api from '@/lib/api';
import { User } from '@/types';

interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

export const authService = {
  /**
   * Login with email & password.
   * Stores token and user in localStorage on success.
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  /**
   * Get currently authenticated user from the server.
   */
  async getMe(): Promise<User> {
    const { data } = await api.get<{ success: boolean; user: User }>('/auth/me');
    return data.user;
  },

  /**
   * Log out — clear local storage.
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Get token from local storage.
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  },

  /**
   * Get stored user from local storage.
   */
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },
};
