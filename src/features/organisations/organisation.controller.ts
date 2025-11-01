import type { Request, Response, NextFunction } from "express";
import { OrganisationService } from "./organisation.service.js";
import {
  createOrganisationSchema,
  updateOrganisationSchema,
} from "./organisation.validators.js";
import {
  createMemberSchema,
  updateMemberSchema,
} from "../members/member.validators.js";
import { Errors } from "../../shared/errors/AppError.js";
import { formatZodErrors } from "../../utils/formatZodErrors.js";

export class OrganisationController {
  private organisationService = new OrganisationService();

  /**
   * GET /organisations - Get all organisations
   *
   * Returns: list of all organisations
   *
   * Access: System admin only
   */
  getAllOrganisations = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const organisations =
        await this.organisationService.getAllOrganisations();
      res.json(organisations);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /organisations - Create new organisation
   *
   * Returns: newly created organisation with admin member
   *
   * Access: Authenticated users
   */
  createOrganisation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Validate data
      const validationResult = createOrganisationSchema.safeParse(req.body);

      // Throw error with validation results
      if (!validationResult.success) {
        throw Errors.validation({
          details: formatZodErrors(validationResult),
        });
      }

      // Retrieve user
      const user = req.user!;

      // We have req.user and we do check in middleware before
      const organisation =
        await this.organisationService.createOrganisationWithAdmin(
          validationResult.data,
          {
            userId: user.id,
            email: user.email ?? "",
            name: user.name ?? "Admin",
          }
        );

      res.status(201).json(organisation);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /organisations/:slug/settings - Settings view
   *
   * Returns: full org data for configuration/settings
   *
   * Access: Organisation admin only
   */
  getOrganisationSettingsView = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // Check if organisation ID provided
    try {
      if (!req.organisationId) {
        throw Errors.notFound();
      }

      // Call service with organisation ID
      const organisation =
        await this.organisationService.getOrganisationForSettingsView(
          req.organisationId
        );

      res.json(organisation);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /organisations/:slug/members - Member management view
   *
   * Returns: org info + full member list with management details
   *
   * Access: Organisation Admin or HR only (returned data depends on the role)
   */
  getOrganisationMembersView = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.organisationId || !req.member) {
        throw Errors.notFound();
      }

      // Get member role from middleware
      const userRole = req.member.role as "admin" | "hr";

      // Service will return appropriate data based on role
      const organisation =
        await this.organisationService.getOrganisationForMembersView(
          req.organisationId,
          userRole
        );
      res.json(organisation);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /organisations/:slug/members/:memberId - Get single member for editing
   *
   * Returns: member data for form population
   *
   * Access: Organisation Admin or HR
   */
  getMemberForEditing = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // Check required data from middleware
    try {
      if (!req.params.slug || !req.params.memberId || !req.organisationId) {
        throw Errors.notFound();
      }

      // Call service with member ID + organisation ID
      const member = await this.organisationService.getMemberForEditing(
        req.params.memberId,
        req.organisationId
      );
      res.json(member);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /organisations/:slug/members - add new member
   *
   * Creates a new member
   *
   * Access: Organisation Admin or HR
   */
  addNewMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check required data from middleware
      if (!req.params.slug || !req.organisationId) {
        throw Errors.notFound();
      }

      // Validates body data based on Zod schema for member creation
      const validationResult = createMemberSchema.safeParse(req.body);
      if (!validationResult.success) {
        throw Errors.validation({ details: formatZodErrors(validationResult) });
      }

      // Call service with organisation ID + new member data
      const invite = await this.organisationService.addNewMember(
        req.organisationId,
        validationResult.data
      );
      res.status(201).json(invite);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /organisations/:slug/members/:memberId - Update member
   *
   * Updates member information
   *
   * Access: Organisation Admin or HR
   */
  updateMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check required data from middleware
      if (!req.params.slug || !req.params.memberId || !req.organisationId) {
        throw Errors.notFound();
      }

      // Validates body data based on Zod schema for member update
      const validationResult = updateMemberSchema.safeParse(req.body);
      if (!validationResult.success) {
        throw Errors.validation({ details: formatZodErrors(validationResult) });
      }

      // Call service with organisation ID + updated member data
      const member = await this.organisationService.updateMember(
        req.params.memberId,
        validationResult.data
      );
      res.json(member);
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /organisations/:slug/members/:memberId - Deactivate member
   *
   * Deactivate member (sets status to inactive)
   *
   * Access: Organisation Admin only
   */
  deactivateMember = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // Check required data from middleware
    try {
      if (!req.params.slug || !req.params.memberId || !req.organisationId) {
        throw Errors.notFound();
      }

      // Call service with member ID
      const result = await this.organisationService.deactivateMember(
        req.params.memberId
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /organisations/:slug - Member view
   *
   * Returns: basic org info + simple member list
   *
   * Access: Any organisation member
   */
  getOrganisationMemberView = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Check required data from middleware
      if (!req.organisationId) {
        throw Errors.notFound();
      }

      // Call service with organisation ID
      const organisation =
        await this.organisationService.getOrganisationForMemberView(
          req.organisationId
        );
      res.json(organisation);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /organisations/:slug - Update organisation
   *
   * Updates organisation details
   *
   * Access: Organisatiaon Admin only
   */
  updateOrganisationBySlug = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Check required data from middleware
      if (!req.params.slug || !req.organisationId) {
        throw Errors.notFound();
      }

      // Validate data based on Zod schema
      const validationResult = updateOrganisationSchema.safeParse(req.body);
      if (!validationResult.success) {
        throw Errors.validation({ details: formatZodErrors(validationResult) });
      }

      // Call service to update organisation
      const organisation =
        await this.organisationService.updateOrganisationBySlug(
          req.organisationId,
          validationResult.data
        );
      res.json(organisation);
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /organisations/:slug - Delete organisation
   *
   * Returns: deletion confirmation
   *
   * Access: Organisation Admin only
   */
  deleteOrganisation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Check required data from middleware
      if (!req.organisationId) {
        throw Errors.notFound();
      }

      const result = await this.organisationService.deleteOrganisation(
        req.organisationId
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
