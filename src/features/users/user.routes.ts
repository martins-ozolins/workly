import { Router } from "express";
import { UserController } from "./user.controller.js";

const router = Router();
const userController = new UserController();

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUser);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;
