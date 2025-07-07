import { Request, Response } from 'express';
import { InvestmentCategoryModel } from '../models/InvestmentCategory.js';
import { CreateInvestmentCategoryData, UpdateInvestmentCategoryData } from '../types/index.js';
import { NotFoundError, DatabaseError } from '../utils/errors.js';

export class InvestmentCategoryController {
  // GET /api/categories
  static async getCategories(req: Request, res: Response) {
    try {
      const includeInactive = req.query.include_inactive === 'true';
      const categories = await InvestmentCategoryModel.findAll(includeInactive);
      
      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to fetch investment categories',
          code: 'FETCH_CATEGORIES_ERROR'
        }
      });
    }
  }

  // GET /api/categories/:id
  static async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const category = await InvestmentCategoryModel.findById(id);

      if (!category) {
        res.status(404).json({
          success: false,
          error: {
            message: 'Investment category not found',
            code: 'CATEGORY_NOT_FOUND'
          }
        });
        return;
      }

      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      console.error('Get category by ID error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to fetch investment category',
          code: 'FETCH_CATEGORY_ERROR'
        }
      });
    }
  }

  // POST /api/categories
  static async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryData: CreateInvestmentCategoryData = req.body;

      // Check if category name already exists
      const existingCategory = await InvestmentCategoryModel.findByName(categoryData.name);
      if (existingCategory) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Category name already exists',
            code: 'DUPLICATE_CATEGORY_NAME'
          }
        });
        return;
      }

      const category = await InvestmentCategoryModel.create(categoryData);

      res.status(201).json({
        success: true,
        data: category,
        message: 'Investment category created successfully'
      });
    } catch (error) {
      console.error('Create category error:', error);

      if (error instanceof DatabaseError && error.message.includes('already exists')) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Category name already exists',
            code: 'DUPLICATE_CATEGORY_NAME'
          }
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to create investment category',
          code: 'CREATE_CATEGORY_ERROR'
        }
      });
    }
  }

  // PUT /api/categories/:id
  static async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates: UpdateInvestmentCategoryData = req.body;

      // If updating name, check for duplicates
      if (updates.name) {
        const existingCategory = await InvestmentCategoryModel.findByName(updates.name);
        if (existingCategory && existingCategory.id !== id) {
          res.status(400).json({
            success: false,
            error: {
              message: 'Category name already exists',
              code: 'DUPLICATE_CATEGORY_NAME'
            }
          });
          return;
        }
      }

      const category = await InvestmentCategoryModel.update(id, updates);

      res.json({
        success: true,
        data: category,
        message: 'Investment category updated successfully'
      });
    } catch (error) {
      console.error('Update category error:', error);

      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          error: {
            message: 'Investment category not found',
            code: 'CATEGORY_NOT_FOUND'
          }
        });
        return;
      }

      if (error instanceof DatabaseError && error.message.includes('already exists')) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Category name already exists',
            code: 'DUPLICATE_CATEGORY_NAME'
          }
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to update investment category',
          code: 'UPDATE_CATEGORY_ERROR'
        }
      });
    }
  }

  // DELETE /api/categories/:id
  static async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Get category details first to check usage
      const category = await InvestmentCategoryModel.findById(id);
      if (!category) {
        res.status(404).json({
          success: false,
          error: {
            message: 'Investment category not found',
            code: 'CATEGORY_NOT_FOUND'
          }
        });
        return;
      }

      // Check if category is in use
      const usageCount = await InvestmentCategoryModel.checkCategoryUsage(category.name);
      if (usageCount > 0) {
        res.status(400).json({
          success: false,
          error: {
            message: `Cannot delete category "${category.name}" as it is used by ${usageCount} investment(s)`,
            code: 'CATEGORY_IN_USE',
            details: {
              categoryName: category.name,
              usageCount: usageCount
            }
          }
        });
        return;
      }

      await InvestmentCategoryModel.delete(id);

      res.json({
        success: true,
        message: 'Investment category deleted successfully'
      });
    } catch (error) {
      console.error('Delete category error:', error);

      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          error: {
            message: 'Investment category not found',
            code: 'CATEGORY_NOT_FOUND'
          }
        });
        return;
      }

      if (error instanceof DatabaseError && error.message.includes('Cannot delete category')) {
        res.status(400).json({
          success: false,
          error: {
            message: error.message,
            code: 'CATEGORY_IN_USE'
          }
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to delete investment category',
          code: 'DELETE_CATEGORY_ERROR'
        }
      });
    }
  }

  // GET /api/categories/:name/usage
  static async getCategoryUsage(req: Request, res: Response) {
    try {
      const { name } = req.params;
      const usageCount = await InvestmentCategoryModel.checkCategoryUsage(decodeURIComponent(name));
      
      res.json({
        success: true,
        data: {
          categoryName: name,
          usageCount: usageCount,
          canDelete: usageCount === 0
        }
      });
    } catch (error) {
      console.error('Get category usage error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to check category usage',
          code: 'CHECK_USAGE_ERROR'
        }
      });
    }
  }
}
