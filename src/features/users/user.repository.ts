import { prisma } from "../../config/prisma.js";

export class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findAll() {
    return prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
