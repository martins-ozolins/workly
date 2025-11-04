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
