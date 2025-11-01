import type { Request, Response, NextFunction } from "express";
import { AppError, Errors } from "../../shared/errors/AppError.js";
import { prisma } from "../../config/prisma.js";

/**
 * Middleware to check if the authenticated user is a member of the organisation
 *
 * Requires req.user to be set (use requireAuth first)
 *
 * Expects :slug param in the route
 */
export const isOrganisationMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw Errors.unauthorized();
    }

    const { slug } = req.params;
    if (!slug) {
      throw Errors.notFound({ message: "Organisation slug is required" });
    }

    // Find the organisation by slug
    const organisation = await prisma.organization.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!organisation) {
      throw Errors.notFound({ message: "Organisation not found" });
    }

    // Check if user is a member of this organisation
    const member = await prisma.member.findFirst({
      where: {
        orgId: organisation.id,
        userId: req.user.id,
        status: "active",
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!member) {
      throw Errors.forbidden({
        message: "You are not a member of this organisation",
      });
    }

    // Attach organisation and member info to request for use in controllers and services
    req.organisationId = organisation.id;
    req.member = member;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError("Failed to verify organisation membership", 500));
    }
  }
};

/**
 * Middleware to check if the authenticated user is an admin of the organisation
 *
 * Requires req.user to be set (use requireAuth first)
 *
 * Expects :slug param in the route
 */
export const isOrganisationAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw Errors.unauthorized();
    }

    const { slug } = req.params;
    if (!slug) {
      throw Errors.notFound({ message: "Organisation slug is required" });
    }

    // Find the organisation by slug
    const organisation = await prisma.organization.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!organisation) {
      throw Errors.notFound({ message: "Organisation not found" });
    }

    // Check if user is an admin of this organisation
    const member = await prisma.member.findFirst({
      where: {
        orgId: organisation.id,
        userId: req.user.id,
        role: "admin",
        status: "active",
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!member) {
      throw Errors.forbidden({
        message: "Admin access required for this organisation",
      });
    }

    // Attach organisation and member info to request for use in controllers
    req.organisationId = organisation.id;
    req.member = member;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError("Failed to verify admin access", 500));
    }
  }
};

/**
 * Middleware to check if the authenticated user is an admin or HR of the organisation
 *
 * Requires req.user to be set (use requireAuth first)
 *
 * Expects :slug param in the route
 */
export const isOrganisationAdminOrHr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw Errors.unauthorized();
    }

    const { slug } = req.params;
    if (!slug) {
      throw Errors.notFound({ message: "Organisation slug is required" });
    }

    // Find the organisation by slug
    const organisation = await prisma.organization.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!organisation) {
      throw Errors.notFound({ message: "Organisation not found" });
    }

    // Check if user is an admin or HR of this organisation
    const member = await prisma.member.findFirst({
      where: {
        orgId: organisation.id,
        userId: req.user.id,
        role: {
          in: ["admin", "hr"],
        },
        status: "active",
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!member) {
      throw Errors.forbidden({
        message: "Admin or HR access required for this organisation",
      });
    }

    // Attach organisation and member info to request for use in controllers
    req.organisationId = organisation.id;
    req.member = member;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError("Failed to verify admin/HR access", 500));
    }
  }
};

/**
 * Middleware to check if the authenticated user is an admin, HR, or accessing their own member record
 *
 * Requires req.user to be set (use requireAuth first)
 *
 * Expects :slug and :memberId params in the route
 */
export const isOrganisationAdminOrHrOrSelf = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw Errors.unauthorized();
    }

    const { slug, memberId } = req.params;
    if (!slug) {
      throw Errors.notFound({ message: "Organisation slug is required" });
    }
    if (!memberId) {
      throw Errors.notFound({ message: "Member ID is required" });
    }

    // Find the organisation by slug
    const organisation = await prisma.organization.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!organisation) {
      throw Errors.notFound({ message: "Organisation not found" });
    }

    // Check if user is a member of this organisation
    const userMember = await prisma.member.findFirst({
      where: {
        orgId: organisation.id,
        userId: req.user.id,
        status: "active",
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!userMember) {
      throw Errors.forbidden({
        message: "You are not a member of this organisation",
      });
    }

    // Check if user is admin/HR OR accessing their own member record
    const isAdminOrHr = ["admin", "hr"].includes(userMember.role);
    const isOwnRecord = userMember.id === memberId;

    if (!isAdminOrHr && !isOwnRecord) {
      throw Errors.forbidden({
        message: "You can only access your own profile or require admin/HR privileges",
      });
    }

    // Attach organisation and member info to request for use in controllers
    req.organisationId = organisation.id;
    req.member = userMember;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError("Failed to verify access permissions", 500));
    }
  }
};
