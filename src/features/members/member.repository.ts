import { prisma } from "../../config/prisma.js";

export class MemberRepository {
  /**
   * Query: Find members by user ID
   *
   * Returns: list of memberships with organisation and user details
   */
  async findByUserId(userId: string) {
    return prisma.member.findMany({
      where: { userId, status: "active" },
      include: {
        org: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
