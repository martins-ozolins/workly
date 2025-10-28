import type { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service.js";
import { updateUserSchema, createUserSchema } from "./user.validators.js";
import { AppError } from "../../shared/errors/AppError.js";

export class UserController {
  private userService = new UserService();

  getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validationResult = updateUserSchema.safeParse(req.body);
      if (!validationResult.success) {
        throw new AppError(validationResult.error.errors[0].message, 400);
      }

      const user = await this.userService.updateUser(
        req.params.id,
        validationResult.data
      );
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.deleteUser(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
