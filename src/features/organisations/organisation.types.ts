// Database entity type
export interface Organisation {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// For validation DTOs, use Zod-inferred types from organisation.validators.ts:
// - CreateOrganisationInput
// - UpdateOrganisationInput
