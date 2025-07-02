import { Investment, InvestmentStatus } from '../types';
import { apiClient } from '../utils/apiClient';

export const getInvestments = async (filters?: { status?: InvestmentStatus, category?: string }): Promise<Investment[]> => {
  const queryParams = new URLSearchParams();
  if (filters?.status) queryParams.append('status', filters.status);
  if (filters?.category) queryParams.append('category', filters.category);

  const endpoint = queryParams.toString() ? `/investments?${queryParams.toString()}` : '/investments';
  return apiClient.get<Investment[]>(endpoint);
};

export const getInvestmentById = async (id: string): Promise<Investment | undefined> => {
  try {
    return await apiClient.get<Investment>(`/investments/${id}`);
  } catch (error: any) {
    if (error.status === 404) return undefined;
    throw error;
  }
};

export interface CreateInvestmentData extends Omit<Investment, 'id' | 'submissionDate' | 'status' | 'amountRaised'> {
  submittedBy: string;
  submitterEmail: string;
  imageFiles?: FileList | File[] | null;
}

export const createInvestment = async (investmentData: CreateInvestmentData): Promise<Investment> => {
  const formData = new FormData();
  Object.entries(investmentData).forEach(([key, value]) => {
    if (key === 'imageFiles' || value === undefined || value === null) return;
    if (key === 'tags' && Array.isArray(value)) {
      formData.append('tags', value.join(','));
    } else {
      formData.append(key, String(value));
    }
  });

  if (investmentData.imageFiles) {
    Array.from(investmentData.imageFiles).forEach(file => {
      formData.append('images', file);
    });
  }

  return apiClient.post<Investment>('/investments', formData);
};

export const updateInvestment = async (
  investmentId: string,
  updates: Partial<Investment> & { imageFiles?: FileList | File[] | null }
): Promise<Investment | null> => {
  const formData = new FormData();
  Object.entries(updates).forEach(([key, value]) => {
    if (key === 'imageFiles' || value === undefined || value === null) return;
    if (key === 'tags' && Array.isArray(value)) {
      formData.append('tags', value.join(','));
    } else {
      formData.append(key, String(value));
    }
  });

  if (updates.imageFiles) {
    Array.from(updates.imageFiles).forEach(file => {
      formData.append('images', file);
    });
  }

  return apiClient.put<Investment>(`/investments/${investmentId}`, formData);
};

export const deleteInvestment = async (id: string): Promise<boolean> => {
  try {
    await apiClient.delete<void>(`/investments/${id}`);
    return true;
  } catch (error) {
    throw error;
  }
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
