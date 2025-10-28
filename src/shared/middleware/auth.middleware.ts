import type { Request, Response, NextFunction } from "express";
import { AppError, Errors } from "../errors/AppError.js";
import { auth } from "../../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

/**
 * Middleware to protect routes that require authentication
 * Uses better-auth to verify the session
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      throw Errors.unauthorized();
    }

    // attach user to request for use in controllers
    req.user = session.user;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError("Unauthorized - Invalid session", 401));
    }
  }
};
