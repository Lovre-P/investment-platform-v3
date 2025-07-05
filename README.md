# MegaInvest - Investment Platform

A modern investment platform built with React, TypeScript, and Node.js with MySQL database.

## Features

- **Public Features:**
  - Browse investment opportunities
  - Submit investment proposals
  - Contact forms and lead generation
  - Responsive design with glass morphism UI

- **Admin Features:**
  - Investment management
  - Lead tracking
  - User management
  - Dashboard analytics
  - Pending investment approvals

## Quick Start

### Frontend Development
```bash
npm install
npm run dev
```

### Backend Development
```bash
cd backend
npm install
npm run dev
```

## Admin Access

The admin login button is hidden from the public navigation for security. To access the admin dashboard:

**Admin Login URL:** `#/admin/login`

- Navigate directly to the admin login page using the URL above
- Use your admin credentials to log in
- Access the full admin dashboard with investment, lead, and user management

### Default Admin Credentials
- **Username:** admin
- **Password:** admin123

> **Note:** Change the default admin credentials in production for security.

## Project Structure

```
├── components/          # React components
├── pages/              # Page components
│   ├── public/         # Public pages
│   └── admin/          # Admin pages
├── services/           # API services
├── contexts/           # React contexts
├── backend/            # Node.js backend
│   ├── src/            # Backend source code
│   └── README.md       # Backend setup guide
└── public/             # Static assets
```

## Deployment Guides

- [Railway Deployment Guide](./RAILWAY_SETUP_GUIDE.md)
- [Render Deployment Guide](./RENDER_DEPLOYMENT_GUIDE.md)
- [Backend MySQL Setup](./backend/MYSQL_SETUP.md)

## Technology Stack

### Frontend
- React 18 with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Heroicons for icons
- Glass morphism design system

### Backend
- Node.js with Express
- TypeScript
- MySQL database
- JWT authentication
- RESTful API design

## API Endpoints

### Public Endpoints
- `GET /api/investments` - List investments
- `GET /api/investments/:id` - Get investment details
- `POST /api/investments` - Submit investment proposal
- `POST /api/leads` - Submit contact form

### Admin Endpoints (Authentication Required)
- `POST /api/auth/login` - Admin login
- `GET /api/auth/session` - Check session
- `GET /api/admin/investments` - Manage investments
- `GET /api/admin/leads` - Manage leads
- `GET /api/admin/users` - Manage users
- `GET /api/admin/cookie-consents` - Cookie consent analytics
- `POST /api/cookie-consent` - Store cookie preferences (authentication optional)
- `GET /api/cookie-consent` - Retrieve latest consent for logged in user

## Development

### Environment Variables

Create `.env` files for both frontend and backend:

**Frontend (.env):**
```
VITE_API_URL=http://localhost:3001/api
```

**Backend (.env):**
```
PORT=3001
JWT_SECRET=your-secret-key
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=megainvest
```

### Database Setup

1. Install MySQL locally or use a cloud provider
2. Create a database named `megainvest`
3. Run the backend; migrations will run automatically to create tables
4. See [Backend MySQL Setup Guide](./backend/MYSQL_SETUP.md) for details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
