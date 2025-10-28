export interface Organisation {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrganisationDto {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface UpdateOrganisationDto {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}
