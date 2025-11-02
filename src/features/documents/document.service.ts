import { DocumentRepository } from "./document.repository.js";
import type { UploadDocumentDto } from "./document.types.js";

export class DocumentService {
  private documentRepository = new DocumentRepository();

  /**
   * Upload document to S3 and save metadata
   *
   * Handles: S3 upload + database record creation
   *
   * Returns: newly created document with S3 URL
   */
  async uploadDocument(data: UploadDocumentDto) {
    // TODO: Implement S3 upload and document creation
    // 1. Upload file to S3 bucket
    // 2. Get S3 URL/key
    // 3. Create document record with metadata
    throw new Error("uploadDocument not implemented yet");
  }

  /**
   * List all documents for a specific member
   *
   * Returns: list of documents for the member
   */
  async listDocumentsByMember(memberId: string, organisationSlug: string) {
    // TODO: Implement listing documents by member
    // 1. Verify member belongs to organisation
    // 2. Fetch all documents for the member
    throw new Error("listDocumentsByMember not implemented yet");
  }

  /**
   * Get document by ID with presigned S3 URL
   *
   * Returns: document metadata with download URL
   */
  async getDocumentById(documentId: string, memberId: string, organisationSlug: string) {
    // TODO: Implement get document
    // 1. Verify document belongs to member
    // 2. Verify member belongs to organisation
    // 3. Generate presigned S3 URL for download
    // 4. Return document with download URL
    throw new Error("getDocumentById not implemented yet");
  }

  /**
   * Delete document from S3 and database
   *
   * Returns: deletion confirmation
   */
  async deleteDocument(documentId: string, memberId: string, organisationSlug: string) {
    // TODO: Implement document deletion
    // 1. Verify document belongs to member
    // 2. Verify member belongs to organisation
    // 3. Delete file from S3
    // 4. Delete document record from database
    throw new Error("deleteDocument not implemented yet");
  }
}
