import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { sendSuccess } from "../utils/ApiResponse";
import { AUTH_COOKIE_NAME, authCookieOptions, signAuthToken } from "../utils/jwt";
import { loginSchema } from "../validators/auth.schema";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);

  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, admin.passwordHash);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signAuthToken({ sub: admin.id, email: admin.email });
  res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions);

  sendSuccess(res, { id: admin.id, email: admin.email });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie(AUTH_COOKIE_NAME, { ...authCookieOptions, maxAge: undefined });
  sendSuccess(res, { message: "Logged out" });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.admin) {
    throw ApiError.unauthorized();
  }
  sendSuccess(res, req.admin);
});
