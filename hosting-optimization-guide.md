# Hosting Optimization Guide - Jeftiniji Hosting za MegaInvest

## Trenutna situacija
- Node.js/TypeScript backend sa Express.js
- React frontend sa Vite
- MySQL baza podataka
- JWT autentifikacija

## Problem sa MyDataKnox Standard Hosting
❌ **KNOX XXL paket NEĆE RADITI** - podržava samo PHP, ne Node.js

## Preporučene jeftine opcije

### 1. Hetzner Cloud (NAJBOLJA OPCIJA) 🏆
**Cijena: €3.79/mjesečno**
- CX22: 2 vCPU, 4GB RAM, 40GB SSD
- Lokacija: Njemačka (EU GDPR)
- Uključuje: 20TB prometa
- Setup: Ubuntu + Node.js + MySQL + Nginx

### 2. Kombinacija besplatnih servisa
**Cijena: €0-5/mjesečno**

#### Frontend (React):
- **Netlify** - besplatno (100GB bandwidth)
- **Vercel** - besplatno (100GB bandwidth)  
- **GitHub Pages** - besplatno

#### Backend (Node.js):
- **Railway.app** - besplatno do $5/mjesečno
- **Render.com** - besplatno tier
- **Fly.io** - besplatno tier

#### Baza podataka:
- **PlanetScale** - besplatno tier (1GB)
- **Supabase** - besplatno tier (500MB)
- **MongoDB Atlas** - besplatno tier (512MB)

### 3. Modifikacije aplikacije za jeftiniji hosting

#### A) Prebacivanje na SQLite
```javascript
// Umjesto MySQL, koristiti SQLite za manje aplikacije
// package.json
"dependencies": {
  "sqlite3": "^5.1.6",
  "better-sqlite3": "^8.7.0"
}
```

#### B) Serverless funkcije
```javascript
// Prebaciti backend na serverless funkcije
// Vercel API routes ili Netlify Functions
// /api/auth/login.js
export default function handler(req, res) {
  // JWT login logika
}
```

#### C) Static Site Generation
```javascript
// Prebaciti na Next.js sa SSG
// Generirati statičke stranice
npm install next react react-dom
```

## Implementacija jeftine opcije

### Korak 1: Hetzner Cloud setup
```bash
# 1. Kreiraj Hetzner Cloud server (€3.79/mjesečno)
# 2. SSH na server
ssh root@your-server-ip

# 3. Instaliraj potrebne pakete
apt update
apt install -y nodejs npm nginx mysql-server

# 4. Setup MySQL
mysql_secure_installation

# 5. Kloniraj kod
git clone your-repo
cd your-app

# 6. Instaliraj dependencies
cd backend && npm install
cd ../frontend && npm install && npm run build

# 7. Setup PM2 za backend
npm install -g pm2
pm2 start backend/dist/server.js
pm2 startup
pm2 save

# 8. Konfiguriraj Nginx
# Servirati frontend build + proxy backend API
```

### Korak 2: Nginx konfiguracija
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Frontend (React build)
    location / {
        root /var/www/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Usporedba troškova

| Opcija | Mjesečni trošak | Prednosti | Nedostaci |
|--------|----------------|-----------|-----------|
| MyDataKnox VPS | €11.51+ | Hrvatski support | Skuplje |
| Hetzner Cloud | €3.79 | Najjeftiniji VPS | Engleski support |
| Serverless combo | €0-5 | Besplatno/jeftino | Ograničenja |
| Shared hosting | ❌ | - | Ne podržava Node.js |

## Preporuka

**Za produkciju: Hetzner Cloud CX22 (€3.79/mjesečno)**
- Puna kontrola
- Odličan performance  
- EU lokacija (GDPR)
- Skalabilnost

**Za development/testiranje: Besplatni servisi**
- Railway + Netlify + PlanetScale
- €0/mjesečno za početak
