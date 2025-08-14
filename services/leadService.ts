import { Lead } from '../types';
import { apiClient } from '../utils/apiClient';

export const getLeads = async (): Promise<Lead[]> => {
  return apiClient.get<Lead[]>('/leads');
};

export const getLeadById = async (id: string): Promise<Lead | undefined> => {
  try {
    return await apiClient.get<Lead>(`/leads/${id}`);
  } catch (error: any) {
    if (error.status === 404) return undefined;
    throw error;
  }
};

export const createLead = async (leadData: Omit<Lead, 'id' | 'submissionDate' | 'status'>): Promise<Lead> => {
  return apiClient.post<Lead>('/leads', leadData);
};

export const updateLeadStatus = async (id: string, status: Lead['status']): Promise<Lead | null> => {
  return apiClient.put<Lead>(`/leads/${id}/status`, { status });
};


export const bulkDeleteLeads = async (ids: string[]): Promise<{ deletedCount: number }> => {
  return apiClient.post<{ deletedCount: number }>(`/leads/bulk-delete`, { ids });
};
