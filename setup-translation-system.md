# Investment Translation System Setup Guide

This guide will help you set up and test the complete multi-language investment translation system.

## Prerequisites

1. **Laragon with MySQL** - Ensure Laragon is installed and MySQL is available
2. **Node.js and npm** - For running the backend and frontend
3. **Database backup** - The backup file `backups/megainvest_db_20250814_123643.sql`

## Step 1: Start MySQL Database

1. **Start Laragon**:
   - Open Laragon application
   - Click "Start All" to start Apache and MySQL services
   - Verify MySQL is running on port 3306

2. **Restore Database Backup**:
   ```bash
   # Navigate to the project directory
   cd c:\Users\pet-r\Documents\AIS\codebench\mega-invest-v3

   # Restore the database using MySQL command line
   C:\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysql.exe -u root -p < backups\megainvest_db_20250814_123643.sql
   ```

3. **Verify Database Connection**:
   ```bash
   # Test connection
   C:\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysql.exe -u root -p -e "USE megainvest_db; SHOW TABLES;"
   ```

## Step 2: Create Translation Table

1. **Run the schema creation script**:
   ```bash
   # Connect to MySQL and run the schema
   C:\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysql.exe -u root -p megainvest_db < backend\src\database\investment_translations_schema.sql
   ```

2. **Verify table creation**:
   ```bash
   C:\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysql.exe -u root -p -e "USE megainvest_db; DESCRIBE investment_translations;"
   ```

## Step 3: Install Dependencies and Build

1. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Install frontend dependencies**:
   ```bash
   cd ..
   npm install
   ```

3. **Build the backend**:
   ```bash
   cd backend
   npm run build
   ```

## Step 4: Configure Environment

1. **Check backend environment variables** in `backend/.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=megainvest_db
   ```

2. **Update database connection** if needed based on your MySQL setup.

## Step 5: Run Translation Migration

1. **Start the backend server** (in one terminal):
   ```bash
   cd backend
   npm run dev
   ```

2. **Run the migration script** (in another terminal):
   ```bash
   cd backend
   npx tsx src/scripts/migrateInvestmentTranslations.ts
   ```

   This will:
   - Process all existing investments
   - Generate translations for hr, de, fr, it languages
   - Show progress and final report

## Step 6: Test the Translation System

### Backend API Testing

1. **Test English (default) endpoint**:
   ```bash
   curl "http://localhost:3001/api/investments"
   ```

2. **Test Croatian translations**:
   ```bash
   curl "http://localhost:3001/api/investments?lang=hr"
   ```

3. **Test German translations**:
   ```bash
   curl "http://localhost:3001/api/investments?lang=de"
   ```

4. **Test single investment with language**:
   ```bash
   # Replace {investment-id} with actual ID
   curl "http://localhost:3001/api/investments/{investment-id}?lang=hr"
   ```

### Frontend Testing

1. **Start the frontend** (in another terminal):
   ```bash
   npm run dev
   ```

2. **Test language switching**:
   - Open the application in browser
   - Use the language dropdown to switch between languages
   - Navigate to investment list and detail pages
   - Verify that investment content changes with language

### Database Verification

1. **Check translation records**:
   ```sql
   USE megainvest_db;
   
   -- Count translations by language
   SELECT lang, COUNT(*) as count 
   FROM investment_translations 
   GROUP BY lang;
   
   -- View sample translations
   SELECT i.title as original_title, t.title as translated_title, t.lang
   FROM investments i
   JOIN investment_translations t ON i.id = t.investment_id
   LIMIT 5;
   ```

## Step 7: Test New Investment Creation

1. **Create a new investment** through the frontend form
2. **Verify automatic translation generation** in the backend logs
3. **Check database** for new translation records
4. **Test the new investment** in different languages

## Step 8: Test Investment Updates

1. **Update an existing investment** through admin panel
2. **Verify translation updates** in backend logs
3. **Check that machine translations are updated** but human translations are preserved

## Troubleshooting

### MySQL Connection Issues
- Ensure Laragon is running
- Check MySQL service status
- Verify port 3306 is not blocked
- Check database credentials in .env file

### Translation Generation Issues
- Check backend logs for error messages
- Verify investment_translations table exists
- Ensure all required fields are present in source data

### Frontend Language Issues
- Check browser console for errors
- Verify i18n configuration
- Ensure language parameter is being passed to API calls

### Performance Issues
- Monitor database query performance
- Check translation service response times
- Consider adding database indexes if needed

## Next Steps

1. **Replace mock translation service** with real translation API (Google Translate, DeepL, etc.)
2. **Add human translation workflow** for quality improvements
3. **Implement SEO optimizations** using translated meta tags and slugs
4. **Add translation management interface** for admins
5. **Set up automated translation updates** for content changes

## File Structure

```
backend/
├── src/
│   ├── database/
│   │   └── investment_translations_schema.sql
│   ├── models/
│   │   └── Investment.ts (updated with translation support)
│   ├── services/
│   │   └── translationService.ts
│   ├── controllers/
│   │   └── investmentController.ts (updated with lang parameter)
│   └── scripts/
│       └── migrateInvestmentTranslations.ts
src/
├── hooks/
│   └── useLanguage.ts
└── services/
    └── investmentService.ts (updated with lang parameter)
```

## Support

If you encounter any issues during setup:
1. Check the console logs for detailed error messages
2. Verify all prerequisites are met
3. Ensure database connection is working
4. Review the troubleshooting section above
