import { prisma } from "../../config/prisma.js";
import type { UpdateMemberDto } from "./member.types.js";
import { CreateMemberInput } from "./member.validators.js";

export class MemberRepository {
  /**
   * Query: Find member by ID
   *
   * Returns: member with organisation and user details
   */
  async findById(id: string) {
    return prisma.member.findUnique({
      where: { id },
      include: {
        org: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * Query: Find members by email
   *
   * Returns: list of members with matching email and organisation details
   */
  async findByEmail(email: string) {
    return prisma.member.findMany({
      where: { email },
      include: {
        org: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
  }

  /**
   * Query: Find members by user ID
   *
   * Returns: list of memberships with organisation and user details
   */
  async findByUserId(userId: string) {
    return prisma.member.findMany({
      where: { userId },
      include: {
        org: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Query: Find members by organisation ID
   *
   * Returns: list of members with user details
   */
  async findByOrganisation(orgId: string) {
    return prisma.member.findMany({
      where: { orgId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Query: Find members by organisation slug
   *
   * Returns: list of members with user details
   */
  async findByOrganisationSlug(slug: string) {
    return prisma.member.findMany({
      where: {
        org: {
          slug,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Query: Find all members
   *
   * Returns: list of all members with organisation and user details
   */
  async findAll() {
    return prisma.member.findMany({
      include: {
        org: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Query: Create new member
   *
   * Returns: newly created member with organisation and user details
   */
  async create(data: CreateMemberInput) {
    return prisma.member.create({
      data,
      include: {
        org: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * Query: Update member
   *
   * Returns: updated member with organisation and user details
   */
  async update(id: string, data: UpdateMemberDto) {
    return prisma.member.update({
      where: { id },
      data,
      include: {
        org: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * Query: Delete member
   *
   * Returns: deleted member
   */
  async delete(id: string) {
    return prisma.member.delete({
      where: { id },
    });
  }
}
