import { UserRepository } from "./user.repository.js";
import { AppError } from "../../shared/errors/AppError.js";
import { UpdateUser } from "./user.types.js";

export class UserService {
  private userRepository = new UserRepository();

  async getUserById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  async getAllUsers() {
    return this.userRepository.findAll();
  }

  async updateUser(id: string, data: UpdateUser) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    return this.userRepository.update(id, data);
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    await this.userRepository.delete(id);
    return { message: "User deleted successfully" };
  }
}
