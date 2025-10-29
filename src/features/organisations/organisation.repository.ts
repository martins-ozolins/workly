import { prisma } from "../../config/prisma.js";
import {
  CreateOrganisationInput,
  UpdateOrganisationInput,
} from "./organisation.validators.js";

export class OrganisationRepository {
  async findAll() {
    return prisma.organization.findMany({
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
          // admin data (first member)
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

  /**
   * Get organisation by slug for admin view with full editable data
   * Returns: full org data + full member data
   */
  async findBySlugForAdminView(slug: string) {
    // TODO: Implement with all fields for admin
    return prisma.organization.findUnique({
      where: { slug },
      include: {
        members: true,
      },
    });
  }

  /**
   * Update member by member.id
   * Used for updating member information by admins/HR
   */
  async updateMember(
    memberId: string,
    data: {
      name?: string;
      email?: string;
      role?: "admin" | "hr" | "employee";
      dept?: string | null;
      startDate?: string | null;
      status?: string | "pending";
      country?: string | null;
    }
  ) {
    // TODO: Implement member update logic
    return prisma.member.update({
      where: {
        id: memberId,
      },
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
   * Get organisation by slug for HR management view
   * Returns: org info (read-only) + full member list with management details
   */
  async findBySlugForHrView(slug: string) {
    // TODO: Implement with HR-specific fields
    return prisma.organization.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        country: true,
        address: true,
        plan: true,
        createdAt: true,
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            dept: true,
            startDate: true,
            status: true,
            country: true,
            createdAt: true,
          },
        },
      },
    });
  }

  /**
   * Create a new member for an organisation
   * Used for inviting new members
   */
  async createMember(
    orgId: string,
    data: {
      name: string;
      email: string;
      role: "admin" | "hr" | "employee";
      dept?: string | null;
      startDate?: string | null;
      status?: string | "pending";
      country?: string | null;
      userId: string | null;
    }
  ) {
    return prisma.member.create({
      data: {
        orgId,
        ...data,
      },
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
   * Soft delete member (set status to inactive)
   * Admin-only operation
   */
  async deactivateMember(memberId: string) {
    // TODO: Implement soft delete
    return prisma.member.update({
      where: {
        id: memberId,
      },
      data: {
        status: "inactive",
      },
    });
  }

  /**
   * Get organisation by slug with basic info for member view
   * Returns: basic org fields + simple member list (name, email, role, dept)
   */
  async findBySlugForMemberView(slug: string) {
    // TODO: Implement with specific select fields
    return prisma.organization.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        country: true,
        address: true,
        createdAt: true,
        members: {
          where: { status: "active" },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            dept: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return prisma.organization.findUnique({
      where: { id },
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
