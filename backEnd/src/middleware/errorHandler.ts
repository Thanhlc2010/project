import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { environment } from '../config/environment';
import { Prisma } from '@prisma/client';

const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);
const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again.', 401);
const handleValidationError = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  return new AppError(`Invalid input data. ${errors.join('. ')}`, 400);
};

const handlePrismaError = (error: Prisma.PrismaClientKnownRequestError) => {
  // Handle unique constraint violations
  if (error.code === 'P2002') {
    const target = (error.meta?.target as string[]) || [];
    return new AppError(`Duplicate value for ${target.join(', ')}`, 400);
  }

  // Handle foreign key constraint violations
  if (error.code === 'P2003') {
    return new AppError('Related record not found', 404);
  }

  // Handle record not found
  if (error.code === 'P2025') {
    return new AppError('Record not found', 404);
  }

  // Handle invalid data
  if (error.code === 'P2000') {
    return new AppError('Invalid input data', 400);
  }

  return new AppError('Database operation failed', 500);
};

const handleRateLimitError = () => new AppError('Too many requests. Please try again later.', 429);

const handleSyntaxError = (err: any) => new AppError('Invalid JSON format', 400);

const handleBodyParserError = () => new AppError('Request body too large', 413);

const handleMulterError = (err: any) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return new AppError('File too large', 413);
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    return new AppError('Too many files', 413);
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return new AppError('Unexpected field', 400);
  }
  return new AppError('File upload error', 400);
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (environment.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    let error = { ...err };
    error.message = err.message;

    // JWT Errors
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    
    // Validation Errors
    if (error.name === 'ValidationError') error = handleValidationError(error);
    
    // Prisma Errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      error = handlePrismaError(error);
    }
    if (error instanceof Prisma.PrismaClientValidationError) {
      error = new AppError('Invalid data provided to database', 400);
    }
    
    // Rate Limit Errors
    if (error.name === 'RateLimitError') error = handleRateLimitError();
    
    // Body Parser Errors
    if (error instanceof SyntaxError) error = handleSyntaxError(error);
    if (error.type === 'entity.too.large') error = handleBodyParserError();
    
    // File Upload Errors
    if (error.name === 'MulterError') error = handleMulterError(error);

    if (err.isOperational) {
      // Operational, trusted errors
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        code: err.code // Include error code for client-side handling
      });
    } else {
      // Programming or unknown errors
      console.error('ERROR 💥', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong'
      });
    }
  }
};