export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  organisationId: string;
  userId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMemberDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  organisationId: string;
  userId?: string;
}

export interface UpdateMemberDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  organisationId?: string;
  userId?: string;
}
