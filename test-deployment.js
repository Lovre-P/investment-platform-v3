#!/usr/bin/env node

/**
 * Test Railway Deployment Script
 * Tests if your deployed application is working correctly
 */

import https from 'https';
import http from 'http';

// Test a URL and return response
function testUrl(url, description) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          url,
          description,
          status: res.statusCode,
          success: res.statusCode >= 200 && res.statusCode < 300,
          data: data.substring(0, 200) // First 200 chars
        });
      });
    });
    
    req.on('error', (error) => {
      resolve({
        url,
        description,
        status: 'ERROR',
        success: false,
        error: error.message
      });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        url,
        description,
        status: 'TIMEOUT',
        success: false,
        error: 'Request timeout'
      });
    });
  });
}

// Main test function
async function testDeployment() {
  console.log('🧪 Testing Railway Deployment\n');
  
  // Get URLs from user input or environment
  const frontendUrl = process.argv[2];
  const backendUrl = process.argv[3];
  
  if (!frontendUrl || !backendUrl) {
    console.log('Usage: node test-deployment.js <frontend-url> <backend-url>');
    console.log('Example: node test-deployment.js https://frontend-xxx.railway.app https://backend-xxx.railway.app');
    console.log('\nGet these URLs from your Railway dashboard');
    return;
  }
  
  console.log(`🔍 Testing Frontend: ${frontendUrl}`);
  console.log(`🔍 Testing Backend: ${backendUrl}\n`);
  
  // Test frontend
  const frontendTest = await testUrl(frontendUrl, 'Frontend Homepage');
  
  // Test backend health
  const backendHealthTest = await testUrl(`${backendUrl}/health`, 'Backend Health Check');
  
  // Test backend API
  const backendApiTest = await testUrl(`${backendUrl}/api/investments`, 'Backend API - Investments');
  
  // Display results
  const tests = [frontendTest, backendHealthTest, backendApiTest];
  
  console.log('📋 Test Results:\n');
  
  tests.forEach(test => {
    const status = test.success ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${test.description}`);
    console.log(`   URL: ${test.url}`);
    console.log(`   Status: ${test.status}`);
    
    if (test.error) {
      console.log(`   Error: ${test.error}`);
    } else if (test.data) {
      console.log(`   Response: ${test.data.substring(0, 100)}...`);
    }
    console.log('');
  });
  
  // Summary
  const passedTests = tests.filter(t => t.success).length;
  const totalTests = tests.length;
  
  console.log(`📊 Summary: ${passedTests}/${totalTests} tests passed\n`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Your application is working correctly.');
    console.log('\n✅ Next steps:');
    console.log('• Test user login with: admin@megainvest.com / admin123');
    console.log('• Try creating a new investment');
    console.log('• Submit a contact form');
    console.log('• Check the admin dashboard');
  } else {
    console.log('⚠️  Some tests failed. Check the following:');
    console.log('• Are all services deployed and running?');
    console.log('• Are environment variables set correctly?');
    console.log('• Is the database connected and initialized?');
    console.log('• Check Railway deployment logs for errors');
  }
}

testDeployment().catch(console.error);
