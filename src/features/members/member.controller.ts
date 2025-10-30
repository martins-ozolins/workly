import type { Request, Response, NextFunction } from "express";
import { MemberService } from "./member.service.js";
import { Errors } from "../../shared/errors/AppError.js";
import { formatZodErrors } from "../../utils/formatZodErrors.js";
import { auth } from "../../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { createMemberSchema, updateMemberSchema } from "./member.validators.js";

export class MemberController {
  private memberService = new MemberService();

  /**
   * GET /members/:id - Get member by ID
   *
   * Returns: member details
   *
   * Access: Authenticated users
   */
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

  /**
   * GET /members - Get all members
   *
   * Returns: list of all members
   *
   * Access: Authenticated users
   */
  getAllMembers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const members = await this.memberService.getAllMembers();
      res.json(members);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /members/organisation/:organisationId - Get members by organisation
   *
   * Returns: list of members in organisation
   *
   * Access: Authenticated users
   */
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

  /**
   * GET /members/me - Get current user's memberships
   *
   * Returns: list of organisations user is a member of
   *
   * Access: Authenticated users
   */
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

  /**
   * POST /members - Create new member
   *
   * Returns: newly created member
   *
   * Access: Admin or HR
   */
  createMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validationResult = createMemberSchema.safeParse(req.body);
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

  /**
   * PATCH /members/:id - Update member
   *
   * Returns: updated member details
   *
   * Access: Admin or HR
   */
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

  /**
   * DELETE /members/:id - Delete member
   *
   * Returns: deletion confirmation
   *
   * Access: Admin only
   */
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
