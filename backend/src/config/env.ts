import dotenv from "dotenv";

dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  isProduction: process.env.NODE_ENV === "production",
  mongodbUri: process.env.MONGODB_URI ?? "",
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  adminEmail: process.env.ADMIN_EMAIL ?? "admin@doctortracker.com",
  adminPassword: process.env.ADMIN_PASSWORD ?? "ChangeMe123!",
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:3000",
};
