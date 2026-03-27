export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, code: string, statusCode: number = 400) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
  }

  static unauthorized(message = 'You must be logged in'): AppError {
    return new AppError(message, 'UNAUTHORIZED', 401);
  }

  static forbidden(message = 'You do not have permission'): AppError {
    return new AppError(message, 'FORBIDDEN', 403);
  }

  static notFound(entity: string): AppError {
    return new AppError(`${entity} not found`, 'NOT_FOUND', 404);
  }

  static validation(message: string): AppError {
    return new AppError(message, 'VALIDATION_ERROR', 422);
  }

  static conflict(message: string): AppError {
    return new AppError(message, 'CONFLICT', 409);
  }

  static badRequest(message: string): AppError {
    return new AppError(message, 'BAD_REQUEST', 400);
  }
}
