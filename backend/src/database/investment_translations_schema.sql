-- Investment Translations Table Schema
-- This table stores translated versions of investment data for multi-language support

CREATE TABLE IF NOT EXISTS investment_translations (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    investment_id VARCHAR(36) NOT NULL,
    lang VARCHAR(5) NOT NULL,
    
    -- Translated content fields
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    tags JSON DEFAULT ('[]'),
    
    -- SEO fields for localized URLs and meta data
    meta_title VARCHAR(255),
    meta_description TEXT,
    slug VARCHAR(255),
    
    -- Translation quality and change tracking
    quality ENUM('mt', 'human') NOT NULL DEFAULT 'mt',
    source_hash VARCHAR(64) NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    FOREIGN KEY (investment_id) REFERENCES investments(id) ON DELETE CASCADE,
    
    -- Unique constraint to ensure one translation per investment per language
    UNIQUE KEY unique_investment_lang (investment_id, lang),
    
    -- Indexes for performance
    INDEX idx_investment_id (investment_id),
    INDEX idx_lang (lang),
    INDEX idx_quality (quality),
    INDEX idx_source_hash (source_hash),
    INDEX idx_slug (slug),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add comments for documentation
ALTER TABLE investment_translations 
COMMENT = 'Stores translated versions of investment data for multi-language support';

ALTER TABLE investment_translations 
MODIFY COLUMN investment_id VARCHAR(36) NOT NULL COMMENT 'Reference to the original investment record',
MODIFY COLUMN lang VARCHAR(5) NOT NULL COMMENT 'Language code (en, hr, de, fr, it)',
MODIFY COLUMN title VARCHAR(255) NOT NULL COMMENT 'Translated investment title',
MODIFY COLUMN description TEXT NOT NULL COMMENT 'Translated short description',
MODIFY COLUMN long_description TEXT NOT NULL COMMENT 'Translated detailed description',
MODIFY COLUMN category VARCHAR(100) NOT NULL COMMENT 'Translated category name',
MODIFY COLUMN tags JSON DEFAULT ('[]') COMMENT 'Translated tags as JSON array',
MODIFY COLUMN meta_title VARCHAR(255) COMMENT 'SEO meta title for this language',
MODIFY COLUMN meta_description TEXT COMMENT 'SEO meta description for this language',
MODIFY COLUMN slug VARCHAR(255) COMMENT 'URL-friendly slug for this language',
MODIFY COLUMN quality ENUM('mt', 'human') NOT NULL DEFAULT 'mt' COMMENT 'Translation quality: mt=machine translated, human=human reviewed',
MODIFY COLUMN source_hash VARCHAR(64) NOT NULL COMMENT 'Hash of source English content to detect changes';
