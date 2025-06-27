import { User } from '../types'; // UserRole removed as it's not used directly here anymore

const API_BASE_URL = (typeof window !== 'undefined' && (window as any).VITE_API_URL)
  ? `${(window as any).VITE_API_URL}/api`
  : '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('megaInvestToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  // Handle backend response format {success: true, data: [...]}
  if (result.success && result.data !== undefined) {
    return result.data;
  }
  return result;
}

export const getUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    headers: getAuthHeaders()
  });
  return handleResponse<User[]>(response);
};

export const getUserById = async (id: string): Promise<User | undefined> => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    headers: getAuthHeaders()
  });
  if (response.status === 404) return undefined;
  return handleResponse<User>(response);
};

export const createUser = async (userData: Omit<User, 'id' | 'joinDate'>): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData), // Password should be hashed by the backend
  });
  return handleResponse<User>(response);
};

export const updateUser = async (userId: string, updates: Partial<Omit<User, 'id' | 'joinDate'>>): Promise<User | null> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates), // Backend should handle sensitive fields like password updates carefully
  });
  return handleResponse<User>(response);
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.ok;
};
