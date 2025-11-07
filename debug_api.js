// Debug API endpoint
const http = require('http');

function testAPI() {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/investments',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response body:', data);
      if (res.statusCode >= 400) {
        console.log('❌ API Error detected');
      } else {
        console.log('✅ API working');
      }
    });
  });

  req.on('error', (error) => {
    console.error('Request error:', error);
  });

  req.setTimeout(5000, () => {
    console.error('Request timeout');
    req.destroy();
  });

  req.end();
}

console.log('🔍 Testing API endpoint...');
testAPI();
