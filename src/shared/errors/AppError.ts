type Details = Record<string, string | Record<string, string>>;

export class AppError extends Error {
  statusCode: number;
  details?: Details | null;

  constructor(message: string, statusCode = 500, details?: Details | null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details ?? null;

    // Ensure "instanceof AppError" works correctly
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// Factory object for common HTTP errors
export const Errors = {
  badRequest(message = "Bad Request", details?: Details) {
    return new AppError(message, 400, details);
  },
  unauthorized(message = "Unauthorized", details?: Details) {
    return new AppError(message, 401, details);
  },
  forbidden(message = "Forbidden", details?: Details) {
    return new AppError(message, 403, details);
  },
  notFound(message = "Not Found", details?: Details) {
    return new AppError(message, 404, details);
  },
  conflict(message = "Conflict", details?: Details) {
    return new AppError(message, 409, details);
  },
  internal(message = "Internal Server Error", details?: Details) {
    return new AppError(message, 500, details);
  },
};
