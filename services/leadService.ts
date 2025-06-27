import { Lead } from '../types';

// Use backend service URL in production, proxy in development
const API_BASE_URL = import.meta.env.PROD
  ? 'https://mega-invest-backend-production.up.railway.app/api'
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

export const getLeads = async (): Promise<Lead[]> => {
  const response = await fetch(`${API_BASE_URL}/leads`, {
    headers: getAuthHeaders()
  });
  return handleResponse<Lead[]>(response);
};

export const getLeadById = async (id: string): Promise<Lead | undefined> => {
  const response = await fetch(`${API_BASE_URL}/leads/${id}`, {
    headers: getAuthHeaders()
  });
  if (response.status === 404) return undefined;
  return handleResponse<Lead>(response);
};

export const createLead = async (leadData: Omit<Lead, 'id' | 'submissionDate' | 'status'>): Promise<Lead> => {
  const response = await fetch(`${API_BASE_URL}/leads`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(leadData),
  });
  return handleResponse<Lead>(response);
};

export const updateLeadStatus = async (id: string, status: Lead['status']): Promise<Lead | null> => {
  const response = await fetch(`${API_BASE_URL}/leads/${id}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  return handleResponse<Lead>(response);
};
