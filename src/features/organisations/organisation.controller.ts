import type { Request, Response, NextFunction } from "express";
import { OrganisationService } from "./organisation.service.js";
import {
  createOrganisationSchema,
  updateOrganisationSchema,
} from "./organisation.validators.js";
import { Errors } from "../../shared/errors/AppError.js";
import { formatZodErrors } from "../../utils/formatZodErrors.js";
import { auth } from "../../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { MemberService } from "../members/member.service.js";

export class OrganisationController {
  private organisationService = new OrganisationService();
  private memberService = new MemberService();

  getOrganisation = async (req: Request, res: Response, next: NextFunction) => {
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

      const organisation = await this.organisationService.getOrganisationById(
        req.params.id
      );
      res.json(organisation);
    } catch (error) {
      next(error);
    }
  };

  getAllOrganisations = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });
      if (!session?.user) {
        throw Errors.unauthorized();
      }

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

  updateOrganisation = async (
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

      // validate data
      const validationResult = updateOrganisationSchema.safeParse(req.body);

      // throw error with validation results
      if (!validationResult.success) {
        throw Errors.validation({
          details: formatZodErrors(validationResult),
        });
      }
      const organisation = await this.organisationService.updateOrganisation(
        req.params.id,
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

  getOrganisationMembers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.params.slug) {
        throw Errors.notFound();
      }

      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });
      if (!session?.user) {
        throw Errors.unauthorized();
      }

      const members = await this.memberService.getMembersByOrganisationSlug(
        req.params.slug
      );
      res.json(members);
    } catch (error) {
      next(error);
    }
  };
}
