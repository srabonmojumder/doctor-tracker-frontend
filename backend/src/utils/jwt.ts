import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthTokenPayload {
  sub: string;
  email: string;
}

export function signAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"] });
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  return jwt.verify(token, env.jwtSecret) as AuthTokenPayload;
}

export const AUTH_COOKIE_NAME = "dt_token";

export const authCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: env.isProduction,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};
