type Details = Record<string, string | Record<string, string>>;

export class AppError extends Error {
  details?: Details | null;
  statusCode: number;

  constructor(message: string, statusCode = 500, details?: Details | null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details ?? null;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const Errors = {
  badRequest(message = "Bad Request", details?: Details) {
    throw new AppError(message, 400, details);
  },
  unauthorized(message = "Unauthorized", details?: Details) {
    throw new AppError(message, 401, details);
  },
  forbidden(message = "Forbidden", details?: Details) {
    throw new AppError(message, 403, details);
  },
  notFound(message = "Not Found", details?: Details) {
    throw new AppError(message, 404, details);
  },
  conflict(message = "Conflict", details?: Details) {
    throw new AppError(message, 409, details);
  },
  internal(message = "Internal Server Error", details?: Details) {
    throw new AppError(message, 500, details);
  },
};
