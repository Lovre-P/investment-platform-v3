import { Request, Response, NextFunction } from 'express';
import { InvestmentModel, InvestmentFilters } from '../models/Investment.js';
import { NotFoundError } from '../utils/errors.js';
import { CreateInvestmentData } from '../types/index.js';
import { uploadMultipleToCloudinary, isCloudinaryConfigured } from '../services/cloudinaryService.js';

// Type for handling multer files
type MulterFiles = Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };

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
      const multerFiles = req.files as MulterFiles;
      const files = Array.isArray(multerFiles) ? multerFiles : [];

      let images: string[] = [];

      // Upload images to Cloudinary if files are provided
      if (files.length > 0) {
        if (!isCloudinaryConfigured()) {
          throw new Error('Cloudinary is not properly configured. Please check environment variables.');
        }

        try {
          const uploadResults = await uploadMultipleToCloudinary(
            files.map(file => ({
              buffer: file.buffer,
              originalname: file.originalname
            })),
            {
              folder: 'mega-invest/investments'
            }
          );

          images = uploadResults.map(result => result.secure_url);
          console.log(`Successfully uploaded ${images.length} images to Cloudinary`);
        } catch (uploadError) {
          console.error('Failed to upload images to Cloudinary:', uploadError);
          res.status(500).json({
            error: 'Failed to upload images to cloud storage',
            details: uploadError instanceof Error ? uploadError.message : 'Unknown error'
          });
          return;
        }
      }

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
      const multerFiles = req.files as MulterFiles;
      const files = Array.isArray(multerFiles) ? multerFiles : [];

      let updates = { ...req.body };

      // Upload new images to Cloudinary if files are provided
      if (files.length > 0) {
        if (!isCloudinaryConfigured()) {
          throw new Error('Cloudinary is not properly configured. Please check environment variables.');
        }

        try {
          const uploadResults = await uploadMultipleToCloudinary(
            files.map(file => ({
              buffer: file.buffer,
              originalname: file.originalname
            })),
            {
              folder: 'mega-invest/investments'
            }
          );

          const newImages = uploadResults.map(result => result.secure_url);
          updates.images = newImages;
          console.log(`Successfully uploaded ${newImages.length} images to Cloudinary for update`);
        } catch (uploadError) {
          console.error('Failed to upload images to Cloudinary:', uploadError);
          res.status(500).json({
            error: 'Failed to upload images to cloud storage',
            details: uploadError instanceof Error ? uploadError.message : 'Unknown error'
          });
          return;
        }
      }

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
