import request from 'supertest'
import express from 'express'
import authRoutes from './auth.js'

const app = express()
app.use(express.json())
app.use('/api/auth', authRoutes)

// Mock the auth controller
jest.mock('../controllers/authController.js', () => ({
  AuthController: {
    login: jest.fn((req, res) => res.status(200).json({ success: true })),
    checkSession: jest.fn((req, res) => res.status(200).json({ success: true })),
    logout: jest.fn((req, res) => res.status(200).json({ success: true }))
  }
}))

// Mock middleware
jest.mock('../middleware/auth.js', () => ({
  authenticate: jest.fn((req, res, next) => next())
}))

jest.mock('../middleware/validation.js', () => ({
  validateBody: jest.fn(() => (req, res, next) => next())
}))

describe('Auth Routes', () => {
  describe('POST /api/auth/login', () => {
    it('should handle login request', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password' })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
    })
  })

  describe('GET /api/auth/session', () => {
    it('should handle session check', async () => {
      const response = await request(app)
        .get('/api/auth/session')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
    })
  })

  describe('POST /api/auth/logout', () => {
    it('should handle logout request', async () => {
      const response = await request(app)
        .post('/api/auth/logout')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
    })
  })
})
