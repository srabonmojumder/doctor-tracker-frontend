import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { AUTH_COOKIE_NAME, verifyAuthToken } from "../utils/jwt";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[AUTH_COOKIE_NAME];
  if (!token) {
    return next(ApiError.unauthorized());
  }

  try {
    const payload = verifyAuthToken(token);
    req.admin = { id: payload.sub, email: payload.email };
    next();
  } catch {
    next(ApiError.unauthorized("Invalid or expired session"));
  }
}
