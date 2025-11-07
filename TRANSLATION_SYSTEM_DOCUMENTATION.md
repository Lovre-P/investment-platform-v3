# Investment Translation System Documentation

## Overview

The Investment Translation System provides multi-language support for investment data while maintaining the existing English database as the source of truth. The system supports Croatian (hr), German (de), French (fr), and Italian (it) translations.

## Architecture

### Database Design

**Primary Table: `investments`**
- Remains unchanged as the English source of truth
- Contains all original investment data

**Translation Table: `investment_translations`**
- Stores translated versions of investment data
- One row per investment per language
- Includes quality flags and change tracking

### Key Components

1. **TranslationService** - Handles translation generation and management
2. **Investment Model** - Extended with language parameter support
3. **API Endpoints** - Accept optional `lang` parameter
4. **Frontend Hook** - `useLanguage` for language-aware API calls

## Database Schema

```sql
CREATE TABLE investment_translations (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    investment_id VARCHAR(36) NOT NULL,
    lang VARCHAR(5) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    tags JSON DEFAULT ('[]'),
    meta_title VARCHAR(255),
    meta_description TEXT,
    slug VARCHAR(255),
    quality ENUM('mt', 'human') NOT NULL DEFAULT 'mt',
    source_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (investment_id) REFERENCES investments(id) ON DELETE CASCADE,
    UNIQUE KEY unique_investment_lang (investment_id, lang)
);
```

## API Usage

### List Investments with Language

```bash
# English (default)
GET /api/investments

# Croatian
GET /api/investments?lang=hr

# German with filters
GET /api/investments?lang=de&status=Open&category=Technology
```

### Get Single Investment with Language

```bash
# English (default)
GET /api/investments/{id}

# Croatian
GET /api/investments/{id}?lang=hr
```

### Response Format

The API returns the same structure regardless of language, with translated content merged in:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Translated Title",
    "description": "Translated Description",
    "longDescription": "Translated Long Description",
    "category": "Translated Category",
    "tags": ["translated", "tags"],
    // ... other fields remain unchanged
  }
}
```

## Translation Workflow

### For New Investments

1. Investment created in English
2. `TranslationService.createTranslationsForInvestment()` called automatically
3. Translations generated for all supported languages
4. Stored with `quality='mt'` and source hash

### For Updated Investments

1. English content updated
2. `TranslationService.updateTranslationsIfNeeded()` called
3. Source hash compared to detect changes
4. Only machine translations (`quality='mt'`) are updated
5. Human translations (`quality='human'`) are preserved

### For Existing Data

Use the migration script to process existing investments:

```bash
npm run translations:migrate
```

## Frontend Integration

### Using the Language Hook

```typescript
import { useLanguage } from '../hooks/useLanguage';
import { getInvestments, getInvestmentById } from '../services/investmentService';

function InvestmentList() {
  const { addLanguageToFilters, getLanguageParam } = useLanguage();
  
  // Automatically adds language parameter if needed
  const filters = addLanguageToFilters({ status: 'Open' });
  const investments = await getInvestments(filters);
  
  // For single investment
  const investment = await getInvestmentById(id, getLanguageParam());
}
```

### Service Layer Updates

The investment service now accepts language parameters:

```typescript
// Updated function signatures
getInvestments(filters?: InvestmentFilters): Promise<Investment[]>
getInvestmentById(id: string, lang?: string): Promise<Investment | undefined>

// InvestmentFilters now includes lang
interface InvestmentFilters {
  status?: InvestmentStatus;
  category?: string;
  lang?: string;
}
```

## Translation Quality Management

### Quality Levels

- **`mt` (Machine Translated)**: Auto-generated translations
- **`human` (Human Reviewed)**: Manually reviewed/edited translations

### Updating Translation Quality

```sql
-- Mark a translation as human-reviewed
UPDATE investment_translations 
SET quality = 'human' 
WHERE investment_id = 'uuid' AND lang = 'hr';
```

### Change Detection

The system uses SHA256 hashes of source content to detect changes:

```typescript
const sourceHash = TranslationService.generateSourceHash({
  title, description, longDescription, category, tags
});
```

When source content changes:
- New hash is generated
- Only `mt` translations are updated
- `human` translations are preserved

## Maintenance Procedures

### Adding New Languages

1. Add language code to `SUPPORTED_LANGS` in `i18n.ts`
2. Add translations to i18n resources
3. Run migration script to generate translations for existing data

### Monitoring Translation Quality

```sql
-- Check translation coverage
SELECT 
  lang,
  COUNT(*) as total_translations,
  SUM(CASE WHEN quality = 'human' THEN 1 ELSE 0 END) as human_reviewed,
  SUM(CASE WHEN quality = 'mt' THEN 1 ELSE 0 END) as machine_translated
FROM investment_translations 
GROUP BY lang;

-- Find investments without translations
SELECT i.id, i.title 
FROM investments i 
LEFT JOIN investment_translations t ON i.id = t.investment_id 
WHERE t.id IS NULL;
```

### Performance Optimization

The system includes indexes for optimal performance:

```sql
INDEX idx_investment_id (investment_id)
INDEX idx_lang (lang)
INDEX idx_quality (quality)
INDEX idx_source_hash (source_hash)
```

## Testing

### Running Tests

```bash
# Test translation system
npm run translations:test

# Run unit tests
npm test

# Run migration
npm run translations:migrate
```

### Manual Testing

1. **API Endpoints**: Test with different `lang` parameters
2. **Fallback Behavior**: Test with unsupported languages
3. **New Investments**: Verify automatic translation generation
4. **Updates**: Verify selective translation updates

## Troubleshooting

### Common Issues

**Translations not appearing**
- Check if migration script was run
- Verify `investment_translations` table exists
- Check for errors in backend logs

**Performance issues**
- Monitor database query performance
- Check if indexes are present
- Consider caching for frequently accessed translations

**Translation quality**
- Review machine translations for accuracy
- Mark important translations as `human` reviewed
- Consider implementing translation review workflow

### Debugging

```sql
-- Check translation status for specific investment
SELECT * FROM investment_translations 
WHERE investment_id = 'your-investment-id';

-- Check source hash consistency
SELECT DISTINCT source_hash, COUNT(*) 
FROM investment_translations 
WHERE investment_id = 'your-investment-id'
GROUP BY source_hash;
```

## Future Enhancements

1. **Real Translation API**: Replace mock translation with Google Translate/DeepL
2. **Translation Management UI**: Admin interface for managing translations
3. **SEO Optimization**: Use translated slugs and meta tags
4. **Caching**: Implement translation caching for better performance
5. **Batch Operations**: Bulk translation management tools

## File Structure

```
backend/src/
├── database/
│   └── investment_translations_schema.sql
├── models/
│   └── Investment.ts (updated)
├── services/
│   └── translationService.ts
├── controllers/
│   └── investmentController.ts (updated)
├── scripts/
│   ├── migrateInvestmentTranslations.ts
│   └── testTranslationSystem.ts
└── tests/
    └── translationService.test.ts

src/
├── hooks/
│   └── useLanguage.ts
├── services/
│   └── investmentService.ts (updated)
└── tests/
    └── useLanguage.test.ts
```

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review backend logs for error messages
3. Verify database schema and data integrity
4. Test with the provided test scripts
