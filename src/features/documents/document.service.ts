import { DocumentRepository } from "./document.repository.js";
import type {
  DeleteDocumentDto,
  GetDocumentDto,
  GetDocumentsDto,
  UploadDocumentDto,
} from "./document.types.js";
import path from "node:path";
import { randomUUID } from "node:crypto";
import {
  deleteObject,
  getPresignedGetUrl,
  getPresignedPutUrl,
  headObject,
} from "../../lib/s3-helpers.js";
import { DocType } from "@prisma/client";
import { Errors } from "../../shared/errors/AppError.js";

export class DocumentService {
  private documentRepository = new DocumentRepository();

  /**
   * Generates S3 key and presigned upload URL, creates PENDING document record
   * Returns: documentId, key, uploadUrl
   */
  async uploadDocument(data: UploadDocumentDto) {
    // Retrieve extension
    const ext = path.extname(data.fileName) || "";

    // Create a file path for S3 bucket
    // Organisation ID/Member ID/RandomUUID.Extension
    const key = `${data.orgId}/${data.memberId}/${randomUUID()}${ext}`;

    // Retrieve url that frontend will use to PUT the file to S3
    const uploadUrl = await getPresignedPutUrl(key, data.fileType, 300);

    // Create document row with "PENDING" status + key for later access
    const doc = await this.documentRepository.createDocument({
      s3Key: key,
      fileName: data.fileName,
      fileType: data.fileType,
      documentType: data.documentType as DocType,
      status: "PENDING",
      orgId: data.orgId,
      memberId: data.memberId,
    });

    return {
      documentId: doc.id,
      key,
      uploadUrl,
    };
  }

  /**
   * Verifies S3 upload, validates size, marks document as READY or FAILED
   * Returns: confirmation
   */
  async completeDocumentUpload(documentId: string, expectedSize?: number) {
    const doc = await this.documentRepository.findById(documentId);

    if (!doc) {
      throw Errors.notFound();
    }

    try {
      const head = await headObject(doc.s3Key);
      const size = Number(head.ContentLength ?? 0);

      if (expectedSize && expectedSize !== size) {
        await this.documentRepository.markDocumentAsFailed(doc.id);
        throw Errors.badRequest({ message: "Size mismatch" });
      }

      await this.documentRepository.completeDocumentUpload({
        documentId,
        fileSize: size,
        status: "READY",
      });

      return { ok: true };
    } catch (error) {
      // If it's already a custom error (like size mismatch), re-throw it
      if (error instanceof Error && error.constructor.name === "AppError") {
        throw error;
      }
      // Otherwise, it's an S3 error
      await this.documentRepository.markDocumentAsFailed(doc.id);
      throw Errors.badRequest({ message: "Object not found in S3" });
    }
  }

  /**
   * Lists all READY documents for a member
   * Returns: array of documents
   */
  async listDocumentsByMember(data: GetDocumentsDto) {
    return await this.documentRepository.findDocumentsByMember(data);
  }

  /**
   * Validates document is READY, generates presigned download URL
   * Returns: presigned S3 URL (valid 90s)
   */
  async getDocument(data: GetDocumentDto) {
    const doc = await this.documentRepository.findDocument(data);

    if (!doc) {
      throw Errors.notFound({ message: "Document not found" });
    }

    if (doc.status !== "READY") {
      throw Errors.badRequest({ message: "Document not ready" });
    }

    return await getPresignedGetUrl(doc.s3Key, doc.fileName, 90);
  }

  /**
   * Deletes from S3, marks as DELETED in DB
   * Returns: confirmation
   */
  async deleteDocument(data: DeleteDocumentDto) {
    const doc = await this.documentRepository.findDocumentToDelete(data);

    if (!doc) {
      throw Errors.notFound({ message: "Document not found" });
    }

    // Delete from S3 (ignore errors as file might not exist)
    await deleteObject(doc.s3Key).catch(() => {});

    // Mark document as deleted in database
    await this.documentRepository.markDocumentAsDeleted(doc.id);

    return { ok: true };
  }
}
