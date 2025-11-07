// Simple test using built-in http module
const http = require('http');

function testEndpoint(path, description) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          console.log(`✅ ${description}`);
          console.log(`   Status: ${res.statusCode}`);
          console.log(`   Success: ${jsonData.success}`);
          if (jsonData.data && Array.isArray(jsonData.data)) {
            console.log(`   Count: ${jsonData.data.length}`);
            if (jsonData.data.length > 0) {
              console.log(`   First title: "${jsonData.data[0].title}"`);
            }
          } else if (jsonData.data && jsonData.data.title) {
            console.log(`   Title: "${jsonData.data.title}"`);
          }
          console.log('');
          resolve(jsonData);
        } catch (error) {
          console.error(`❌ ${description} - JSON parse error:`, error.message);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ ${description} - Request error:`, error.message);
      reject(error);
    });

    req.setTimeout(5000, () => {
      console.error(`❌ ${description} - Timeout`);
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing Investment Translation API...\n');
  
  try {
    // Test 1: English (default)
    const englishData = await testEndpoint('/api/investments', 'English (default)');
    
    // Test 2: Croatian
    await testEndpoint('/api/investments?lang=hr', 'Croatian (hr)');
    
    // Test 3: German
    await testEndpoint('/api/investments?lang=de', 'German (de)');
    
    // Test 4: French
    await testEndpoint('/api/investments?lang=fr', 'French (fr)');
    
    // Test 5: Single investment with Croatian
    if (englishData.data && englishData.data.length > 0) {
      const investmentId = englishData.data[0].id;
      await testEndpoint(`/api/investments/${investmentId}?lang=hr`, 'Single investment (Croatian)');
    }
    
    console.log('🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
  }
}

runTests();
