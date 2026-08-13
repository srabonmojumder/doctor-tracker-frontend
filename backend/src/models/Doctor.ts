import { Schema, model, Document } from "mongoose";

export interface DoctorDocument extends Document {
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const doctorSchema = new Schema<DoctorDocument>(
  {
    name: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true },
    hospital: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
  },
  { timestamps: true }
);

// Text index powers free-text search across name/specialization/hospital.
doctorSchema.index({ name: "text", specialization: "text", hospital: "text" });
// Supports the specialization filter and date-wise sort/filter efficiently.
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ createdAt: -1 });

export const Doctor = model<DoctorDocument>("Doctor", doctorSchema);
