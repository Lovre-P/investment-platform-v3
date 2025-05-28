# MySQL Setup Guide for MegaInvest Backend

## ✅ **Backend Successfully Converted to MySQL!**

Your backend has been fully converted from PostgreSQL to MySQL and is ready to use with any MySQL database.

## **🚀 Quick Start Options**

### **Option 1: Local MySQL Installation**

#### **Windows:**
1. **Download MySQL**: https://dev.mysql.com/downloads/mysql/
2. **Install MySQL Community Server**
3. **During installation, remember your root password**
4. **MySQL will run as a Windows service automatically**

#### **Verify Installation:**
```bash
mysql --version
```

#### **Connect to MySQL:**
```bash
mysql -u root -p
```

### **Option 2: XAMPP (Easiest for Windows)**

1. **Download XAMPP**: https://www.apachefriends.org/download.html
2. **Install XAMPP**
3. **Start MySQL from XAMPP Control Panel**
4. **Default credentials**: `root` with no password

### **Option 3: Cloud MySQL (Recommended for Production)**

#### **PlanetScale (Free Tier)**
1. Go to: https://planetscale.com/
2. Create account and database
3. Get connection string
4. Update `.env` file

#### **Railway (Free Tier)**
1. Go to: https://railway.app/
2. Create MySQL database
3. Get connection details
4. Update `.env` file

#### **AWS RDS, Google Cloud SQL, etc.**
- Follow provider's MySQL setup guide
- Get connection details
- Update `.env` file

## **⚙️ Configuration**

### **Update Environment Variables**

Edit `backend/.env`:

```env
# For Local MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=megainvest_db
DB_USER=root
DB_PASSWORD=your_mysql_password
USE_MOCK_DB=false

# For Cloud MySQL (example)
DB_HOST=your-cloud-host.com
DB_PORT=3306
DB_NAME=your_database_name
DB_USER=your_username
DB_PASSWORD=your_password
USE_MOCK_DB=false
```

### **Database Setup Commands**

```bash
# Navigate to backend
cd backend

# Create database (if needed)
npm run db:setup

# Create tables
npm run db:migrate

# Add sample data
npm run db:seed

# Start backend
npm run dev
```

## **🔧 Manual Database Setup**

If automatic setup doesn't work, you can create the database manually:

### **1. Connect to MySQL:**
```bash
mysql -u root -p
```

### **2. Create Database:**
```sql
CREATE DATABASE megainvest_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE megainvest_db;
```

### **3. Create Tables:**
```sql
-- Copy and paste the contents of backend/src/database/schema.sql
```

### **4. Exit MySQL:**
```sql
EXIT;
```

### **5. Run Seed Script:**
```bash
npm run db:seed
```

## **🌐 Hosting Provider Examples**

### **Shared Hosting (cPanel)**
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=yourusername_megainvest
DB_USER=yourusername_dbuser
DB_PASSWORD=your_password
```

### **VPS/Dedicated Server**
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=megainvest_db
DB_USER=megainvest_user
DB_PASSWORD=secure_password
```

### **Cloud Providers**
```env
# Example for cloud database
DB_HOST=mysql-cluster.example.com
DB_PORT=3306
DB_NAME=megainvest_production
DB_USER=app_user
DB_PASSWORD=secure_cloud_password
```

## **🔍 Testing Your Setup**

### **1. Test Database Connection:**
```bash
npm run db:test
```

### **2. Test API Endpoints:**
```bash
# Health check
curl http://localhost:3001/health

# Get investments
curl http://localhost:3001/api/investments

# Login test
curl -X POST -H "Content-Type: application/json" \
  -d '{"email":"admin@megainvest.com","password":"admin123"}' \
  http://localhost:3001/api/auth/login
```

## **📊 Database Schema**

Your MySQL database includes:

- **users** - User accounts with authentication
- **investments** - Investment opportunities
- **leads** - Contact form submissions
- **Indexes** - Optimized for performance
- **JSON fields** - For arrays (images, tags)

## **🔒 Security Notes**

### **Production Checklist:**
- [ ] Use strong database passwords
- [ ] Enable SSL/TLS for database connections
- [ ] Restrict database access to application server only
- [ ] Regular database backups
- [ ] Monitor database performance
- [ ] Use environment variables for credentials

### **Development vs Production:**
```env
# Development
USE_MOCK_DB=true  # For testing without database

# Production
USE_MOCK_DB=false # Use real MySQL database
```

## **🚨 Troubleshooting**

### **Connection Issues:**
- Check if MySQL service is running
- Verify credentials in `.env` file
- Check firewall settings
- Ensure database exists

### **Permission Issues:**
- Grant proper privileges to database user
- Check MySQL user permissions
- Verify database name spelling

### **Common Errors:**
- `ECONNREFUSED`: MySQL not running
- `Access denied`: Wrong credentials
- `Unknown database`: Database doesn't exist
- `Table doesn't exist`: Run migrations

## **📈 Performance Tips**

- Use connection pooling (already configured)
- Add indexes for frequently queried fields
- Monitor slow queries
- Regular database maintenance
- Consider read replicas for high traffic

## **🎉 You're Ready!**

Your backend now supports MySQL and is ready for production deployment with any hosting provider that supports MySQL!
