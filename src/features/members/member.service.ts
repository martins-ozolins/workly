import { MemberRepository } from "./member.repository.js";
import { AppError } from "../../shared/errors/AppError.js";
import {
  CreateMemberForOrgInput,
  UpdateMemberInput,
} from "./member.validators.js";

export class MemberService {
  private memberRepository = new MemberRepository();

  async getMemberById(id: string) {
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new AppError("Member not found", 404);
    }
    return member;
  }

  async getMembersByEmail(email: string) {
    return this.memberRepository.findByEmail(email);
  }

  async getMembersByUserId(userId: string) {
    return this.memberRepository.findByUserId(userId);
  }

  async getMembersByOrganisation(organisationId: string) {
    return this.memberRepository.findByOrganisation(organisationId);
  }

  async getMembersByOrganisationSlug(slug: string) {
    return this.memberRepository.findByOrganisationSlug(slug);
  }

  async getAllMembers() {
    return this.memberRepository.findAll();
  }

  async createMember(data: CreateMemberForOrgInput) {
    return this.memberRepository.create(data);
  }

  async updateMember(id: string, data: UpdateMemberInput) {
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new AppError("Member not found", 404);
    }

    return this.memberRepository.update(id, data);
  }

  async deleteMember(id: string) {
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new AppError("Member not found", 404);
    }

    await this.memberRepository.delete(id);
    return { message: "Member deleted successfully" };
  }
}
