import { prisma } from "../../config/prisma.js";
import type {
  CompleteDocumentUploadDto,
  CreateDocumentDto,
  DeleteDocumentDto,
  GetDocumentDto,
  GetDocumentsDto,
} from "./document.types.js";

export class DocumentRepository {
  /**
   * Creates document record with PENDING status
   * Returns: created document
   */
  async createDocument(data: CreateDocumentDto) {
    return await prisma.document.create({
      data: {
        s3Key: data.s3Key,
        fileName: data.fileName,
        fileType: data.fileType,
        documentType: data.documentType,
        status: data.status,
        orgId: data.orgId,
        memberId: data.memberId,
      },
    });
  }

  /**
   * Marks document as READY, sets file size
   * Returns: updated document
   */
  async completeDocumentUpload(data: CompleteDocumentUploadDto) {
    return await prisma.document.update({
      where: { id: data.documentId },
      data: { status: "READY", fileSize: data.fileSize },
    });
  }

  /**
   * Marks document as FAILED
   * Returns: updated document
   */
  async markDocumentAsFailed(documentId: string) {
    return await prisma.document.update({
      where: { id: documentId },
      data: { status: "FAILED" },
    });
  }

  /**
   * Finds document by ID
   * Returns: document or null
   */
  async findById(documentId: string) {
    return await prisma.document.findUnique({
      where: { id: documentId },
    });
  }

  /**
   * Finds document with member and org validation
   * Returns: document or null
   */
  async findDocument(data: GetDocumentDto) {
    return await prisma.document.findUnique({
      where: {
        id: data.documentId,
        memberId: data.memberId,
        orgId: data.organisationId,
      },
    });
  }

  /**
   * Lists all READY documents for a member
   * Returns: array of documents
   */
  async findDocumentsByMember(data: GetDocumentsDto) {
    return await prisma.document.findMany({
      where: {
        memberId: data.memberId,
        orgId: data.organisationId,
        status: "READY",
      },
      select: {
        id: true,
        fileName: true,
        fileType: true,
        documentType: true,
        createdAt: true,
        updatedAt: true,
        orgId: false,
        memberId: false,
        s3Key: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Finds document with member and org validation for deletion
   * Returns: document or null
   */
  async findDocumentToDelete(data: DeleteDocumentDto) {
    return await prisma.document.findUnique({
      where: {
        id: data.documentId,
        memberId: data.memberId,
        orgId: data.organisationId,
      },
    });
  }

  /**
   * Marks document as DELETED
   * Returns: updated document
   */
  async markDocumentAsDeleted(documentId: string) {
    return await prisma.document.update({
      where: { id: documentId },
      data: { status: "DELETED" },
    });
  }
}
