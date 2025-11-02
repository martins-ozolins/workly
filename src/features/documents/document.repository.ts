import { prisma } from "../../config/prisma.js";
import type { CreateDocumentDto } from "./document.types.js";

export class DocumentRepository {
  /**
   * Query: Create new document
   *
   * Inserts document metadata after S3 upload
   *
   * Returns: newly created document with member details
   */
  async createDocument(data: CreateDocumentDto) {
    // TODO: Implement document creation
    // Insert document record with S3 URL and metadata
    throw new Error("createDocument query not implemented yet");
  }

  /**
   * Query: Find document by ID with member and org validation
   *
   * Returns: document with member and organisation details
   */
  async findByIdWithMember(documentId: string, memberId: string) {
    // TODO: Implement find by ID with member validation
    // Query document where id = documentId AND memberId = memberId
    // Include member and organisation for validation
    throw new Error("findByIdWithMember query not implemented yet");
  }

  /**
   * Query: Delete document by ID
   *
   * Returns: deleted document
   */
  async deleteById(documentId: string) {
    // TODO: Implement document deletion
    // Delete document record where id = documentId
    throw new Error("deleteById query not implemented yet");
  }

  /**
   * Query: Verify member belongs to organisation
   *
   * Helper query to validate organisation-member relationship
   *
   * Returns: boolean indicating if member belongs to org
   */
  async verifyMemberInOrganisation(memberId: string, organisationSlug: string) {
    // TODO: Implement member-organisation verification
    // Query member where id = memberId AND organisation.slug = slug
    throw new Error("verifyMemberInOrganisation query not implemented yet");
  }
}
