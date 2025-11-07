import crypto from 'crypto';
import { pool } from '../database/config.js';

// Supported languages - copied from i18n.ts to avoid import issues
export const SUPPORTED_LANGS = ['en', 'hr', 'de', 'fr', 'it'] as const;

export interface TranslatableContent {
  title: string;
  description: string;
  longDescription: string;
  category: string;
  tags: string[];
}

export interface TranslatedContent extends TranslatableContent {
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
}

export interface TranslationRecord {
  id: string;
  investmentId: string;
  lang: string;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
  quality: 'mt' | 'human';
  sourceHash: string;
  createdAt: string;
  updatedAt: string;
}

export class TranslationService {
  /**
   * Generate a hash of the source content to detect changes
   */
  static generateSourceHash(content: TranslatableContent): string {
    const sourceString = JSON.stringify({
      title: content.title,
      description: content.description,
      longDescription: content.longDescription,
      category: content.category,
      tags: content.tags.sort() // Sort tags for consistent hashing
    });
    
    return crypto.createHash('sha256').update(sourceString).digest('hex');
  }

  /**
   * Mock translation function - replace with actual translation service
   * For now, returns the same content with language prefix for testing
   */
  static async translateContent(
    content: TranslatableContent, 
    targetLang: string
  ): Promise<TranslatedContent> {
    // TODO: Replace with actual translation service (Google Translate, DeepL, etc.)
    // For now, we'll use a mock implementation
    
    if (targetLang === 'en') {
      return {
        ...content,
        metaTitle: content.title,
        metaDescription: content.description,
        slug: this.generateSlug(content.title)
      };
    }

    // Mock translation - in real implementation, call translation API
    const langPrefix = `[${targetLang.toUpperCase()}]`;
    
    return {
      title: `${langPrefix} ${content.title}`,
      description: `${langPrefix} ${content.description}`,
      longDescription: `${langPrefix} ${content.longDescription}`,
      category: `${langPrefix} ${content.category}`,
      tags: content.tags.map(tag => `${langPrefix} ${tag}`),
      metaTitle: `${langPrefix} ${content.title}`,
      metaDescription: `${langPrefix} ${content.description}`,
      slug: this.generateSlug(`${langPrefix} ${content.title}`)
    };
  }

