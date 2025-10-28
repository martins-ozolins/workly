import { DocumentRepository } from "./document.repository.js";
import { AppError } from "../../shared/errors/AppError.js";
import type { CreateDocumentDto, UpdateDocumentDto } from "./document.types.js";

export class DocumentService {
  private documentRepository = new DocumentRepository();

  async getDocumentById(id: string) {
    const document = await this.documentRepository.findById(id);
    if (!document) {
      throw new AppError("Document not found", 404);
    }
    return document;
  }

  async getDocumentsByMember(memberId: string) {
    return this.documentRepository.findByMember(memberId);
  }

  async getAllDocuments() {
    return this.documentRepository.findAll();
  }

  async getExpiringSoonDocuments(days?: number) {
    return this.documentRepository.findExpiringSoon(days);
  }

  async createDocument(data: CreateDocumentDto) {
    return this.documentRepository.create(data);
  }

  async updateDocument(id: string, data: UpdateDocumentDto) {
    const document = await this.documentRepository.findById(id);
    if (!document) {
      throw new AppError("Document not found", 404);
    }

    return this.documentRepository.update(id, data);
  }

  async deleteDocument(id: string) {
    const document = await this.documentRepository.findById(id);
    if (!document) {
      throw new AppError("Document not found", 404);
    }

    await this.documentRepository.delete(id);
    return { message: "Document deleted successfully" };
  }
}
