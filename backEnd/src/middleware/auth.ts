import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { environment } from '../config/environment';
import { prisma } from '../utils/prismaClient';

interface JwtPayload {
  id: string;
  iat: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1) Get token and check if it exists
    let token: string | undefined;

    if (req.headers.authorization?.startsWith('Bearer')) {
      // postman test
      token = req.headers.authorization.split(' ')[1];
    }
    if (req.headers.cookie?.includes('accessToken')) {
      token = req.headers.cookie.split('accessToken=')[1].split(';')[0];
    }

    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // 2) Verify token
    const decoded = jwt.verify(token, Buffer.from(environment.JWT_SECRET)) as JwtPayload;

    // 3) Check if user still exists
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
