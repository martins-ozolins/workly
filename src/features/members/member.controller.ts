import type { Request, Response, NextFunction } from "express";
import { MemberService } from "./member.service.js";

export class MemberController {
  private memberService = new MemberService();

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
      const user = req.user!;

      const members = await this.memberService.getMembersByUserId(user.id);
      res.json(members);
    } catch (error) {
      next(error);
    }
  };
}
