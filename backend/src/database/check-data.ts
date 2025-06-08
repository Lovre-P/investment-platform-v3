import { pool } from './config.js';

async function checkDatabaseData() {
  try {
    console.log('🔍 Checking database contents...');

    // Check users table
    const [users] = await pool.execute('SELECT id, username, email, role FROM users');
    console.log(`\n👥 Users table: ${(users as any[]).length} records`);
    (users as any[]).forEach(user => {
      console.log(`   - ${user.username} (${user.email}) - Role: ${user.role}`);
    });

    // Check investments table
    const [investments] = await pool.execute('SELECT id, title, status, submitted_by FROM investments');
    console.log(`\n💰 Investments table: ${(investments as any[]).length} records`);
    (investments as any[]).forEach(investment => {
      console.log(`   - ${investment.title} - Status: ${investment.status} - By: ${investment.submitted_by}`);
    });

    // Check leads table
    const [leads] = await pool.execute('SELECT id, name, email, status FROM leads');
    console.log(`\n📧 Leads table: ${(leads as any[]).length} records`);
    (leads as any[]).forEach(lead => {
      console.log(`   - ${lead.name} (${lead.email}) - Status: ${lead.status}`);
    });

  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await pool.end();
  }
}

checkDatabaseData();