  /**
   * Generate URL-friendly slug from title
   */
  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  }

  /**
   * Create translations for an investment in all supported languages
   */
  static async createTranslationsForInvestment(
    investmentId: string,
    sourceContent: TranslatableContent
  ): Promise<void> {
    const sourceHash = this.generateSourceHash(sourceContent);
    
    // Get supported languages excluding English (source language)
    const targetLanguages = SUPPORTED_LANGS.filter(lang => lang !== 'en');
    
    for (const lang of targetLanguages) {
      try {
        const translatedContent = await this.translateContent(sourceContent, lang);
        
        await pool.execute(`
          INSERT INTO investment_translations (
            investment_id, lang, title, description, long_description,
            category, tags, meta_title, meta_description, slug,
            quality, source_hash
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'mt', ?)
          ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            description = VALUES(description),
            long_description = VALUES(long_description),
            category = VALUES(category),
            tags = VALUES(tags),
            meta_title = VALUES(meta_title),
            meta_description = VALUES(meta_description),
            slug = VALUES(slug),
            source_hash = VALUES(source_hash),
            updated_at = CURRENT_TIMESTAMP
        `, [
          investmentId,
          lang,
          translatedContent.title,
          translatedContent.description,
          translatedContent.longDescription,
          translatedContent.category,
          JSON.stringify(translatedContent.tags),
          translatedContent.metaTitle,
          translatedContent.metaDescription,
          translatedContent.slug,
          sourceHash
        ]);
        
        console.log(`✅ Created/updated ${lang} translation for investment ${investmentId}`);
      } catch (error) {
        console.error(`❌ Failed to create ${lang} translation for investment ${investmentId}:`, error);
      }
    }
  }

  /**
   * Update translations when source content changes
   */
  static async updateTranslationsIfNeeded(
    investmentId: string,
    newSourceContent: TranslatableContent
  ): Promise<void> {
    const newSourceHash = this.generateSourceHash(newSourceContent);
    
    // Check if source content has changed
    const [existingTranslations] = await pool.execute(`
      SELECT DISTINCT source_hash FROM investment_translations 
      WHERE investment_id = ? LIMIT 1
    `, [investmentId]);
    
    if (Array.isArray(existingTranslations) && existingTranslations.length > 0) {
      const existingHash = (existingTranslations[0] as any).source_hash;
      
      if (existingHash === newSourceHash) {
        console.log(`📝 No changes detected for investment ${investmentId}, skipping translation update`);
        return;
      }
    }
    
    console.log(`🔄 Source content changed for investment ${investmentId}, updating machine translations`);
    
    // Update only machine translations, preserve human translations
    const targetLanguages = SUPPORTED_LANGS.filter(lang => lang !== 'en');
    
    for (const lang of targetLanguages) {
      try {
        // Check if this is a human translation
        const [humanCheck] = await pool.execute(`
          SELECT quality FROM investment_translations 
          WHERE investment_id = ? AND lang = ?
        `, [investmentId, lang]);
        
        if (Array.isArray(humanCheck) && humanCheck.length > 0) {
          const quality = (humanCheck[0] as any).quality;
          if (quality === 'human') {
            console.log(`👤 Preserving human translation for ${lang} (investment ${investmentId})`);
            continue;
          }
        }
        
        const translatedContent = await this.translateContent(newSourceContent, lang);
        
        await pool.execute(`
          INSERT INTO investment_translations (
            investment_id, lang, title, description, long_description,
            category, tags, meta_title, meta_description, slug,
            quality, source_hash
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'mt', ?)
          ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            description = VALUES(description),
            long_description = VALUES(long_description),
            category = VALUES(category),
            tags = VALUES(tags),
            meta_title = VALUES(meta_title),
            meta_description = VALUES(meta_description),
            slug = VALUES(slug),
            source_hash = VALUES(source_hash),
            updated_at = CURRENT_TIMESTAMP
        `, [
          investmentId,
          lang,
          translatedContent.title,
          translatedContent.description,
          translatedContent.longDescription,
          translatedContent.category,
          JSON.stringify(translatedContent.tags),
          translatedContent.metaTitle,
          translatedContent.metaDescription,
          translatedContent.slug,
          newSourceHash
        ]);
        
        console.log(`🔄 Updated ${lang} machine translation for investment ${investmentId}`);
      } catch (error) {
        console.error(`❌ Failed to update ${lang} translation for investment ${investmentId}:`, error);
      }
    }
  }

  /**
   * Get translation for a specific investment and language
   */
  static async getTranslation(
    investmentId: string,
    lang: string
  ): Promise<TranslationRecord | null> {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          id, investment_id as investmentId, lang, title, description,
          long_description as longDescription, category, tags,
          meta_title as metaTitle, meta_description as metaDescription,
          slug, quality, source_hash as sourceHash,
          created_at as createdAt, updated_at as updatedAt
        FROM investment_translations
        WHERE investment_id = ? AND lang = ?
      `, [investmentId, lang]);
      
      if (Array.isArray(rows) && rows.length > 0) {
        const row = rows[0] as any;
        return {
          ...row,
          tags: JSON.parse(row.tags || '[]')
        };
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching translation for investment ${investmentId}, lang ${lang}:`, error);
      return null;
    }
  }

  /**
   * Get all translations for an investment
   */
  static async getAllTranslations(investmentId: string): Promise<TranslationRecord[]> {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          id, investment_id as investmentId, lang, title, description,
          long_description as longDescription, category, tags,
          meta_title as metaTitle, meta_description as metaDescription,
          slug, quality, source_hash as sourceHash,
          created_at as createdAt, updated_at as updatedAt
        FROM investment_translations
        WHERE investment_id = ?
        ORDER BY lang
      `, [investmentId]);
      
      if (Array.isArray(rows)) {
        return rows.map((row: any) => ({
          ...row,
          tags: JSON.parse(row.tags || '[]')
        }));
      }
      
      return [];
    } catch (error) {
      console.error(`Error fetching translations for investment ${investmentId}:`, error);
      return [];
    }
  }
}
