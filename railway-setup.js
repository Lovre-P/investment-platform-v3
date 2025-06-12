#!/usr/bin/env node

/**
 * Railway Setup Helper Script
 * Helps configure your MegaInvest application for Railway deployment
 */

import fs from 'fs';
import path from 'path';

console.log('🚂 Railway Setup Helper for MegaInvest\n');

// Check current setup
function checkCurrentSetup() {
  console.log('📋 Checking current setup...\n');
  
  const checks = [];
  
  // Check if frontend package.json has start script
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (packageJson.scripts && packageJson.scripts.start) {
      checks.push('✅ Frontend has start script');
    } else {
      checks.push('❌ Frontend missing start script');
    }
  } catch (error) {
    checks.push('❌ Frontend package.json not found');
  }
  
  // Check backend
  try {
    const backendPackageJson = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
    if (backendPackageJson.scripts && backendPackageJson.scripts.start && backendPackageJson.scripts.build) {
      checks.push('✅ Backend has required scripts');
    } else {
      checks.push('❌ Backend missing required scripts');
    }
  } catch (error) {
    checks.push('❌ Backend package.json not found');
  }
  
  // Check if railway.json exists
  if (fs.existsSync('railway.json')) {
    checks.push('✅ Railway configuration file exists');
  } else {
    checks.push('⚠️  Railway configuration file created');
  }
  
  checks.forEach(check => console.log(check));
  console.log('');
}

// Generate environment variable templates
function generateEnvTemplates() {
  console.log('📝 Environment Variable Templates:\n');
  
  console.log('🔧 BACKEND SERVICE VARIABLES:');
  console.log('Copy these to your Railway backend service:\n');
  console.log(`NODE_ENV=production
PORT=$PORT
DATABASE_URL=\${{MySQL.DATABASE_URL}}
DB_HOST=\${{MySQL.MYSQL_HOST}}
DB_PORT=\${{MySQL.MYSQL_PORT}}
DB_NAME=\${{MySQL.MYSQL_DATABASE}}
DB_USER=\${{MySQL.MYSQL_USER}}
DB_PASSWORD=\${{MySQL.MYSQL_PASSWORD}}
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_EXPIRES_IN=24h
FRONTEND_URL=\${{Frontend.RAILWAY_PUBLIC_DOMAIN}}
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000`);
  
  console.log('\n📱 FRONTEND SERVICE VARIABLES:');
  console.log('Copy these to your Railway frontend service:\n');
  console.log(`VITE_API_URL=\${{Backend.RAILWAY_PUBLIC_DOMAIN}}`);
  
  console.log('\n');
}

// Show deployment steps
function showDeploymentSteps() {
  console.log('🚀 DEPLOYMENT STEPS:\n');
  
  const steps = [
    '1. 🗄️  Add MySQL Database:',
    '   • Go to Railway dashboard',
    '   • Click "New Service" → "Database" → "MySQL"',
    '   • Wait for database to be ready',
    '',
    '2. 🔧 Add Backend Service:',
    '   • Click "New Service" → "GitHub Repo"',
    '   • Select same repository (mega-invest-v3)',
    '   • Set Root Directory: backend',
    '   • Set Build Command: npm install && npm run build',
    '   • Set Start Command: npm start',
    '',
    '3. 📝 Configure Environment Variables:',
    '   • Add backend variables (see above)',
    '   • Add frontend variables (see above)',
    '',
    '4. 🎯 Initialize Database:',
    '   • Wait for backend to deploy',
    '   • Go to backend service → Console',
    '   • Run: npm run db:init',
    '',
    '5. ✅ Test Your Application:',
    '   • Visit your frontend URL',
    '   • Try logging in with: admin@megainvest.com / admin123',
    '   • Test creating investments and leads'
  ];
  
  steps.forEach(step => console.log(step));
  console.log('');
}

// Show current Railway project structure
function showProjectStructure() {
  console.log('📊 Expected Railway Project Structure:\n');
  console.log(`Railway Project: mega-invest-v3
├── 📱 Frontend Service
│   ├── Source: / (root directory)
│   ├── Build: npm install && npm run build
│   ├── Output: dist/
│   └── Type: Static Site
│
├── 🔧 Backend Service  
│   ├── Source: backend/
│   ├── Build: npm install && npm run build
│   ├── Start: npm start
│   └── Type: Web Service
│
└── 🗄️ MySQL Database
    ├── Auto-managed by Railway
    └── Connected via environment variables`);
  
  console.log('\n');
}

// Main execution
function main() {
  checkCurrentSetup();
  showProjectStructure();
  generateEnvTemplates();
  showDeploymentSteps();
  
  console.log('💡 TIPS:');
  console.log('• Railway automatically detects and deploys your frontend');
  console.log('• You need to manually add backend service and database');
  console.log('• Use Railway\'s variable references like ${{MySQL.DATABASE_URL}}');
  console.log('• Check deployment logs if something goes wrong');
  console.log('• Your $5 monthly credit should cover development usage');
  console.log('');
  
  console.log('📖 For detailed instructions, see: RAILWAY_SETUP_GUIDE.md');
  console.log('🆘 If you need help, check Railway\'s documentation or Discord');
}

main();
