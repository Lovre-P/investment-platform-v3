#!/usr/bin/env node

/**
 * Pre-deployment check script for Render.com
 * Verifies that all necessary files and configurations are in place
 */

import fs from 'fs';
import path from 'path';

const checks = [];

// Check if package.json has start script
function checkPackageJson() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (packageJson.scripts && packageJson.scripts.start) {
      checks.push({ name: 'Frontend package.json start script', status: '✅ PASS' });
    } else {
      checks.push({ name: 'Frontend package.json start script', status: '❌ FAIL - Missing start script' });
    }
  } catch (error) {
    checks.push({ name: 'Frontend package.json', status: '❌ FAIL - File not found' });
  }
}

// Check backend package.json
function checkBackendPackageJson() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
    if (packageJson.scripts && packageJson.scripts.start && packageJson.scripts.build) {
      checks.push({ name: 'Backend package.json scripts', status: '✅ PASS' });
    } else {
      checks.push({ name: 'Backend package.json scripts', status: '❌ FAIL - Missing start or build script' });
    }
  } catch (error) {
    checks.push({ name: 'Backend package.json', status: '❌ FAIL - File not found' });
  }
}

// Check if environment example files exist
function checkEnvFiles() {
  if (fs.existsSync('.env.example')) {
    checks.push({ name: 'Frontend .env.example', status: '✅ PASS' });
  } else {
    checks.push({ name: 'Frontend .env.example', status: '⚠️  WARN - File not found' });
  }

  if (fs.existsSync('backend/.env.example')) {
    checks.push({ name: 'Backend .env.example', status: '✅ PASS' });
  } else {
    checks.push({ name: 'Backend .env.example', status: '⚠️  WARN - File not found' });
  }
}

// Check if API services use environment variables
function checkApiServices() {
  const serviceFiles = [
    'services/authService.ts',
    'services/userService.ts',
    'services/investmentService.ts',
    'services/leadService.ts'
  ];

  let allUpdated = true;
  for (const file of serviceFiles) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('import.meta.env.VITE_API_URL')) {
        // File is updated
      } else {
        allUpdated = false;
        break;
      }
    } catch (error) {
      allUpdated = false;
      break;
    }
  }

  if (allUpdated) {
    checks.push({ name: 'API services environment configuration', status: '✅ PASS' });
  } else {
    checks.push({ name: 'API services environment configuration', status: '❌ FAIL - Not all services updated' });
  }
}

// Check Vite config
function checkViteConfig() {
  try {
    const content = fs.readFileSync('vite.config.ts', 'utf8');
    if (content.includes('VITE_API_URL')) {
      checks.push({ name: 'Vite configuration', status: '✅ PASS' });
    } else {
      checks.push({ name: 'Vite configuration', status: '❌ FAIL - Missing VITE_API_URL' });
    }
  } catch (error) {
    checks.push({ name: 'Vite configuration', status: '❌ FAIL - File not found' });
  }
}

// Run all checks
function runChecks() {
  console.log('🚀 Render.com Deployment Pre-Check\n');
  console.log('Checking your MegaInvest application for Render.com deployment...\n');

  checkPackageJson();
  checkBackendPackageJson();
  checkEnvFiles();
  checkApiServices();
  checkViteConfig();

  console.log('📋 Check Results:\n');
  checks.forEach(check => {
    console.log(`${check.status} ${check.name}`);
  });

  const failedChecks = checks.filter(check => check.status.includes('❌'));
  const warningChecks = checks.filter(check => check.status.includes('⚠️'));

  console.log('\n📊 Summary:');
  console.log(`✅ Passed: ${checks.length - failedChecks.length - warningChecks.length}`);
  console.log(`⚠️  Warnings: ${warningChecks.length}`);
  console.log(`❌ Failed: ${failedChecks.length}`);

  if (failedChecks.length === 0) {
    console.log('\n🎉 Your application is ready for Render.com deployment!');
    console.log('\nNext steps:');
    console.log('1. Push your code to GitHub');
    console.log('2. Follow the RENDER_DEPLOYMENT_GUIDE.md');
    console.log('3. Set up your database (PlanetScale, Railway, etc.)');
    console.log('4. Deploy backend first, then frontend');
  } else {
    console.log('\n⚠️  Please fix the failed checks before deploying.');
  }

  console.log('\n📖 For detailed instructions, see: RENDER_DEPLOYMENT_GUIDE.md');
}

runChecks();
