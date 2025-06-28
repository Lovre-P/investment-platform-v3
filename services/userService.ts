import { User } from '../types';
import { apiClient } from '../utils/apiClient';

export const getUsers = async (): Promise<User[]> => {
  return apiClient.get<User[]>('/users');
};

export const getUserById = async (id: string): Promise<User | undefined> => {
  try {
    return await apiClient.get<User>(`/users/${id}`);
  } catch (error: any) {
    if (error.status === 404) return undefined;
    throw error;
  }
};

export const createUser = async (userData: Omit<User, 'id' | 'joinDate'>): Promise<User> => {
  return apiClient.post<User>('/users', userData);
};

export const updateUser = async (userId: string, updates: Partial<Omit<User, 'id' | 'joinDate'>>): Promise<User | null> => {
  return apiClient.put<User>(`/users/${userId}`, updates);
};

export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    await apiClient.delete<void>(`/users/${id}`);
    return true;
  } catch (error) {
    throw error;
  }
};
