import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string({ error: "" }).min(1).max(255).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
