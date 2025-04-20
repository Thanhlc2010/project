export type ErrorType = 
  | 'VALIDATION_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'NOT_FOUND'
  | 'BAD_REQUEST'
  | 'CONFLICT'
  | 'INTERNAL_ERROR'
  | 'RATE_LIMIT_ERROR'
  | 'DATABASE_ERROR';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: 'error' | 'fail';
  public readonly isOperational: boolean;
  public readonly type: ErrorType;
  public readonly code?: string;

  constructor(
    message: string, 
    statusCode: number, 
    type: ErrorType = 'INTERNAL_ERROR',
    code?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
    this.isOperational = true;
    this.type = type;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }

  public static badRequest(message: string, code?: string): AppError {
    return new AppError(message, 400, 'BAD_REQUEST', code);
  }

  public static unauthorized(message: string = 'Unauthorized', code?: string): AppError {
    return new AppError(message, 401, 'AUTHENTICATION_ERROR', code);
  }

  public static forbidden(message: string = 'Forbidden', code?: string): AppError {
    return new AppError(message, 403, 'AUTHORIZATION_ERROR', code);
  }

  public static notFound(message: string = 'Resource not found', code?: string): AppError {
    return new AppError(message, 404, 'NOT_FOUND', code);
  }

  public static conflict(message: string, code?: string): AppError {
    return new AppError(message, 409, 'CONFLICT', code);
  }

  public static validation(message: string, code?: string): AppError {
    return new AppError(message, 400, 'VALIDATION_ERROR', code);
  }

  public static database(message: string, code?: string): AppError {
    return new AppError(message, 500, 'DATABASE_ERROR', code);
  }

  public static rateLimit(message: string = 'Too many requests', code?: string): AppError {
    return new AppError(message, 429, 'RATE_LIMIT_ERROR', code);
  }
}