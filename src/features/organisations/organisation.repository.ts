import { prisma } from "../../config/prisma.js";
import {
  CreateOrganisationInput,
  UpdateOrganisationInput,
} from "./organisation.validators.js";

export class OrganisationRepository {
  async findById(id: string) {
    return prisma.organization.findUnique({
      where: { id },
      include: {
        members: true,
      },
    });
  }

  async findBySlug(slug: string) {
    return prisma.organization.findUnique({
      where: { slug },
      include: {
        members: true,
      },
    });
  }

  async findAll() {
    return prisma.organization.findMany({
      include: {
        _count: {
          select: { members: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async createWithAdmin(
    data: CreateOrganisationInput,
    currentUser: {
      userId: string;
      email: string;
      name: string;
    }
  ) {
    return prisma.organization.create({
      data: {
        ...data, // organisation data
        members: {
          // admin data
          create: {
            role: "admin",
            name: currentUser.name,
            email: currentUser.email,
            userId: currentUser.userId,
            status: "active",
          },
        },
      },
      include: {
        members: true,
      },
    });
  }

  async update(id: string, data: UpdateOrganisationInput) {
    return prisma.organization.update({
      where: { id },
      data,
      include: {
        members: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.organization.delete({
      where: { id },
    });
  }
}
