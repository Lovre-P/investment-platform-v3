# MegaInvest Backend API

A robust Node.js/Express.js backend API for the MegaInvest investment platform.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Investment Management**: CRUD operations for investment opportunities
- **Lead Management**: Contact form submissions and lead tracking
- **User Management**: Admin user management system
- **Security**: Rate limiting, CORS, input validation, password hashing
- **Database**: PostgreSQL with connection pooling
- **Error Handling**: Comprehensive error handling and logging

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Security**: Helmet, bcryptjs, express-rate-limit
- **Development**: tsx for TypeScript execution

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials and JWT secret
```

3. Set up the database:
```bash
# Create database
createdb megainvest_db

# Run migrations
npm run db:migrate

# Seed with sample data
npm run db:seed
```

4. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## API Endpoints

### Authentication (`/api/auth`)
- `POST /login` - User login
- `GET /session` - Check current session
- `POST /logout` - User logout

### Investments (`/api/investments`)
- `GET /` - List investments (public, with filters)
- `GET /:id` - Get investment by ID (public)
- `POST /` - Create investment (admin only)
- `PUT /:id` - Update investment (admin only)
- `DELETE /:id` - Delete investment (admin only)

### Leads (`/api/leads`)
- `GET /` - List leads (admin only)
- `GET /:id` - Get lead by ID (admin only)
- `POST /` - Create lead (public)
- `PUT /:id/status` - Update lead status (admin only)

### Users (`/api/users`)
- `GET /` - List users (admin only)
- `GET /:id` - Get user by ID (admin only)
- `POST /` - Create user (admin only)
- `PUT /:id` - Update user (admin only)
- `DELETE /:id` - Delete user (admin only)

## Default Credentials

After running the seed script:
- **Admin**: admin@megainvest.com / admin123
- **User**: user@megainvest.com / user123

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/megainvest_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=megainvest_db
DB_USER=username
DB_PASSWORD=password

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Server
PORT=3001
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── database/        # Database config and migrations
│   ├── utils/           # Utility functions
│   ├── types/           # TypeScript type definitions
│   └── server.ts        # Main server file
├── dist/                # Compiled JavaScript (after build)
├── .env                 # Environment variables
└── package.json
```

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevents abuse and DDoS
- **Input Validation**: Zod schemas for all inputs
- **CORS**: Configured for frontend domain
- **Security Headers**: Helmet.js for security headers
- **SQL Injection Prevention**: Parameterized queries

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

## Development

### Adding New Endpoints

1. Create controller in `src/controllers/`
2. Add validation schema in `src/utils/validation.ts`
3. Create route in `src/routes/`
4. Add route to `src/server.ts`

### Database Changes

1. Update schema in `src/database/schema.sql`
2. Run migrations: `npm run db:migrate`
3. Update models in `src/models/`

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure proper database credentials
4. Set up SSL/HTTPS
5. Configure reverse proxy (nginx)
6. Set up monitoring and logging

## License

MIT
