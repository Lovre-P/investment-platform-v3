import { Investment, InvestmentStatus } from '../types';

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

// Helper function to handle fetch responses
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

export const getInvestments = async (filters?: { status?: InvestmentStatus, category?: string }): Promise<Investment[]> => {
  const queryParams = new URLSearchParams();
  if (filters?.status) queryParams.append('status', filters.status);
  if (filters?.category) queryParams.append('category', filters.category);
  
  const response = await fetch(`${API_BASE_URL}/investments?${queryParams.toString()}`);
  return handleResponse<Investment[]>(response);
};

export const getInvestmentById = async (id: string): Promise<Investment | undefined> => {
  const response = await fetch(`${API_BASE_URL}/investments/${id}`);
  if (response.status === 404) return undefined;
  return handleResponse<Investment>(response);
};

export interface CreateInvestmentData extends Omit<Investment, 'id' | 'submissionDate' | 'status' | 'amountRaised' | 'submittedBy' | 'submitterEmail'> {
  submittedBy: string;
  submitterEmail: string;
  title: string;
  description: string;
  longDescription: string;
  amountGoal: number;
  currency: string;
  images: string[];
  category: string;
  apyRange?: string;
  minInvestment?: number;
  term?: string;
  tags?: string[];
}

export const createInvestment = async (investmentData: CreateInvestmentData): Promise<Investment> => {
  const response = await fetch(`${API_BASE_URL}/investments`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(investmentData),
  });
  return handleResponse<Investment>(response);
};

export const updateInvestment = async (investmentId: string, updates: Partial<Investment>): Promise<Investment | null> => {
  const response = await fetch(`${API_BASE_URL}/investments/${investmentId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });
  return handleResponse<Investment>(response);
};

export const deleteInvestment = async (id: string): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/investments/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  // DELETE typically returns 204 No Content on success, or 200/202 with a body.
  // Adjust based on your backend's behavior.
  return response.ok; // Or check for specific status codes
};

export const approveInvestment = async (id: string): Promise<Investment | null> => {
  // This might be a specific endpoint or a general update
  return updateInvestment(id, { status: InvestmentStatus.OPEN });
  // Or:
  // const response = await fetch(`${API_BASE_URL}/investments/${id}/approve`, { method: 'POST' });
  // return handleResponse<Investment>(response);
};

export const rejectInvestment = async (id: string): Promise<Investment | null> => {
  // This might be a specific endpoint or a general update
  return updateInvestment(id, { status: InvestmentStatus.CLOSED }); // Or a specific "Rejected" status
  // Or:
  // const response = await fetch(`${API_BASE_URL}/investments/${id}/reject`, { method: 'POST' });
  // return handleResponse<Investment>(response);
};
