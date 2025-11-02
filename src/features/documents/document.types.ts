import type { DocType, DocumentStatus } from "@prisma/client";

export interface Document {
  id: string;
  name: string;
  type: string;
  s3Key: string;
  memberId: string;
  uploadedAt: Date;
  expiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDocumentDto {
  s3Key: string;
  fileName: string;
  fileType: string;
  documentType: DocType;
  status: DocumentStatus;
  orgId: string;
  memberId: string;
}

export interface UploadDocumentDto {
  fileName: string;
  fileType: string;
  documentType: string;
  memberId: string;
  orgId: string;
}

export interface CompleteDocumentUploadDto {
  documentId: string;
  status: string;
  fileSize: number;
}

export interface GetDocumentDto {
  documentId: string;
  memberId: string;
  organisationId: string;
}

export interface GetDocumentsDto {
  memberId: string;
  organisationId: string;
}

export interface DeleteDocumentDto {
  documentId: string;
  memberId: string;
  organisationId: string;
}
