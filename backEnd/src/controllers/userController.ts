import { Request, Response, NextFunction } from 'express';

import { UserService } from '../services/userService';
import { AppError } from '../utils/AppError';
import { environment } from '../config/environment';

export class UserController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;

      if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
      }

      const { user, token } = await UserService.register({ email, password, name });

      res.cookie('accessToken', token, {
        httpOnly: true,
        secure: environment.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // to do: should use env number to control maxAge
      });

      res.status(201).json({
        status: 'success',
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
      }

      const { user, token } = await UserService.login({ email, password });

      res.cookie('accessToken', token, {
        httpOnly: true,
        secure: environment.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // to do: should use env number to control maxAge
      });

      res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json({
        status: 'success',
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie('accessToken');
      res.clearCookie('userData');
      const result = await UserService.logout();

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
