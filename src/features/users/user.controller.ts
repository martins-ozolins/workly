import type { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service.js";
import { Errors } from "../../shared/errors/AppError.js";

export class UserController {
  private userService = new UserService();

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) {
      throw Errors.notFound();
    }

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
}
