import { Schema, model, Document } from "mongoose";

export interface AdminDocument extends Document {
  email: string;
  passwordHash: string;
  createdAt: Date;
}

const adminSchema = new Schema<AdminDocument>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Admin = model<AdminDocument>("Admin", adminSchema);
