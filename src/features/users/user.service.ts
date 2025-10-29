import { UserRepository } from "./user.repository.js";
import { AppError } from "../../shared/errors/AppError.js";

export class UserService {
  private userRepository = new UserRepository();

  async getUserById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  async getAllUsers() {
    return this.userRepository.findAll();
  }
}
