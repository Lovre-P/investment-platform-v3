const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export interface InvestmentCategory {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface CategoryUsageData {
  categoryName: string;
  usageCount: number;
  canDelete: boolean;
}

// Get all categories (public endpoint)
export const getCategories = async (includeInactive = false): Promise<InvestmentCategory[]> => {
  const params = new URLSearchParams();
  if (includeInactive) {
    params.append('include_inactive', 'true');
  }

  const response = await fetch(`${API_BASE_URL}/categories?${params}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to fetch categories');
  }

  const data = await response.json();
  return data.data;
};

// Get category by ID
export const getCategoryById = async (id: string): Promise<InvestmentCategory> => {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to fetch category');
  }

  const data = await response.json();
  return data.data;
};

// Create new category (admin only)
export const createCategory = async (categoryData: CreateCategoryData): Promise<InvestmentCategory> => {
  const token = localStorage.getItem('megaInvestToken');
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(categoryData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to create category');
  }

  const data = await response.json();
  return data.data;
};

// Update category (admin only)
export const updateCategory = async (id: string, updates: UpdateCategoryData): Promise<InvestmentCategory> => {
  const token = localStorage.getItem('megaInvestToken');
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to update category');
  }

  const data = await response.json();
  return data.data;
};

// Delete category (admin only)
export const deleteCategory = async (id: string): Promise<void> => {
  const token = localStorage.getItem('megaInvestToken');
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to delete category');
  }
};

// Check category usage (admin only)
export const getCategoryUsage = async (categoryName: string): Promise<CategoryUsageData> => {
  const token = localStorage.getItem('megaInvestToken');
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/categories/${encodeURIComponent(categoryName)}/usage`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to check category usage');
  }

  const data = await response.json();
  return data.data;
};
