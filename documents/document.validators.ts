import { z } from "zod";

export const createDocumentSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.string().min(1).max(100),
  url: z.string().url(),
  memberId: z.string().uuid(),
  expiresAt: z.string().datetime().optional(),
});

export const updateDocumentSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  type: z.string().min(1).max(100).optional(),
  url: z.string().url().optional(),
  memberId: z.string().uuid().optional(),
  expiresAt: z.string().datetime().optional(),
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
