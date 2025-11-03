import { DocumentRepository } from "./document.repository.js";
import type {
  CompleteDocumentUploadDto,
  DeleteDocumentDto,
  GetDocumentDto,
  GetDocumentsDto,
  UpdateDocumentDto,
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
  private readonly MAX_FILE_SIZE = 50 * 1024 * 1024;

  /**
   * Generates S3 key and presigned upload URL, creates PENDING document record
   * Returns: documentId, key, uploadUrl
   */
  async uploadDocument(data: UploadDocumentDto) {
    const ext = path.extname(data.fileName).toLowerCase();
    const allowedExts = [".pdf", ".png", ".jpg", ".jpeg"];

    if (!allowedExts.includes(ext)) {
      throw Errors.badRequest({
        message: `Invalid file extension. Allowed: ${allowedExts.join(", ")}`,
      });
    }

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
  async completeDocumentUpload(data: CompleteDocumentUploadDto) {
    // Validate document ownership - ensures documentId belongs to the member/org
    const doc = await this.documentRepository.findDocument({
      documentId: data.documentId,
      memberId: data.memberId,
      organisationId: data.organisationId,
    });

    if (!doc) {
      throw Errors.notFound({ message: "Document not found" });
    }

    if (data.expectedSize > this.MAX_FILE_SIZE) {
      await deleteObject(doc.s3Key).catch(() => {});
      await this.documentRepository.markDocumentAsFailed(doc.id);
      throw Errors.badRequest({
        message: `File size exceeds maximum limit of ${this.MAX_FILE_SIZE / 1024 / 1024}MB`
      });
    }

    try {
      const head = await headObject(doc.s3Key);
      const size = Number(head.ContentLength ?? 0);

      if (data.expectedSize !== size) {
        await this.documentRepository.markDocumentAsFailed(doc.id);
        throw Errors.badRequest({
          message: `File size mismatch. Expected ${data.expectedSize} bytes, got ${size} bytes`,
        });
      }

      await this.documentRepository.completeDocumentUpload({
        documentId: data.documentId,
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

  /**
   * Updates an existing document by replacing it in S3
   * Generates new S3 key and presigned upload URL, updates document record
   * Returns: documentId, key, uploadUrl
   */
  async updateDocument(data: UpdateDocumentDto) {
    // Find existing document
    const doc = await this.documentRepository.findDocument({
      documentId: data.documentId,
      memberId: data.memberId,
      organisationId: data.organisationId,
    });

    if (!doc) {
      throw Errors.notFound({ message: "Document not found" });
    }

    const oldS3Key = doc.s3Key;

    const ext = path.extname(data.fileName).toLowerCase();
    const allowedExts = [".pdf", ".png", ".jpg", ".jpeg"];

    if (!allowedExts.includes(ext)) {
      throw Errors.badRequest({
        message: `Invalid file extension. Allowed: ${allowedExts.join(", ")}`,
      });
    }

    const newKey = `${data.organisationId}/${data.memberId}/${randomUUID()}${ext}`;

    // Retrieve url that frontend will use to PUT the file to S3
    const uploadUrl = await getPresignedPutUrl(newKey, data.fileType, 300);

    // Update document with new key and set status to PENDING
    await this.documentRepository.updateDocument({
      documentId: data.documentId,
      s3Key: newKey,
      fileName: data.fileName,
      fileType: data.fileType,
      documentType: data.documentType as DocType,
      status: "PENDING",
    });

    // Delete old file from S3 (ignore errors as file might not exist)
    await deleteObject(oldS3Key).catch(() => {});

    return {
      documentId: doc.id,
      key: newKey,
      uploadUrl,
    };
  }
}
