import { Lead } from '../types';

const API_BASE_URL = '/api'; // Replace with your actual API base URL

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export const getLeads = async (): Promise<Lead[]> => {
  const response = await fetch(`${API_BASE_URL}/leads`);
  return handleResponse<Lead[]>(response);
};

export const getLeadById = async (id: string): Promise<Lead | undefined> => {
  const response = await fetch(`${API_BASE_URL}/leads/${id}`);
  if (response.status === 404) return undefined;
  return handleResponse<Lead>(response);
};

export const createLead = async (leadData: Omit<Lead, 'id' | 'submissionDate' | 'status'>): Promise<Lead> => {
  const response = await fetch(`${API_BASE_URL}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leadData),
  });
  return handleResponse<Lead>(response);
};

export const updateLeadStatus = async (id: string, status: Lead['status']): Promise<Lead | null> => {
  const response = await fetch(`${API_BASE_URL}/leads/${id}/status`, { // Example endpoint
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return handleResponse<Lead>(response);
};
