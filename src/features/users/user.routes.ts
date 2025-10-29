import { Router } from "express";
import { UserController } from "./user.controller.js";
import { requireSystemAdmin } from "../../shared/middleware/auth.middleware.js";

const router = Router();
const userController = new UserController();

router.get("/", requireSystemAdmin, userController.getAllUsers);
router.get("/:id", requireSystemAdmin, userController.getUserById);

export default router;
