import { Router } from "express";
import { MemberController } from "./member.controller.js";
import { requireAuth } from "../../shared/middleware/auth.middleware.js";

const router = Router();
const memberController = new MemberController();

// Get current user's memberships across all organisations
router.get("/me", requireAuth, memberController.getMembersByUser);

export default router;
