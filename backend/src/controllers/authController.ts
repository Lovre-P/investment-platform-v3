import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/User.js';
import { comparePassword, generateToken } from '../utils/auth.js';
import { AuthenticationError } from '../utils/errors.js';
import { LoginCredentials, LoginResponse } from '../types/index.js';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, username, password }: LoginCredentials = req.body;

      // Find user by email or username
      let user;
      if (email) {
        user = await UserModel.findByEmail(email);
      } else if (username) {
        user = await UserModel.findByUsername(username);
      } else {
        throw new AuthenticationError('Email or username is required');
      }

      if (!user) {
        throw new AuthenticationError('Invalid credentials');
      }

      // Verify password
      const isPasswordValid = await comparePassword(password, user.password!);
      if (!isPasswordValid) {
        throw new AuthenticationError('Invalid credentials');
      }

      // Generate JWT token
      const token = generateToken({
        userId: user.id,
        role: user.role
      });

      // Remove password from user object
      const { password: _, ...userWithoutPassword } = user;

      const response: LoginResponse = {
        token,
        user: userWithoutPassword
      };

      res.status(200).json({
        success: true,
        data: response
      });
    } catch (error) {
      next(error);
    }
  }

  static async checkSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('No valid session found');
      }

      // Fetch fresh user data
      const user = await UserModel.findById(req.user.userId);
      if (!user) {
        throw new AuthenticationError('User not found');
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // In a stateless JWT implementation, logout is primarily handled client-side
      // Here we could implement token blacklisting if needed
      
      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}
