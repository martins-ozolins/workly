import type { Request, Response, NextFunction } from "express";
import { AppError, Errors } from "../errors/AppError.js";
import { auth } from "../../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

/**
 * Middleware to protect routes that require authentication
 *
 * Uses better-auth to verify the session
 *
 * Sets req.user
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

    if (!session || !session.user) {
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

/**
 * Middleware to protect routes that require system admin role
 * Checks for authenticated user with role="admin"
 */
export const requireSystemAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      throw Errors.unauthorized();
    }

    if (session.user.role !== "admin") {
      throw Errors.forbidden({
        message: "Admin access required",
      });
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
