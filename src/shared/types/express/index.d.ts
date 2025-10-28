import { type User } from "src/lib/auth.ts";

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
