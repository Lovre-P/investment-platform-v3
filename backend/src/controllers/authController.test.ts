import { Request, Response, NextFunction } from 'express'
import { AuthController } from './authController.js'
import { UserModel } from '../models/User.js'
import { comparePassword, generateToken } from '../utils/auth.js'
import { AuthenticationError } from '../utils/errors.js'

// Mock dependencies
jest.mock('../models/User.js')
jest.mock('../utils/auth.js')

const mockUserModel = UserModel as jest.Mocked<typeof UserModel>
const mockComparePassword = comparePassword as jest.MockedFunction<typeof comparePassword>
const mockGenerateToken = generateToken as jest.MockedFunction<typeof generateToken>

describe('AuthController', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = {}
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    next = jest.fn()
    jest.clearAllMocks()
  })

  describe('login', () => {
    it('should login successfully with email', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedpassword',
        role: 'admin'
      }

      req.body = { email: 'test@example.com', password: 'password' }
      mockUserModel.findByEmail.mockResolvedValue(mockUser as any)
      mockComparePassword.mockResolvedValue(true)
      mockGenerateToken.mockReturnValue('test-token')

      await AuthController.login(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          token: 'test-token',
          user: { id: '1', email: 'test@example.com', role: 'admin' }
        }
      })
    })

    it('should throw error for invalid credentials', async () => {
      req.body = { email: 'test@example.com', password: 'wrongpassword' }
      mockUserModel.findByEmail.mockResolvedValue(null)

      await AuthController.login(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(expect.any(AuthenticationError))
    })

    it('should throw error for wrong password', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedpassword',
        role: 'admin'
      }

      req.body = { email: 'test@example.com', password: 'wrongpassword' }
      mockUserModel.findByEmail.mockResolvedValue(mockUser as any)
      mockComparePassword.mockResolvedValue(false)

      await AuthController.login(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(expect.any(AuthenticationError))
    })
  })

  describe('checkSession', () => {
    it('should return user data for valid session', async () => {
      const mockUser = { id: '1', email: 'test@example.com', role: 'admin' }
      req.user = { userId: '1', role: 'admin' }
      mockUserModel.findById.mockResolvedValue(mockUser as any)

      await AuthController.checkSession(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockUser
      })
    })

    it('should throw error for invalid session', async () => {
      req.user = undefined

      await AuthController.checkSession(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(expect.any(AuthenticationError))
    })
  })

  describe('logout', () => {
    it('should logout successfully', async () => {
      await AuthController.logout(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Logged out successfully'
      })
    })
  })
})
