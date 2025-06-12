# Railway Complete Setup Guide for MegaInvest

Railway detected your frontend automatically, but you need to set up the backend and database separately. Here's how to do it:

## 🚂 **Current Situation**
- ✅ Frontend is deployed and working
- ❌ Backend is not deployed yet
- ❌ Database is not set up yet

## 🎯 **What You Need to Do**

### Step 1: Add MySQL Database Service

1. **Go to your Railway project dashboard**
2. **Click "New Service" → "Database" → "MySQL"**
3. **Railway will automatically create a MySQL database**
4. **Note the connection details** (Railway provides these automatically)

### Step 2: Add Backend Service

1. **In your Railway project, click "New Service" → "GitHub Repo"**
2. **Select the same repository** (mega-invest-v3)
3. **Configure the backend service:**
   ```
   Service Name: mega-invest-backend
   Root Directory: backend
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

### Step 3: Configure Environment Variables

#### For Backend Service:
Go to your backend service → Variables tab and add:

```bash
# Server Configuration
NODE_ENV=production
PORT=$PORT

# Database Configuration (Railway provides these automatically)
DATABASE_URL=${{MySQL.DATABASE_URL}}
DB_HOST=${{MySQL.MYSQL_HOST}}
DB_PORT=${{MySQL.MYSQL_PORT}}
DB_NAME=${{MySQL.MYSQL_DATABASE}}
DB_USER=${{MySQL.MYSQL_USER}}
DB_PASSWORD=${{MySQL.MYSQL_PASSWORD}}

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long-change-this
JWT_EXPIRES_IN=24h

# CORS Configuration
FRONTEND_URL=${{Frontend.RAILWAY_PUBLIC_DOMAIN}}

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
```

#### For Frontend Service:
Go to your frontend service → Variables tab and add:

```bash
VITE_API_URL=${{Backend.RAILWAY_PUBLIC_DOMAIN}}
```

### Step 4: Initialize Database

After backend deployment, you need to initialize your database:

1. **Go to backend service → Deploy logs**
2. **Check if database connection is successful**
3. **If you need to run migrations, use Railway's console:**
   - Click on backend service
   - Go to "Console" tab
   - Run: `npm run db:init`

## 🔧 **Alternative: Monorepo Approach**

If you want everything in one service, you can create a combined deployment:

### Option A: Create a startup script

Create `start-all.js` in your root directory:

```javascript
import { spawn } from 'child_process';
import path from 'path';

// Start backend
const backend = spawn('npm', ['start'], {
  cwd: path.join(process.cwd(), 'backend'),
  stdio: 'inherit'
});

// Start frontend (for development, in production you'd serve static files)
const frontend = spawn('npm', ['run', 'preview'], {
  stdio: 'inherit'
});

process.on('SIGINT', () => {
  backend.kill();
  frontend.kill();
  process.exit();
});
```

### Option B: Serve frontend from backend

Modify your backend to serve the frontend build files:

1. **Build frontend first**
2. **Serve static files from Express**

## 🎯 **Recommended Approach: Separate Services**

I recommend using **separate services** because:

1. **Better resource allocation**
2. **Independent scaling**
3. **Easier debugging**
4. **Railway's strength** is managing multiple services

## 🔍 **Troubleshooting**

### If Backend Won't Start:
1. Check build logs for errors
2. Verify all environment variables are set
3. Make sure database is connected
4. Check if PORT is properly configured

### If Database Connection Fails:
1. Verify DATABASE_URL format
2. Check if database service is running
3. Ensure backend can reach database

### If Frontend Can't Reach Backend:
1. Verify VITE_API_URL is set correctly
2. Check CORS configuration in backend
3. Ensure both services are deployed

## 📊 **Expected Architecture**

```
Railway Project: mega-invest-v3
├── 📱 Frontend Service (Static Site)
│   ├── Build: npm install && npm run build
│   ├── Serve: Static files from /dist
│   └── Domain: https://frontend-xxx.railway.app
│
├── 🔧 Backend Service (Web Service)
│   ├── Build: npm install && npm run build
│   ├── Start: npm start
│   └── Domain: https://backend-xxx.railway.app
│
└── 🗄️ MySQL Database
    ├── Auto-managed by Railway
    └── Connection via environment variables
```

## 💰 **Cost Estimation**

With Railway's $5 monthly credit:
- Frontend: ~$0-1/month (static hosting)
- Backend: ~$3-4/month (web service)
- Database: ~$1-2/month (MySQL)

**Total: Should fit within $5 credit for development/testing**

## 🚀 **Next Steps**

1. **Add MySQL database** to your Railway project
2. **Add backend service** with proper configuration
3. **Set environment variables** for both services
4. **Test the complete application**
5. **Initialize database** with your schema and seed data

## 🆘 **Need Help?**

If you run into issues:
1. Check Railway's deployment logs
2. Verify environment variables
3. Test database connection
4. Check service-to-service communication

Railway's dashboard provides excellent logging and monitoring to help debug any issues.
