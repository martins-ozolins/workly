import { Request, Response, NextFunction } from "express";
import logger from "../../config/logger.js";
import { AppError } from "../errors/AppError.js";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    logger.error(`${err.message}`, {
      statusCode: err.statusCode,
      details: err.details,
      path: req.path,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query,
      userId: req.user?.id,
    });

    return res.status(err.statusCode).json({
      error: err.message,
      ...(err.details && { details: err.details }),
    });
  }
  logger.error("Unhandled error", {
    path: req.path,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    userId: req.user?.id,
  });

  res.status(500).json({
    error: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { details: err }),
  });
}
