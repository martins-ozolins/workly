import { OrganisationRepository } from "./organisation.repository.js";
import { AppError } from "../../shared/errors/AppError.js";
import {
  CreateOrganisationInput,
  UpdateOrganisationInput,
} from "./organisation.validators.js";
import type { UpdateMemberInput } from "../members/member.validators.js";

export class OrganisationService {
  private organisationRepository = new OrganisationRepository();

  async getAllOrganisations() {
    return this.organisationRepository.findAll();
  }

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
  async getOrganisationForAdminView(slug: string) {
    const organisation =
      await this.organisationRepository.findBySlugForAdminView(slug);
    if (!organisation) {
      throw new AppError("Organisation not found", 404);
    }
    return organisation;
  }

  /**
   * Get organisation for HR view (org info + full member list)
   * Route: GET /:slug/members
   * Access: Admin or HR
   */
  async getOrganisationForHrView(slug: string) {
    const organisation =
      await this.organisationRepository.findBySlugForHrView(slug);
    if (!organisation) {
      throw new AppError("Organisation not found", 404);
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
      dept?: string | null;
      startDate?: string | null;
      country?: string | null;
      status?: string | "pending";
    }
  ) {
    // Check if organisation exists
    const organisation = await this.organisationRepository.findById(orgId);
    if (!organisation) {
      throw new AppError("Organisation not found", 404);
    }

    // Add member
    return this.organisationRepository.createMember(orgId, {
      ...data,
      userId: null,
    });
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
  async getOrganisationForMemberView(slug: string) {
    const organisation =
      await this.organisationRepository.findBySlugForMemberView(slug);
    if (!organisation) {
      throw new AppError("Organisation not found", 404);
    }
    return organisation;
  }

  async deleteOrganisation(id: string) {
    const organisation = await this.organisationRepository.findById(id);
    if (!organisation) {
      throw new AppError("Organisation not found", 404);
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
      throw new AppError("Organisation not found", 404);
    }

    return this.organisationRepository.update(id, data);
  }
}
