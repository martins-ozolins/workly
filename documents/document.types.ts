export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  memberId: string;
  uploadedAt: Date;
  expiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDocumentDto {
  name: string;
  type: string;
  url: string;
  memberId: string;
  expiresAt?: Date;
}

export interface UpdateDocumentDto {
  name?: string;
  type?: string;
  url?: string;
  memberId?: string;
  expiresAt?: Date;
}
