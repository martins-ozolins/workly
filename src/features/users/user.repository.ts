import { prisma } from "../../config/prisma.js";

export class UserRepository {
  /**
   * Query: Find user by ID
   *
   * Returns: user details
   */
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Query: Find all users
   *
   * Returns: list of users ordered by creation date
   */
  async findAll() {
    return prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
