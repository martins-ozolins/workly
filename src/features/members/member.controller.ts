import type { Request, Response, NextFunction } from "express";
import { MemberService } from "./member.service.js";
import { Errors } from "../../shared/errors/AppError.js";
import { formatZodErrors } from "../../utils/formatZodErrors.js";
import { auth } from "../../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import {
  createMemberForOrgSchema,
  updateMemberSchema,
} from "./member.validators.js";

export class MemberController {
  private memberService = new MemberService();

  getMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.params.id) {
        throw Errors.notFound();
      }

      const member = await this.memberService.getMemberById(req.params.id);
      res.json(member);
    } catch (error) {
      next(error);
    }
  };

  getAllMembers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const members = await this.memberService.getAllMembers();
      res.json(members);
    } catch (error) {
      next(error);
    }
  };

  getMembersByOrganisation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.params.organisationId) {
        throw Errors.notFound();
      }

      const members = await this.memberService.getMembersByOrganisation(
        req.params.organisationId
      );
      res.json(members);
    } catch (error) {
      next(error);
    }
  };

  getMembersByUser = async (
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

      const members = await this.memberService.getMembersByUserId(
        session.user.id
      );
      res.json(members);
    } catch (error) {
      next(error);
    }
  };

  createMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validationResult = createMemberForOrgSchema.safeParse(req.body);
      if (!validationResult.success) {
        throw Errors.validation({
          details: formatZodErrors(validationResult),
        });
      }

      const member = await this.memberService.createMember(
        validationResult.data
      );
      res.status(201).json(member);
    } catch (error) {
      next(error);
    }
  };

  updateMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.params.id) {
        throw Errors.notFound();
      }

      const validationResult = updateMemberSchema.safeParse(req.body);
      if (!validationResult.success) {
        throw Errors.validation({
          details: formatZodErrors(validationResult),
        });
      }

      const member = await this.memberService.updateMember(
        req.params.id,
        validationResult.data
      );
      res.json(member);
    } catch (error) {
      next(error);
    }
  };

  deleteMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.params.id) {
        throw Errors.notFound();
      }

      const result = await this.memberService.deleteMember(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
