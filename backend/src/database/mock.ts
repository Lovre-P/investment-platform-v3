// Mock database for development when MySQL is not available
import { Investment, Lead, User, InvestmentStatus, UserRole } from '../types/index.js';
import { hashPassword } from '../utils/auth.js';
import { v4 as uuidv4 } from 'uuid';

// In-memory storage
let mockUsers: User[] = [];
let mockInvestments: Investment[] = [];
let mockLeads: Lead[] = [];

// Initialize with sample data
export async function initializeMockData() {
  console.log('🔧 Initializing mock database...');
  
  // Create admin user
  const adminPasswordHash = await hashPassword('admin123');
  const adminUser: User = {
    id: uuidv4(),
    username: 'admin',
    email: 'admin@megainvest.com',
    role: UserRole.ADMIN,
    joinDate: new Date().toISOString(),
    password: adminPasswordHash
  };
  mockUsers.push(adminUser);

  // Create test user
  const userPasswordHash = await hashPassword('user123');
  const testUser: User = {
    id: uuidv4(),
    username: 'testuser',
    email: 'user@megainvest.com',
    role: UserRole.USER,
    joinDate: new Date().toISOString(),
    password: userPasswordHash
  };
  mockUsers.push(testUser);

  // Create sample investments
  const investment1: Investment = {
    id: uuidv4(),
    title: 'Green Energy Solar Farm',
    description: 'Sustainable solar energy project with guaranteed returns',
    longDescription: 'This is a comprehensive solar farm project that aims to generate clean energy while providing stable returns to investors. The project includes 500 acres of solar panels with a 25-year power purchase agreement.',
    amountGoal: 1000000,
    amountRaised: 250000,
    currency: 'USD',
    images: ['https://picsum.photos/400/300?random=1'],
    category: 'Renewable Energy',
    status: InvestmentStatus.OPEN,
    submittedBy: 'Green Energy Corp',
    submitterEmail: 'contact@greenenergy.com',
    submissionDate: new Date().toISOString(),
    apyRange: '8-12%',
    minInvestment: 5000,
    term: '5 Years',
    tags: ['solar', 'renewable', 'sustainable']
  };

  const investment2: Investment = {
    id: uuidv4(),
    title: 'Tech Startup Series A',
    description: 'AI-powered fintech startup seeking growth capital',
    longDescription: 'Revolutionary fintech platform using AI to democratize investment opportunities. The company has shown 300% growth in the last year and is seeking Series A funding to expand internationally.',
    amountGoal: 2500000,
    amountRaised: 0,
    currency: 'USD',
    images: ['https://picsum.photos/400/300?random=2'],
    category: 'Technology',
    status: InvestmentStatus.PENDING,
    submittedBy: 'TechVenture Inc',
    submitterEmail: 'funding@techventure.com',
    submissionDate: new Date().toISOString(),
    apyRange: '15-25%',
    minInvestment: 10000,
    term: '3-7 Years',
    tags: ['tech', 'ai', 'fintech', 'startup']
  };

  mockInvestments.push(investment1, investment2);

  // Create sample leads
  const lead1: Lead = {
    id: uuidv4(),
    name: 'John Investor',
    email: 'john@example.com',
    phone: '+1-555-0123',
    message: 'Interested in the solar farm project. Please contact me with more details.',
    investmentId: investment1.id,
    submissionDate: new Date().toISOString(),
    status: 'New'
  };

  const lead2: Lead = {
    id: uuidv4(),
    name: 'Sarah Capital',
    email: 'sarah@capitalfirm.com',
    message: 'Looking for tech investment opportunities. Would like to schedule a call.',
    submissionDate: new Date().toISOString(),
    status: 'Contacted'
  };

  mockLeads.push(lead1, lead2);

  console.log('✅ Mock database initialized with sample data');
  console.log('📧 Admin credentials: admin@megainvest.com / admin123');
  console.log('📧 User credentials: user@megainvest.com / user123');
}

// Export mock data getters
export const getMockUsers = () => mockUsers;
export const getMockInvestments = () => mockInvestments;
export const getMockLeads = () => mockLeads;

// Mock database operations
export const mockDb = {
  users: {
    findAll: () => mockUsers.map(u => ({ ...u, password: undefined })),
    findById: (id: string) => {
      const user = mockUsers.find(u => u.id === id);
      return user ? { ...user, password: undefined } : null;
    },
    findByEmail: (email: string) => mockUsers.find(u => u.email === email) || null,
    findByUsername: (username: string) => mockUsers.find(u => u.username === username) || null,
    create: async (userData: any) => {
      const newUser = {
        ...userData,
        id: uuidv4(),
        joinDate: new Date().toISOString(),
        password: await hashPassword(userData.password)
      };
      mockUsers.push(newUser);
      return { ...newUser, password: undefined };
    },
    update: (id: string, updates: any) => {
      const index = mockUsers.findIndex(u => u.id === id);
      if (index === -1) return null;
      mockUsers[index] = { ...mockUsers[index], ...updates };
      return { ...mockUsers[index], password: undefined };
    },
    delete: (id: string) => {
      const index = mockUsers.findIndex(u => u.id === id);
      if (index === -1) return false;
      mockUsers.splice(index, 1);
      return true;
    }
  },
  
  investments: {
    findAll: (filters: any = {}) => {
      let filtered = mockInvestments;
      if (filters.status) filtered = filtered.filter(i => i.status === filters.status);
      if (filters.category) filtered = filtered.filter(i => i.category === filters.category);
      return filtered;
    },
    findById: (id: string) => mockInvestments.find(i => i.id === id) || null,
    create: (data: any) => {
      const newInvestment = {
        ...data,
        id: uuidv4(),
        submissionDate: new Date().toISOString(),
        status: InvestmentStatus.PENDING,
        amountRaised: 0
      };
      mockInvestments.push(newInvestment);
      return newInvestment;
    },
    update: (id: string, updates: any) => {
      const index = mockInvestments.findIndex(i => i.id === id);
      if (index === -1) return null;
      mockInvestments[index] = { ...mockInvestments[index], ...updates };
      return mockInvestments[index];
    },
    delete: (id: string) => {
      const index = mockInvestments.findIndex(i => i.id === id);
      if (index === -1) return false;
      mockInvestments.splice(index, 1);
      return true;
    }
  },
  
  leads: {
    findAll: () => mockLeads,
    findById: (id: string) => mockLeads.find(l => l.id === id) || null,
    create: (data: any) => {
      const newLead = {
        ...data,
        id: uuidv4(),
        submissionDate: new Date().toISOString(),
        status: 'New'
      };
      mockLeads.push(newLead);
      return newLead;
    },
    updateStatus: (id: string, status: string) => {
      const index = mockLeads.findIndex(l => l.id === id);
      if (index === -1) return null;
      mockLeads[index].status = status as any;
      return mockLeads[index];
    },
    delete: (id: string) => {
      const index = mockLeads.findIndex(l => l.id === id);
      if (index === -1) return false;
      mockLeads.splice(index, 1);
      return true;
    }
  }
};
