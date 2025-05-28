import { Investment, Lead, User, InvestmentStatus, UserRole, PlatformMetrics } from '../types';
import { PLACEHOLDER_IMAGE_URL } from '../constants';

// All mock data arrays are now empty.
export const mockInvestments: Investment[] = [];
export const mockLeads: Lead[] = [];
export const mockUsers: User[] = [];

// Functions that relied on modifying these arrays will now be no-ops or return empty/default values.
// Or, more appropriately, they should be removed if the services will handle actual API calls.
// For now, they will return empty/default values or throw errors if called,
// as their logic is tied to the mutable mock arrays.

export const getMockPlatformMetrics = (): PlatformMetrics => {
  // This function now returns zeroed-out metrics as mockInvestments and mockUsers are empty.
  return {
    totalInvestments: 0,
    totalValueLocked: 0,
    activeUsers: 0,
    pendingApprovals: 0,
  };
};

interface NewInvestmentData extends Omit<Investment, 'id' | 'submissionDate' | 'status' | 'amountRaised' | 'submittedBy' | 'submitterEmail'> {
  submittedBy: string;
  submitterEmail: string;
}

export const addMockInvestment = (investmentData: NewInvestmentData): Investment => {
  console.warn("addMockInvestment is deprecated. API calls should be used.");
  // Return a placeholder or throw an error, as mockInvestments is no longer actively managed here.
  const placeholderId = String(Math.random());
  return {
    id: placeholderId,
    title: investmentData.title,
    description: investmentData.description,
    longDescription: investmentData.longDescription,
    amountGoal: investmentData.amountGoal,
    amountRaised: 0,
    currency: investmentData.currency,
    images: investmentData.images && investmentData.images.length > 0 ? investmentData.images : [`${PLACEHOLDER_IMAGE_URL}/400/300?random=${placeholderId}`],
    category: investmentData.category,
    status: InvestmentStatus.PENDING,
    submittedBy: investmentData.submittedBy,
    submitterEmail: investmentData.submitterEmail,
    submissionDate: new Date().toISOString(),
    apyRange: investmentData.apyRange,
    minInvestment: investmentData.minInvestment,
    term: investmentData.term,
    tags: investmentData.tags,
  };
};

export const updateMockInvestment = (updatedInvestment: Investment): Investment | null => {
  console.warn("updateMockInvestment is deprecated. API calls should be used.");
  return null; // Or the updatedInvestment itself, but it won't persist.
};

export const deleteMockInvestment = (investmentId: string): boolean => {
  console.warn("deleteMockInvestment is deprecated. API calls should be used.");
  return false;
};

export const addMockLead = (leadData: Omit<Lead, 'id' | 'submissionDate' | 'status'>): Lead => {
  console.warn("addMockLead is deprecated. API calls should be used.");
  return {
    ...leadData,
    id: String(Math.random()),
    submissionDate: new Date().toISOString(),
    status: 'New',
  };
};

export const updateMockLead = (updatedLead: Lead): Lead | null => {
  console.warn("updateMockLead is deprecated. API calls should be used.");
  return null;
};

export const addMockUser = (userData: Omit<User, 'id' | 'joinDate'>): User => {
  console.warn("addMockUser is deprecated. API calls should be used.");
  return {
    ...userData,
    id: String(Math.random()),
    joinDate: new Date().toISOString(),
  };
};

export const updateMockUser = (updatedUser: User): User | null => {
  console.warn("updateMockUser is deprecated. API calls should be used.");
  return null;
};

export const deleteMockUser = (userId: string): boolean => {
  console.warn("deleteMockUser is deprecated. API calls should be used.");
  return false;
};
