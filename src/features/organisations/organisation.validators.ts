import { z } from "zod";

export const createOrganisationSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .min(1, { error: "Name is required" })
    .max(255, { error: "Name must be at most 255 characters" }),

  slug: z
    .string({ error: "Slug is required" })
    .min(1, { error: "Slug is required" })
    .max(100, { error: "Slug must be at most 100 characters" })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      error:
        "Slug can only contain lowercase letters, numbers, and dashes (no spaces or special characters)",
    })
    .transform(val => val.toLowerCase()),
  country: z
    .string({ error: "Country cannot be empty" })
    .min(1, { error: "Country cannot be empty" })
    .max(100, { error: "Country name too long" })
    .nullable(),
  address: z
    .string({ error: "Invalid address" })
    .max(500, { error: "Address too long" })
    .nullable(),
});

export const updateOrganisationSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .min(1, { error: "Name is required" })
    .max(255, { error: "Name must be at most 255 characters" }),

  slug: z
    .string({ error: "Slug is required" })
    .min(1, { error: "Slug is required" })
    .max(100, { error: "Slug must be at most 100 characters" })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      error:
        "Slug can only contain lowercase letters, numbers, and dashes (no spaces or special characters)",
    })
    .transform(val => val.toLowerCase()),
  country: z
    .string({ error: "Country cannot be empty" })
    .min(1, { error: "Country cannot be empty" })
    .max(100, { error: "Country name too long" })
    .nullable(),
  address: z
    .string({ error: "Invalid address" })
    .max(500, { error: "Address too long" })
    .nullable(),
});

export type CreateOrganisationInput = z.infer<typeof createOrganisationSchema>;
export type UpdateOrganisationInput = z.infer<typeof updateOrganisationSchema>;
