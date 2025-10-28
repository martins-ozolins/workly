import { Router } from "express";
import { MemberController } from "./member.controller.js";

const router = Router();
const memberController = new MemberController();

router.get("/", memberController.getAllMembers);
router.get("/me", memberController.getMembersByUser);
router.get("/:id", memberController.getMember);
router.get(
  "/organisation/:organisationId",
  memberController.getMembersByOrganisation
);
router.post("/", memberController.createMember);
router.patch("/:id", memberController.updateMember);
router.delete("/:id", memberController.deleteMember);

export default router;
