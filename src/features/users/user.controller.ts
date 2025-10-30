import type { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service.js";
import { Errors } from "../../shared/errors/AppError.js";

export class UserController {
  private userService = new UserService();

  /**
   * GET /users/:id - Get user by ID
   *
   * Returns: user details
   *
   * Access: Authenticated users
   */
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

  /**
   * GET /users - Get all users
   *
   * Returns: list of all users
   *
   * Access: Authenticated users
   */
  getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  };
}
