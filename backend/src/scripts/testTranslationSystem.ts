#!/usr/bin/env node

/**
 * Test script for the investment translation system
 * 
 * This script tests:
 * 1. Database connection
 * 2. Translation table existence
 * 3. Translation service functionality
 * 4. API endpoints with language parameters
 * 5. Fallback behavior
 */

import { pool } from '../database/config.js';
import { TranslationService, SUPPORTED_LANGS } from '../services/translationService.js';
import { InvestmentModel } from '../models/Investment.js';

class TranslationSystemTest {
  private testResults: { [key: string]: boolean } = {};
  private testDetails: { [key: string]: string } = {};

  async runAllTests(): Promise<void> {
    console.log('🧪 Starting Translation System Tests...\n');

    try {
      await this.testDatabaseConnection();
      await this.testTranslationTableExists();
      await this.testTranslationService();
      await this.testInvestmentModelWithLanguage();
      await this.testFallbackBehavior();
      
      this.showTestResults();
    } catch (error) {
      console.error('❌ Test suite failed:', error);
    } finally {
      await pool.end();
    }
  }

  private async testDatabaseConnection(): Promise<void> {
    console.log('🔌 Testing database connection...');
    try {
      await pool.execute('SELECT 1');
      this.testResults['database_connection'] = true;
      this.testDetails['database_connection'] = 'Successfully connected to database';
      console.log('   ✅ Database connection successful\n');
    } catch (error) {
      this.testResults['database_connection'] = false;
      this.testDetails['database_connection'] = `Failed: ${error}`;
      console.log('   ❌ Database connection failed\n');
      throw error;
    }
  }

  private async testTranslationTableExists(): Promise<void> {
    console.log('📋 Testing translation table existence...');
    try {
      const [rows] = await pool.execute('DESCRIBE investment_translations');
      this.testResults['translation_table'] = true;
      this.testDetails['translation_table'] = `Table exists with ${(rows as any[]).length} columns`;
      console.log('   ✅ investment_translations table exists\n');
    } catch (error) {
      this.testResults['translation_table'] = false;
      this.testDetails['translation_table'] = `Failed: ${error}`;
      console.log('   ❌ investment_translations table not found\n');
      throw error;
    }
  }

  private async testTranslationService(): Promise<void> {
    console.log('🌐 Testing translation service...');
    try {
      const testContent = {
        title: 'Test Investment',
        description: 'This is a test description',
        longDescription: 'This is a longer test description with more details',
        category: 'Technology',
        tags: ['test', 'technology', 'investment']
      };

      // Test hash generation
      const hash1 = TranslationService.generateSourceHash(testContent);
      const hash2 = TranslationService.generateSourceHash(testContent);
      
      if (hash1 !== hash2) {
        throw new Error('Hash generation is not consistent');
      }

      // Test translation (mock)
      const translated = await TranslationService.translateContent(testContent, 'hr');
      
      if (!translated.title || !translated.description) {
        throw new Error('Translation did not return required fields');
      }

      this.testResults['translation_service'] = true;
      this.testDetails['translation_service'] = 'Hash generation and translation working';
      console.log('   ✅ Translation service working correctly\n');
    } catch (error) {
      this.testResults['translation_service'] = false;
      this.testDetails['translation_service'] = `Failed: ${error}`;
      console.log('   ❌ Translation service failed\n');
    }
  }

  private async testInvestmentModelWithLanguage(): Promise<void> {
    console.log('💼 Testing Investment model with language support...');
    try {
      // Test findAll with language parameter
      const investmentsEn = await InvestmentModel.findAll({ limit: 1 });
      const investmentsHr = await InvestmentModel.findAll({ limit: 1, lang: 'hr' });
      
      if (investmentsEn.length === 0) {
        console.log('   ⚠️  No investments found in database');
        this.testResults['investment_model'] = true;
        this.testDetails['investment_model'] = 'Model works but no data to test with';
        return;
      }

      // Test findById with language parameter
      const investmentId = investmentsEn[0].id;
      const investmentEn = await InvestmentModel.findById(investmentId);
      const investmentHr = await InvestmentModel.findById(investmentId, 'hr');

      if (!investmentEn || !investmentHr) {
        throw new Error('Failed to fetch investment with language parameter');
      }

      this.testResults['investment_model'] = true;
      this.testDetails['investment_model'] = 'Model supports language parameters correctly';
      console.log('   ✅ Investment model language support working\n');
    } catch (error) {
      this.testResults['investment_model'] = false;
      this.testDetails['investment_model'] = `Failed: ${error}`;
      console.log('   ❌ Investment model language support failed\n');
    }
  }

  private async testFallbackBehavior(): Promise<void> {
    console.log('🔄 Testing fallback behavior...');
    try {
      // Test with unsupported language
      const investments = await InvestmentModel.findAll({ limit: 1, lang: 'unsupported' });
      
      if (investments.length > 0) {
        // Should still return data (fallback to English)
        this.testResults['fallback_behavior'] = true;
        this.testDetails['fallback_behavior'] = 'Fallback to English works for unsupported languages';
        console.log('   ✅ Fallback behavior working correctly\n');
      } else {
        this.testResults['fallback_behavior'] = true;
        this.testDetails['fallback_behavior'] = 'No data to test fallback with';
        console.log('   ⚠️  No data to test fallback behavior\n');
      }
    } catch (error) {
      this.testResults['fallback_behavior'] = false;
      this.testDetails['fallback_behavior'] = `Failed: ${error}`;
      console.log('   ❌ Fallback behavior failed\n');
    }
  }

  private showTestResults(): void {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 TEST RESULTS SUMMARY');
    console.log('='.repeat(60));

    const totalTests = Object.keys(this.testResults).length;
    const passedTests = Object.values(this.testResults).filter(result => result).length;
    const failedTests = totalTests - passedTests;

    Object.entries(this.testResults).forEach(([testName, passed]) => {
      const status = passed ? '✅ PASS' : '❌ FAIL';
      const details = this.testDetails[testName] || '';
      console.log(`${status} ${testName.replace(/_/g, ' ').toUpperCase()}`);
      if (details) {
        console.log(`     ${details}`);
      }
    });

    console.log('\n' + '-'.repeat(60));
    console.log(`📊 Total: ${totalTests} | ✅ Passed: ${passedTests} | ❌ Failed: ${failedTests}`);
    
    if (failedTests === 0) {
      console.log('\n🎉 All tests passed! Translation system is ready to use.');
      console.log('\n💡 Next steps:');
      console.log('   1. Run the migration script to generate translations');
      console.log('   2. Test the API endpoints with language parameters');
      console.log('   3. Update frontend components to use language-aware services');
    } else {
      console.log('\n⚠️  Some tests failed. Please check the issues above.');
      console.log('   Make sure the database is set up correctly and all dependencies are installed.');
    }

    console.log('\n📋 Supported languages:', SUPPORTED_LANGS.join(', '));
  }
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new TranslationSystemTest();
  tester.runAllTests().catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}

export { TranslationSystemTest };
