export enum InvestmentStatus {
  OPEN = 'Open',
  FUNDED = 'Funded',
  CLOSED = 'Closed',
  PENDING = 'Pending Approval'
}

export interface Investment {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  amountGoal: number;
  amountRaised: number;
  currency: string;
  images: string[];
  category: string;
  status: InvestmentStatus;
  submittedBy: string;
  submitterEmail?: string;
  submissionDate: string;
  apyRange?: string;
  minInvestment?: number;
  term?: string;
  tags?: string[];
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  investmentId?: string;
  submissionDate: string;
  status: 'New' | 'Contacted' | 'Converted' | 'Rejected';
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  joinDate: string;
  password?: string;
}

export interface InvestmentCategory {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvestmentCategoryData {
  name: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateInvestmentCategoryData {
  name?: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
}

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

export interface CreatePlatformSettingData {
  settingKey: string;
  settingValue: string;
  settingType?: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  isPublic?: boolean;
}

export interface UpdatePlatformSettingData {
  settingValue?: string;
  settingType?: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  isPublic?: boolean;
}

export interface PlatformMetrics {
  totalInvestments: number;
  totalValueLocked: number;
  activeUsers: number;
  pendingApprovals: number;
}

// API Request/Response types
export interface LoginCredentials {
  email?: string;
  username?: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: Omit<User, 'password'>;
}

export interface CreateInvestmentData extends Omit<Investment, 'id' | 'submissionDate' | 'status' | 'amountRaised'> {
  submittedBy: string;
  submitterEmail: string;
}

export interface CreateLeadData extends Omit<Lead, 'id' | 'submissionDate' | 'status'> {}

export interface CreateUserData extends Omit<User, 'id' | 'joinDate'> {
  password: string;
}

export interface UpdateUserData extends Partial<Omit<User, 'id' | 'joinDate' | 'password'>> {}

// Database types
export interface DatabaseUser extends User {
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseInvestment extends Investment {
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseLead extends Lead {
  createdAt: Date;
  updatedAt: Date;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// API Error Response
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}
