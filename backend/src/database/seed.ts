import bcrypt from 'bcryptjs';
import { pool } from './config.js';
import { UserRole, InvestmentStatus } from '../types/index.js';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create admin user
    const adminPasswordHash = await bcrypt.hash('admin123', 12);

    await pool.execute(`
      INSERT IGNORE INTO users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, ['admin', 'admin@megainvest.com', adminPasswordHash, UserRole.ADMIN]);

    // Create a test user
    const userPasswordHash = await bcrypt.hash('user123', 12);

    await pool.execute(`
      INSERT IGNORE INTO users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, ['testuser', 'user@megainvest.com', userPasswordHash, UserRole.USER]);

    // Create sample investments
    const sampleInvestments = [
      {
        title: 'Green Energy Solar Farm',
        description: 'Sustainable solar energy project with guaranteed returns',
        longDescription: 'This is a comprehensive solar farm project that aims to generate clean energy while providing stable returns to investors. The project includes 500 acres of solar panels with a 25-year power purchase agreement.',
        amountGoal: 1000000,
        currency: 'USD',
        images: ['https://picsum.photos/400/300?random=1'],
        category: 'Renewable Energy',
        status: InvestmentStatus.OPEN,
        submittedBy: 'Green Energy Corp',
        submitterEmail: 'contact@greenenergy.com',
        apyRange: '8-12%',
        minInvestment: 5000,
        term: '5 Years',
        tags: ['solar', 'renewable', 'sustainable']
      },
      {
        title: 'Tech Startup Series A',
        description: 'AI-powered fintech startup seeking growth capital',
        longDescription: 'Revolutionary fintech platform using AI to democratize investment opportunities. The company has shown 300% growth in the last year and is seeking Series A funding to expand internationally.',
        amountGoal: 2500000,
        currency: 'USD',
        images: ['https://picsum.photos/400/300?random=2'],
        category: 'Technology',
        status: InvestmentStatus.PENDING,
        submittedBy: 'TechVenture Inc',
        submitterEmail: 'funding@techventure.com',
        apyRange: '15-25%',
        minInvestment: 10000,
        term: '3-7 Years',
        tags: ['tech', 'ai', 'fintech', 'startup']
      }
    ];

    for (const investment of sampleInvestments) {
      await pool.execute(`
        INSERT IGNORE INTO investments (
          title, description, long_description, amount_goal, currency, images,
          category, status, submitted_by, submitter_email, apy_range,
          min_investment, term, tags
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        investment.title, investment.description, investment.longDescription,
        investment.amountGoal, investment.currency, JSON.stringify(investment.images),
        investment.category, investment.status, investment.submittedBy,
        investment.submitterEmail, investment.apyRange, investment.minInvestment,
        investment.term, JSON.stringify(investment.tags)
      ]);
    }

    // Create sample leads
    const sampleLeads = [
      {
        name: 'John Investor',
        email: 'john@example.com',
        phone: '+1-555-0123',
        message: 'Interested in the solar farm project. Please contact me with more details.',
        status: 'New'
      },
      {
        name: 'Sarah Capital',
        email: 'sarah@capitalfirm.com',
        message: 'Looking for tech investment opportunities. Would like to schedule a call.',
        status: 'Contacted'
      }
    ];

    for (const lead of sampleLeads) {
      await pool.execute(`
        INSERT IGNORE INTO leads (name, email, phone, message, status)
        VALUES (?, ?, ?, ?, ?)
      `, [lead.name, lead.email, lead.phone || null, lead.message, lead.status]);
    }

    console.log('✅ Database seeding completed successfully');
    console.log('📧 Admin credentials: admin@megainvest.com / admin123');
    console.log('📧 User credentials: user@megainvest.com / user123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Always run seeding when this file is executed
console.log('🚀 Seed script started!');
seedDatabase();

export { seedDatabase };
