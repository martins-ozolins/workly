import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

const schema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
});

const parsed = schema.parse(process.env);
export const config = parsed;
