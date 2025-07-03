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
  return apiClient.post<Investment>('/investments', investmentData);
};

export const createInvestmentWithFiles = async (
  investmentData: Omit<CreateInvestmentData, 'images'>,
  imageFiles: FileList
): Promise<Investment> => {
  const formData = new FormData();

  Object.entries(investmentData).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => formData.append(key, String(v)));
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  Array.from(imageFiles).forEach(file => {
    formData.append('images', file);
  });

  return apiClient.post<Investment>('/investments', formData);
};

export const updateInvestment = async (investmentId: string, updates: Partial<Investment>): Promise<Investment | null> => {
  return apiClient.put<Investment>(`/investments/${investmentId}`, updates);
};

export const updateInvestmentWithFiles = async (
  investmentId: string,
  investmentData: Partial<Omit<Investment, 'id' | 'images'>>,
  imageFiles: FileList
): Promise<Investment> => {
  const formData = new FormData();

  // Handle each field properly to avoid validation errors
  Object.entries(investmentData).forEach(([key, value]) => {
    if (key === 'tags' && Array.isArray(value)) {
      // For tags array, append each tag separately
      value.forEach(tag => formData.append('tags', String(tag)));
    } else if (Array.isArray(value)) {
      // For other arrays, append each item separately
      value.forEach(v => formData.append(key, String(v)));
    } else if (value !== undefined && value !== null) {
      // For all other values, convert to string
      formData.append(key, String(value));
    }
  });

  // Add the image files
  Array.from(imageFiles).forEach(file => {
    formData.append('images', file);
  });

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
