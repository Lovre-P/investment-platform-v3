# Database Setup Guide

## After Installing PostgreSQL

### Step 1: Verify PostgreSQL Installation
```bash
psql --version
```

### Step 2: Connect to PostgreSQL
```bash
# Connect as postgres user
psql -U postgres

# Or if you set a different user during installation
psql -U your_username
```

### Step 3: Create Database (if needed)
```sql
-- In psql console
CREATE DATABASE megainvest_db;
\q
```

### Step 4: Update Backend Configuration
Edit `backend/.env` file with your PostgreSQL credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=megainvest_db
DB_USER=postgres
DB_PASSWORD=your_password_here
USE_MOCK_DB=false
```

### Step 5: Initialize Database
```bash
cd backend
npm run db:setup    # Creates database if it doesn't exist
npm run db:migrate  # Creates tables
npm run db:seed     # Adds sample data
```

### Step 6: Start Backend with Real Database
```bash
npm run dev
```

## Troubleshooting

### Connection Issues
- Make sure PostgreSQL service is running
- Check if port 5432 is available
- Verify username/password in .env file

### Permission Issues
- Make sure your user has permission to create databases
- Try connecting as 'postgres' superuser first

### Windows Service
- PostgreSQL should start automatically as a Windows service
- Check Services app (services.msc) for "postgresql" service

## Cloud Database Alternative

If local installation is problematic, use a cloud service:

### Supabase (Free)
1. Go to https://supabase.com/
2. Create account and new project
3. Get connection string from Settings > Database
4. Update .env with cloud credentials

### Neon (Free)
1. Go to https://neon.tech/
2. Create account and database
3. Copy connection string
4. Update .env file

Example cloud .env:
```env
DATABASE_URL=postgresql://username:password@host:5432/database
DB_HOST=your-cloud-host.com
DB_PORT=5432
DB_NAME=your_database
DB_USER=your_username
DB_PASSWORD=your_password
USE_MOCK_DB=false
```
