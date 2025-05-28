import { User } from '../types'; // UserRole removed as it's not used directly here anymore

const API_BASE_URL = '/api'; // Replace with your actual API base URL

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export const getUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_BASE_URL}/users`);
  return handleResponse<User[]>(response);
};

export const getUserById = async (id: string): Promise<User | undefined> => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`);
  if (response.status === 404) return undefined;
  return handleResponse<User>(response);
};

export const createUser = async (userData: Omit<User, 'id' | 'joinDate'>): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData), // Password should be hashed by the backend
  });
  return handleResponse<User>(response);
};

export const updateUser = async (userId: string, updates: Partial<Omit<User, 'id' | 'joinDate'>>): Promise<User | null> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates), // Backend should handle sensitive fields like password updates carefully
  });
  return handleResponse<User>(response);
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.ok;
};
