#!/usr/bin/env node

/**
 * Migration script to generate translations for existing investments
 * 
 * This script:
 * 1. Fetches all existing investments from the database
 * 2. Generates translations for each investment in all supported languages
 * 3. Stores the translations in the investment_translations table
 * 4. Provides progress tracking and error handling
 * 
 * Usage: npm run migrate:translations
 */

import { pool } from '../database/config.js';
import { TranslationService, SUPPORTED_LANGS } from '../services/translationService.js';

interface InvestmentRecord {
  id: string;
  title: string;
  description: string;
  long_description: string;
  category: string;
  tags: string;
}

class TranslationMigration {
  private totalInvestments = 0;
  private processedInvestments = 0;
  private successfulTranslations = 0;
  private failedTranslations = 0;
  private startTime = Date.now();

  /**
   * Main migration function
   */
  async run(): Promise<void> {
    console.log('🚀 Starting investment translation migration...');
    console.log(`📋 Target languages: ${SUPPORTED_LANGS.filter(lang => lang !== 'en').join(', ')}`);
    
    try {
      // First, ensure the translations table exists
      await this.ensureTranslationsTableExists();
      
      // Get all existing investments
      const investments = await this.getAllInvestments();
      this.totalInvestments = investments.length;
      
      if (this.totalInvestments === 0) {
        console.log('ℹ️  No investments found to migrate.');
        return;
      }
      
      console.log(`📊 Found ${this.totalInvestments} investments to process`);
      
      // Process each investment
      for (const investment of investments) {
        await this.processInvestment(investment);
        this.processedInvestments++;
        
        // Show progress every 10 investments or at the end
        if (this.processedInvestments % 10 === 0 || this.processedInvestments === this.totalInvestments) {
          this.showProgress();
        }
      }
      
      this.showFinalReport();
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    } finally {
      await pool.end();
    }
  }

  /**
   * Ensure the investment_translations table exists
   */
  private async ensureTranslationsTableExists(): Promise<void> {
    try {
      await pool.execute(`
        SELECT 1 FROM investment_translations LIMIT 1
      `);
      console.log('✅ investment_translations table exists');
    } catch (error) {
      console.log('⚠️  investment_translations table not found. Please run the schema creation script first.');
      console.log('   You can find the schema in: backend/src/database/investment_translations_schema.sql');
      throw new Error('investment_translations table does not exist');
    }
  }

  /**
   * Get all investments from the database
   */
  private async getAllInvestments(): Promise<InvestmentRecord[]> {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          id, title, description, long_description, category, tags
        FROM investments
        ORDER BY created_at ASC
      `);
      
      return (rows as any[]).map(row => ({
        ...row,
        tags: typeof row.tags === 'string' ? row.tags : JSON.stringify(row.tags || [])
      }));
    } catch (error) {
      console.error('Failed to fetch investments:', error);
      throw error;
    }
  }

  /**
   * Process a single investment
   */
  private async processInvestment(investment: InvestmentRecord): Promise<void> {
    try {
      console.log(`\n🔄 Processing: ${investment.title} (ID: ${investment.id})`);
      
      // Parse tags
      let tags: string[] = [];
      try {
        tags = JSON.parse(investment.tags);
      } catch {
        // If parsing fails, treat as empty array
        tags = [];
      }
      
      // Check if translations already exist
      const existingTranslations = await this.checkExistingTranslations(investment.id);
      if (existingTranslations.length > 0) {
        console.log(`   ⏭️  Skipping - translations already exist for languages: ${existingTranslations.join(', ')}`);
        return;
      }
      
      // Create translations
      await TranslationService.createTranslationsForInvestment(investment.id, {
        title: investment.title,
        description: investment.description,
        longDescription: investment.long_description,
        category: investment.category,
        tags: tags
      });
      
      this.successfulTranslations++;
      console.log(`   ✅ Successfully created translations`);
      
    } catch (error) {
      this.failedTranslations++;
      console.error(`   ❌ Failed to process investment ${investment.id}:`, error);
    }
  }

  /**
   * Check if translations already exist for an investment
   */
  private async checkExistingTranslations(investmentId: string): Promise<string[]> {
    try {
      const [rows] = await pool.execute(`
        SELECT DISTINCT lang FROM investment_translations 
        WHERE investment_id = ?
      `, [investmentId]);
      
      return (rows as any[]).map(row => row.lang);
    } catch (error) {
      console.error('Failed to check existing translations:', error);
      return [];
    }
  }

  /**
   * Show progress during migration
   */
  private showProgress(): void {
    const percentage = Math.round((this.processedInvestments / this.totalInvestments) * 100);
    const elapsed = Math.round((Date.now() - this.startTime) / 1000);
    
    console.log(`\n📈 Progress: ${this.processedInvestments}/${this.totalInvestments} (${percentage}%) - ${elapsed}s elapsed`);
    console.log(`   ✅ Successful: ${this.successfulTranslations} | ❌ Failed: ${this.failedTranslations}`);
  }

  /**
   * Show final migration report
   */
  private showFinalReport(): void {
    const totalTime = Math.round((Date.now() - this.startTime) / 1000);
    const targetLanguages = SUPPORTED_LANGS.filter(lang => lang !== 'en');
    const expectedTranslations = this.totalInvestments * targetLanguages.length;
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 MIGRATION COMPLETED');
    console.log('='.repeat(60));
    console.log(`📊 Total investments processed: ${this.processedInvestments}`);
    console.log(`✅ Successful translations: ${this.successfulTranslations}`);
    console.log(`❌ Failed translations: ${this.failedTranslations}`);
    console.log(`🌐 Target languages: ${targetLanguages.join(', ')}`);
    console.log(`⏱️  Total time: ${totalTime} seconds`);
    console.log(`📈 Success rate: ${Math.round((this.successfulTranslations / Math.max(this.processedInvestments, 1)) * 100)}%`);
    
    if (this.failedTranslations > 0) {
      console.log('\n⚠️  Some translations failed. Check the logs above for details.');
      console.log('   You can re-run this script to retry failed translations.');
    } else {
      console.log('\n🎊 All translations completed successfully!');
    }
    
    console.log('\n💡 Next steps:');
    console.log('   1. Test the API endpoints with ?lang=hr, ?lang=de, etc.');
    console.log('   2. Update the frontend to pass language parameters');
    console.log('   3. Review and improve machine translations as needed');
  }
}

// Run the migration if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const migration = new TranslationMigration();
  migration.run().catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
}

export { TranslationMigration };
