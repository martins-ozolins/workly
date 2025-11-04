import { MemberRepository } from "./member.repository.js";
export class MemberService {
  private memberRepository = new MemberRepository();

  /**
   * Get members by user ID
   *
   * Returns: list of memberships for specific user
   */
  async getMembersByUserId(userId: string) {
    return this.memberRepository.findByUserId(userId);
  }
}
