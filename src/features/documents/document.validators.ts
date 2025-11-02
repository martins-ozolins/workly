import { z } from "zod";

export const DocumentType = z.enum(
  ["passport", "national_id", "visa_permit", "contract", "tax_form", "other"],
  {
    error: "Invalid document type",
  }
);

export const FileType = z.enum(["application/pdf", "image/png", "image/jpeg"], {
  error:
    "Invalid file type. Allowed types: application/pdf, image/png, image/jpeg",
});

export const uploadDocumentSchema = z.object({
  fileName: z
    .string({ error: "File name is required" })
    .min(1, { error: "File name is required" })
    .max(255, { error: "File name must be at most 255 characters" }),

  fileType: FileType,

  documentType: DocumentType,
});

export const completeDocumentUploadSchema = z.object({
  documentId: z.uuid({ error: "Document ID is invalid" }),

  expectedSize: z
    .number({ error: "Expected size must be a number" })
    .int({ error: "Expected size must be an integer" })
    .positive({ error: "Expected size must be positive" })
    .optional(),
});

export const getDocumentSchema = z.object({
  documentId: z.uuid({ error: "Document ID is invalid" }),
  memberId: z.uuid({ error: "Member ID is invalid" }),
  organisationId: z.uuid({ error: "Organisation ID is invalid" }),
});

export const getDocumentsSchema = z.object({
  memberId: z.uuid({ error: "Member ID is invalid" }),
  organisationId: z.uuid({ error: "Organisation ID is invalid" }),
});

export const deleteDocumentSchema = z.object({
  documentId: z.uuid({ error: "Document ID is invalid" }),
  memberId: z.uuid({ error: "Member ID is invalid" }),
  organisationId: z.uuid({ error: "Organisation ID is invalid" }),
});
