import { OrganisationRepository } from "./organisation.repository.js";
import { Errors } from "../../shared/errors/AppError.js";
import {
  CreateOrganisationInput,
  UpdateOrganisationInput,
} from "./organisation.validators.js";
import type { UpdateMemberInput } from "../members/member.validators.js";

export class OrganisationService {
  private organisationRepository = new OrganisationRepository();

  /**
   * Get all organisations
   *
   * Returns: list of all organisations
   */
  async getAllOrganisations() {
    return this.organisationRepository.findAll();
  }

  /**
   * Create new organisation with admin user
   *
   * Returns: newly created organisation with admin member
   */
  async createOrganisationWithAdmin(
    data: CreateOrganisationInput,
    currentUser: {
      userId: string;
      email: string;
      name: string;
    }
  ) {
    return this.organisationRepository.createWithAdmin(data, currentUser);
  }

  /**
   * Get organisation for admin view (full editable data)
   * Route: GET /:slug/admin
   * Access: Admin only
   */
  async getOrganisationForAdminView(id: string) {
    const organisation =
      await this.organisationRepository.findByIdForAdminView(id);
    if (!organisation) {
      throw Errors.notFound({ message: "Organisation not found" });
    }
    return organisation;
  }

  /**
   * Get organisation for HR view (org info + full member list)
   * Route: GET /:slug/members
   * Access: Admin or HR
   */
  async getOrganisationForHrView(id: string) {
    const organisation =
      await this.organisationRepository.findByIdForHrView(id);
    if (!organisation) {
      throw Errors.notFound({ message: "Organisation not found" });
    }
    return organisation;
  }

  /**
   * add new member to organisation
   * Route: POST /:slug/members
   * Access: Admin or HR
   */
  async addNewMember(
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
    // Check if organisation exists
    const organisation = await this.organisationRepository.findById(orgId);
    if (!organisation) {
      throw Errors.notFound({ message: "Organisation not found" });
    }

    // Add member
    return this.organisationRepository.createMember(orgId, {
      ...data,
      userId: null,
    });
  }

  /**
   * Get single member for editing
   * Route: GET /:slug/members/:memberId
   * Access: Admin or HR
   */
  async getMemberForEditing(memberId: string, orgId: string) {
    const member = await this.organisationRepository.findMemberById(
      memberId,
      orgId
    );
    if (!member) {
      throw Errors.notFound({ message: "Member not found" });
    }
    return member;
  }

  /**
   * Update member information
   * Route: POST /:slug/members/:memberId
   * Access: Admin or HR
   */
  async updateMember(memberId: string, data: UpdateMemberInput) {
    return this.organisationRepository.updateMember(memberId, data);
  }

  /**
   * Deactivate member (soft delete)
   * Route: DELETE /:slug/members/:memberId
   * Access: Admin only
   */
  async deactivateMember(memberId: string) {
    return this.organisationRepository.deactivateMember(memberId);
  }

  /**
   * Get organisation for member view (basic info + simple member list)
   * Route: GET /:slug
   * Access: Any organisation member
   */
  async getOrganisationForMemberView(id: string) {
    const organisation =
      await this.organisationRepository.findByIdForMemberView(id);
    if (!organisation) {
      throw Errors.notFound({ message: "Organisation not found" });
    }
    return organisation;
  }

  /**
   * Delete organisation
   *
   * Returns: deletion confirmation message
   */
  async deleteOrganisation(id: string) {
    const organisation = await this.organisationRepository.findById(id);
    if (!organisation) {
      throw Errors.notFound({ message: "Organisation not found" });
    }

    await this.organisationRepository.delete(id);
    return { message: "Organisation deleted successfully" };
  }

  /**
   * Update organisation by slug
   * Route: POST /:slug
   * Access: Admin only
   */
  async updateOrganisationBySlug(id: string, data: UpdateOrganisationInput) {
    const organisation = await this.organisationRepository.findById(id);
    if (!organisation) {
      throw Errors.notFound({ message: "Organisation not found" });
    }

    return this.organisationRepository.update(id, data);
  }
}
