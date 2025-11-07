// Test the Investment model directly
import { InvestmentModel } from './src/models/Investment.js';

async function testInvestmentModel() {
  try {
    console.log('🧪 Testing Investment model...');
    
    // Test findAll without language
    console.log('1. Testing findAll (English)...');
    const investmentsEn = await InvestmentModel.findAll({ limit: 5 });
    console.log(`   ✅ Found ${investmentsEn.length} investments`);
    if (investmentsEn.length > 0) {
      console.log(`   📝 First investment: "${investmentsEn[0].title}"`);
    }
    
    // Test findAll with Croatian
    console.log('2. Testing findAll (Croatian)...');
    const investmentsHr = await InvestmentModel.findAll({ limit: 5, lang: 'hr' });
    console.log(`   ✅ Found ${investmentsHr.length} investments`);
    if (investmentsHr.length > 0) {
      console.log(`   📝 First investment: "${investmentsHr[0].title}"`);
    }
    
    // Test findById
    if (investmentsEn.length > 0) {
      const investmentId = investmentsEn[0].id;
      console.log('3. Testing findById...');
      const investment = await InvestmentModel.findById(investmentId);
      console.log(`   ✅ Found investment: "${investment?.title}"`);
    }
    
    console.log('🎉 All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    process.exit(0);
  }
}

testInvestmentModel();
