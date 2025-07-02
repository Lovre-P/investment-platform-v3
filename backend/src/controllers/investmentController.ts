import { Request, Response, NextFunction } from 'express';
import { InvestmentModel, InvestmentFilters } from '../models/Investment.js';
import { NotFoundError } from '../utils/errors.js';
import { CreateInvestmentData } from '../types/index.js';

export class InvestmentController {
  static async getInvestments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters: InvestmentFilters = {
        status: req.query.status as any,
        category: req.query.category as string,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? Math.min(parseInt(req.query.limit as string), 100) : 10
      };

      const investments = await InvestmentModel.findAll(filters);
      const total = await InvestmentModel.count(filters);

      res.status(200).json({
        success: true,
        data: investments,
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total,
          pages: Math.ceil(total / filters.limit!)
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getInvestmentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const investment = await InvestmentModel.findById(id);

      if (!investment) {
        throw new NotFoundError('Investment not found');
      }

      res.status(200).json({
        success: true,
        data: investment
      });
    } catch (error) {
      next(error);
    }
  }

  static async createInvestment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const files = (req.files as Express.Multer.File[]) || [];
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const uploadDir = process.env.UPLOAD_DIR || 'uploads';
      const images = files.map(f => `${baseUrl}/${uploadDir}/${f.filename}`);

      const investmentData: CreateInvestmentData = {
        ...req.body,
        images
      };
      const identifier = req.user?.userId ?? req.ip;
      console.log(`New investment submission from ${identifier}`);
      const investment = await InvestmentModel.create(investmentData);

      res.status(201).json({
        success: true,
        data: investment
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateInvestment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const files = (req.files as Express.Multer.File[]) || [];
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const uploadDir = process.env.UPLOAD_DIR || 'uploads';
      const images = files.map(f => `${baseUrl}/${uploadDir}/${f.filename}`);

      const updates = {
        ...req.body,
        ...(images.length > 0 ? { images } : {})
      };

      const investment = await InvestmentModel.update(id, updates);

      res.status(200).json({
        success: true,
        data: investment
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteInvestment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await InvestmentModel.delete(id);

      if (!deleted) {
        throw new NotFoundError('Investment not found');
      }

      res.status(200).json({
        success: true,
        message: 'Investment deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}
