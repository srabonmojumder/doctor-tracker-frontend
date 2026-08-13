import { Response } from "express";

export function sendSuccess<T>(res: Response, data: T, meta?: Record<string, unknown>, statusCode = 200) {
  return res.status(statusCode).json({ success: true, data, ...(meta ? { meta } : {}) });
}
