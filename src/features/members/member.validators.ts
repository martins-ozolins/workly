import { z } from "zod";

export const RoleEnum = z.enum(["admin", "hr", "employee"], {
  error: "Invalid role",
});

export const createMemberForOrgSchema = z.object({
  orgId: z.uuid({ error: "Invalid organisation id" }),

  userId: z.uuid({ error: "Invalid userId" }).nullable(),

  role: RoleEnum,

  name: z
    .string({ error: "Name is required" })
    .min(1, { error: "Name is required" })
    .max(255, { error: "Name must be at most 255 characters" }),

  email: z
    .email({ error: "Invalid email format" })
    .max(320, { error: "Email too long" }),

  dept: z
    .string({ error: "Invalid department" })
    .max(100, { error: "Department too long" })
    .nullable(),

  startDate: z.iso.datetime().nullable(),

  status: z
    .string({ error: "Invalid status" })
    .max(50, { error: "Status too long" }),
  country: z
    .string({ error: "Invalid country" })
    .max(100, { error: "Country name too long" })
    .nullable(),
});

export const updateMemberSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .min(1, { error: "Name is required" })
    .max(255, { error: "Name must be at most 255 characters" }),
  email: z
    .email({ error: "Invalid email format" })
    .max(320, { error: "Email too long" }),

  role: RoleEnum,
  dept: z
    .string({ error: "Invalid department" })
    .max(100, { error: "Department too long" })
    .nullable(),
  startDate: z.iso.datetime().nullable(),
  status: z
    .string({ error: "Invalid status" })
    .max(50, { error: "Status too long" }),
  country: z
    .string({ error: "Invalid country" })
    .max(100, { error: "Country name too long" })
    .nullable(),
});

export type CreateMemberForOrgInput = z.infer<typeof createMemberForOrgSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;
