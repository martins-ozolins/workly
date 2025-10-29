import { type User } from "src/lib/auth.ts";
import { type Role } from "@prisma/client";

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: User;
      organisationId?: string;
      member?: {
        id: string;
        role: Role;
      };
    }
  }
}
