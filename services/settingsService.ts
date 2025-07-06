const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export interface PlatformSetting {
  id: string;
  settingKey: string;
  settingValue: string;
  settingType: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSettingData {
  settingKey: string;
  settingValue: string;
  settingType?: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  isPublic?: boolean;
}

export interface UpdateSettingData {
  settingValue?: string;
  settingType?: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  isPublic?: boolean;
}

// Get all settings (admin only)
export const getSettings = async (publicOnly = false, asObject = false): Promise<PlatformSetting[] | Record<string, any>> => {
  const token = localStorage.getItem('megaInvestToken');
  if (!token) {
    throw new Error('Authentication required');
  }

  const params = new URLSearchParams();
  if (publicOnly) {
    params.append('public_only', 'true');
  }
  if (asObject) {
    params.append('as_object', 'true');
  }

  const response = await fetch(`${API_BASE_URL}/settings?${params}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to fetch settings');
  }

  const data = await response.json();
  return data.data;
};

// Get setting by key (admin only)
export const getSettingByKey = async (key: string): Promise<PlatformSetting> => {
  const token = localStorage.getItem('megaInvestToken');
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/settings/${key}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to fetch setting');
  }

  const data = await response.json();
  return data.data;
};

// Get setting value (admin only)
export const getSettingValue = async (key: string, defaultValue?: string): Promise<string | null> => {
  const token = localStorage.getItem('megaInvestToken');
  if (!token) {
    throw new Error('Authentication required');
  }

  const params = new URLSearchParams();
  if (defaultValue) {
    params.append('default', defaultValue);
  }

  const response = await fetch(`${API_BASE_URL}/settings/${key}/value?${params}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to fetch setting value');
  }

  const data = await response.json();
  return data.data.value;
};

// Create new setting (admin only)
export const createSetting = async (settingData: CreateSettingData): Promise<PlatformSetting> => {
  const token = localStorage.getItem('megaInvestToken');
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/settings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(settingData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to create setting');
  }

  const data = await response.json();
  return data.data;
};

// Update setting (admin only)
export const updateSetting = async (key: string, updates: UpdateSettingData): Promise<PlatformSetting> => {
  const token = localStorage.getItem('megaInvestToken');
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/settings/${key}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to update setting');
  }

  const data = await response.json();
  return data.data;
};

// Update setting value (admin only)
export const updateSettingValue = async (key: string, value: string | number | boolean): Promise<PlatformSetting> => {
  const token = localStorage.getItem('megaInvestToken');
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/settings/${key}/value`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ value }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to update setting value');
  }

  const data = await response.json();
  return data.data;
};

// Bulk update settings (admin only)
export const bulkUpdateSettings = async (settings: Record<string, string | number | boolean>): Promise<{ updated: PlatformSetting[], errors: any[] }> => {
  const token = localStorage.getItem('megaInvestToken');
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/settings/bulk-update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ settings }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to bulk update settings');
  }

  const data = await response.json();
  return data.data;
};

// Delete setting (admin only)
export const deleteSetting = async (key: string): Promise<void> => {
  const token = localStorage.getItem('megaInvestToken');
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/settings/${key}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to delete setting');
  }
};
