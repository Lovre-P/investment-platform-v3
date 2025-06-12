import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/User.js';
import { NotFoundError } from '../utils/errors.js';
import { CreateUserData, UpdateUserData } from '../types/index.js';

export class UserController {
  static async getUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await UserModel.findAll();

      res.status(200).json({
        success: true,
        data: users
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = await UserModel.findById(id);

      if (!user) {
        throw new NotFoundError('User not found');
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  static async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData: CreateUserData = req.body;
      const user = await UserModel.create(userData);

      res.status(201).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updates: UpdateUserData = req.body;

      const user = await UserModel.update(id, updates);

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await UserModel.delete(id);

      if (!deleted) {
        throw new NotFoundError('User not found');
      }

      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}
