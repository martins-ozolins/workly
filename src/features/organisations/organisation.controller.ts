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
import { auth } from "../../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { MemberService } from "../members/member.service.js";

export class OrganisationController {
  private organisationService = new OrganisationService();
  private memberService = new MemberService();

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

  createOrganisation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // validate data
      const validationResult = createOrganisationSchema.safeParse(req.body);

      // throw error with validation results
      if (!validationResult.success) {
        throw Errors.validation({
          details: formatZodErrors(validationResult),
        });
      }

      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });
      if (!session?.user) {
        throw Errors.unauthorized();
      }

      const organisation =
        await this.organisationService.createOrganisationWithAdmin(
          validationResult.data,
          {
            userId: session.user.id,
            email: session.user.email ?? "",
            name: session.user.name ?? "Admin",
          }
        );

      res.status(201).json(organisation);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /organisations/:slug/admin - Admin full control view
   * Returns: full org data + full member data (all editable)
   * Access: Admin only
   */
  getOrganisationAdminView = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.params.slug) {
        throw Errors.notFound();
      }

      const organisation =
        await this.organisationService.getOrganisationForAdminView(
          req.params.slug
        );
      res.json(organisation);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /organisations/:slug/members - HR management view
   * Returns: org info + full member list with management details
   * Access: Admin or HR only
   */
  getOrganisationHrView = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.params.slug) {
        throw Errors.notFound();
      }

      const organisation =
        await this.organisationService.getOrganisationForHrView(
          req.params.slug
        );
      res.json(organisation);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /organisations/:slug/members - add new member
   * Creates invitation for new member
   * Access: Admin or HR
   */
  addNewMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.params.slug || !req.organisationId) {
        throw Errors.notFound();
      }

      const validationResult = createMemberSchema.safeParse(req.body);
      if (!validationResult.success) {
        throw Errors.validation({ details: formatZodErrors(validationResult) });
      }

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
   * Updates member information
   * Access: Admin or HR
   */
  updateMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.params.slug || !req.params.memberId || !req.organisationId) {
        throw Errors.notFound();
      }

      const validationResult = updateMemberSchema.safeParse(req.body);
      if (!validationResult.success) {
        throw Errors.validation({ details: formatZodErrors(validationResult) });
      }

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
   * Soft deletes member (sets status to inactive)
   * Access: Admin only
   */
  deleteMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.params.slug || !req.params.memberId || !req.organisationId) {
        throw Errors.notFound();
      }

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
   * Returns: basic org info + simple member list
   * Access: Any organisation member
   */
  getOrganisationMemberView = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.params.slug) {
        throw Errors.notFound();
      }

      const organisation =
        await this.organisationService.getOrganisationForMemberView(
          req.params.slug
        );
      res.json(organisation);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /organisations/:slug - Update organisation
   * Updates organisation details
   * Access: Admin only
   */
  updateOrganisationBySlug = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.params.slug || !req.organisationId) {
        throw Errors.notFound();
      }

      const validationResult = updateOrganisationSchema.safeParse(req.body);
      if (!validationResult.success) {
        throw Errors.validation({ details: formatZodErrors(validationResult) });
      }

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

  deleteOrganisation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.params.id) {
        throw Errors.notFound();
      }

      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });
      if (!session?.user) {
        throw Errors.unauthorized();
      }

      const result = await this.organisationService.deleteOrganisation(
        req.params.id
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
