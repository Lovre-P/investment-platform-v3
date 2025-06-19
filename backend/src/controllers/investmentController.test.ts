import { Request, Response, NextFunction } from 'express'
import { InvestmentController } from './investmentController.js'
import { InvestmentModel } from '../models/Investment.js'
import { NotFoundError } from '../utils/errors.js'

// Mock dependencies
jest.mock('../models/Investment.js')

const mockInvestmentModel = InvestmentModel as jest.Mocked<typeof InvestmentModel>

describe('InvestmentController', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = { query: {}, params: {} }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    next = jest.fn()
    jest.clearAllMocks()
  })

  describe('getInvestments', () => {
    it('should return investments with pagination', async () => {
      const mockInvestments = [
        { id: '1', title: 'Investment 1', status: 'active' },
        { id: '2', title: 'Investment 2', status: 'active' }
      ]

      mockInvestmentModel.findAll.mockResolvedValue(mockInvestments as any)
      mockInvestmentModel.count.mockResolvedValue(2)

      await InvestmentController.getInvestments(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockInvestments,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          pages: 1
        }
      })
    })

    it('should handle query filters', async () => {
      req.query = { status: 'active', page: '2', limit: '5' }
      
      mockInvestmentModel.findAll.mockResolvedValue([])
      mockInvestmentModel.count.mockResolvedValue(0)

      await InvestmentController.getInvestments(req as Request, res as Response, next)

      expect(mockInvestmentModel.findAll).toHaveBeenCalledWith({
        status: 'active',
        page: 2,
        limit: 5,
        category: undefined
      })
    })
  })

  describe('getInvestmentById', () => {
    it('should return investment by id', async () => {
      const mockInvestment = { id: '1', title: 'Investment 1', status: 'active' }
      req.params = { id: '1' }
      mockInvestmentModel.findById.mockResolvedValue(mockInvestment as any)

      await InvestmentController.getInvestmentById(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockInvestment
      })
    })

    it('should throw NotFoundError for non-existent investment', async () => {
      req.params = { id: '999' }
      mockInvestmentModel.findById.mockResolvedValue(null)

      await InvestmentController.getInvestmentById(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError))
    })
  })

  describe('createInvestment', () => {
    it('should create new investment', async () => {
      const investmentData = { title: 'New Investment', description: 'Test description' }
      const mockInvestment = { id: '1', ...investmentData, status: 'pending' }
      
      req.body = investmentData
      mockInvestmentModel.create.mockResolvedValue(mockInvestment as any)

      await InvestmentController.createInvestment(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockInvestment
      })
    })
  })

  describe('updateInvestment', () => {
    it('should update investment', async () => {
      const updates = { title: 'Updated Investment' }
      const mockInvestment = { id: '1', title: 'Updated Investment', status: 'active' }
      
      req.params = { id: '1' }
      req.body = updates
      mockInvestmentModel.update.mockResolvedValue(mockInvestment as any)

      await InvestmentController.updateInvestment(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockInvestment
      })
    })
  })

  describe('deleteInvestment', () => {
    it('should delete investment', async () => {
      req.params = { id: '1' }
      mockInvestmentModel.delete.mockResolvedValue(true)

      await InvestmentController.deleteInvestment(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Investment deleted successfully'
      })
    })

    it('should throw NotFoundError when investment not found', async () => {
      req.params = { id: '999' }
      mockInvestmentModel.delete.mockResolvedValue(false)

      await InvestmentController.deleteInvestment(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError))
    })
  })
})
