import { prisma } from "../../config/prisma.js";
import {
  CreateOrganisationInput,
  UpdateOrganisationInput,
} from "./organisation.validators.js";

export class OrganisationRepository {
  /**
   * Query: Find all organisations
   *
   * Returns: list of organisations ordered by creation date
   */
  async findAll() {
    return prisma.organization.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Query: Create organisation with admin member
   *
   * Returns: newly created organisation with admin member
   */
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
   * Get organisation by id for admin view with full editable data
   * Returns: full org data + full member data
   */
  async findByIdForAdminView(id: string) {
    return prisma.organization.findUnique({
      where: { id },
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
      name: string;
      email: string;
      role: "admin" | "hr" | "employee";
      dept: string | null;
      startDate: string | null;
      status:
        | "active"
        | "pending"
        | "vacation"
        | "paid_leave"
        | "inactive"
        | "terminated";
      country: string | null;
    }
  ) {
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
   * Get organisation by id for HR management view
   * Returns: org info (read-only) + full member list with management details
   */
  async findByIdForHrView(id: string) {
    return prisma.organization.findUnique({
      where: { id },
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
      dept: string | null;
      startDate: string | null;
      status:
        | "active"
        | "pending"
        | "vacation"
        | "paid_leave"
        | "inactive"
        | "terminated";
      country: string | null;
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
   * Get organisation by id with basic info for member view
   * Returns: basic org fields + simple member list (name, email, role, dept)
   */
  async findByIdForMemberView(id: string) {
    return prisma.organization.findUnique({
      where: { id },
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

  /**
   * Query: Find organisation by ID
   *
   * Returns: organisation with all members
   */
  async findById(id: string) {
    return prisma.organization.findUnique({
      where: { id },
      include: {
        members: true,
      },
    });
  }

  /**
   * Query: Update organisation
   *
   * Returns: updated organisation with members
   */
  async update(id: string, data: UpdateOrganisationInput) {
    return prisma.organization.update({
      where: { id },
      data,
      include: {
        members: true,
      },
    });
  }

  /**
   * Query: Delete organisation
   *
   * Returns: deleted organisation
   */
  async delete(id: string) {
    return prisma.organization.delete({
      where: { id },
    });
  }
}
