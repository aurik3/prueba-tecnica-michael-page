import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const booleanFromEnv = z.union([z.boolean(), z.string()]).transform((value) => {
  if (typeof value === "boolean") {
    return value;
  }

  return value.toLowerCase() === "true";
});

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  API_BASE_URL: z.string().url().default("http://localhost:4000"),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.coerce.number().default(3306),
  DB_NAME: z.string().default("amm_approval"),
  DB_USER: z.string().default("root"),
  DB_PASSWORD: z.string().default("password"),
  DB_LOGGING: booleanFromEnv.default(false),
  PDF_STORAGE_DRIVER: z.enum(["local", "s3"]).default("local"),
  PDF_LOCAL_DIR: z.string().default("storage/evidence"),
  OTP_TTL_MINUTES: z.coerce.number().default(3)
});

export const env = envSchema.parse(process.env);
