import { DocumentRepository } from "./document.repository.js";
import { AppError } from "../../shared/errors/AppError.js";
import type { CreateDocumentDto, UpdateDocumentDto } from "./document.types.js";

export class DocumentService {
  private documentRepository = new DocumentRepository();

  /**
   * Get document by ID
   *
   * Returns: document details
   */
  async getDocumentById(id: string) {
    const document = await this.documentRepository.findById(id);
    if (!document) {
      throw new AppError("Document not found", 404);
    }
    return document;
  }

  /**
   * Get documents by member ID
   *
   * Returns: list of documents for specific member
   */
  async getDocumentsByMember(memberId: string) {
    return this.documentRepository.findByMember(memberId);
  }

  /**
   * Get all documents
   *
   * Returns: list of all documents
   */
  async getAllDocuments() {
    return this.documentRepository.findAll();
  }

  /**
   * Get documents expiring soon
   *
   * Returns: list of documents expiring within specified days
   */
  async getExpiringSoonDocuments(days?: number) {
    return this.documentRepository.findExpiringSoon(days);
  }

  /**
   * Create new document
   *
   * Returns: newly created document
   */
  async createDocument(data: CreateDocumentDto) {
    return this.documentRepository.create(data);
  }

  /**
   * Update document
   *
   * Returns: updated document details
   */
  async updateDocument(id: string, data: UpdateDocumentDto) {
    const document = await this.documentRepository.findById(id);
    if (!document) {
      throw new AppError("Document not found", 404);
    }

    return this.documentRepository.update(id, data);
  }

  /**
   * Delete document
   *
   * Returns: deletion confirmation message
   */
  async deleteDocument(id: string) {
    const document = await this.documentRepository.findById(id);
    if (!document) {
      throw new AppError("Document not found", 404);
    }

    await this.documentRepository.delete(id);
    return { message: "Document deleted successfully" };
  }
}
