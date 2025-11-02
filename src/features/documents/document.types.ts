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
  name: string;
  type: string;
  s3Key: string;
  memberId: string;
  expiresAt?: Date;
}

export interface UploadDocumentDto {
  file: File;
  name: string;
  type: string;
  memberId: string;
  expiresAt?: Date;
}
