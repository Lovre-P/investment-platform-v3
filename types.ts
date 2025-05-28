
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
  submittedBy: string; // User ID or name (will store Submitter Name from form)
  submitterEmail?: string; // Email of the person submitting the investment
  submissionDate: string; // ISO Date string
  apyRange?: string; // e.g., "5-8%"
  minInvestment?: number;
  term?: string; // e.g., "3 Years"
  tags?: string[];
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  investmentId?: string; // Optional: if lead is for a specific investment
  submissionDate: string; // ISO Date string
  status: 'New' | 'Contacted' | 'Converted' | 'Rejected';
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user', // General platform user (investor/submitter)
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  joinDate: string; // ISO Date string
  password?: string; // For mock authentication
}

export interface PlatformMetrics {
  totalInvestments: number;
  totalValueLocked: number;
  activeUsers: number;
  pendingApprovals: number;
}