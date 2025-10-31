import { MemberRepository } from "./member.repository.js";
import { AppError } from "../../shared/errors/AppError.js";
import { UpdateMemberInput } from "./member.validators.js";

export class MemberService {
  private memberRepository = new MemberRepository();

  /**
   * Get member by ID
   *
   * Returns: member details
   */
  async getMemberById(id: string) {
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new AppError("Member not found", 404);
    }
    return member;
  }

  /**
   * Get members by email
   *
   * Returns: list of members with matching email
   */
  async getMembersByEmail(email: string) {
    return this.memberRepository.findByEmail(email);
  }

  /**
   * Get members by user ID
   *
   * Returns: list of memberships for specific user
   */
  async getMembersByUserId(userId: string) {
    return this.memberRepository.findByUserId(userId);
  }

  /**
   * Get members by organisation ID
   *
   * Returns: list of members in organisation
   */
  async getMembersByOrganisation(organisationId: string) {
    return this.memberRepository.findByOrganisation(organisationId);
  }

  /**
   * Get members by organisation slug
   *
   * Returns: list of members in organisation
   */
  async getMembersByOrganisationSlug(slug: string) {
    return this.memberRepository.findByOrganisationSlug(slug);
  }

  /**
   * Get all members
   *
   * Returns: list of all members
   */
  async getAllMembers() {
    return this.memberRepository.findAll();
  }

  /**
   * Update member
   *
   * Returns: updated member details
   */
  async updateMember(id: string, data: UpdateMemberInput) {
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new AppError("Member not found", 404);
    }

    return this.memberRepository.update(id, data);
  }

  /**
   * Delete member
   *
   * Returns: deletion confirmation message
   */
  async deleteMember(id: string) {
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new AppError("Member not found", 404);
    }

    await this.memberRepository.delete(id);
    return { message: "Member deleted successfully" };
  }
}
