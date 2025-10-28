import { prisma } from "../../config/prisma.js";
import type { UpdateMemberDto } from "./member.types.js";
import { CreateMemberForOrgInput } from "./member.validators.js";

export class MemberRepository {
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

  async create(data: CreateMemberForOrgInput) {
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

  async delete(id: string) {
    return prisma.member.delete({
      where: { id },
    });
  }
}
