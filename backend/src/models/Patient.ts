import { Schema, model, Document, Types } from "mongoose";

export type PatientGender = "male" | "female" | "other";

export interface PatientDocument extends Document {
  name: string;
  age: number;
  gender: PatientGender;
  condition: string;
  phone: string;
  address: string;
  doctor: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const patientSchema = new Schema<PatientDocument>(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0, max: 130 },
    gender: { type: String, required: true, enum: ["male", "female", "other"] },
    condition: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
  },
  { timestamps: true }
);

// Text index powers free-text search across name/condition.
patientSchema.index({ name: "text", condition: "text" });
// Speeds up "patients for a given doctor" lookups and doctor-deletion checks.
patientSchema.index({ doctor: 1 });
patientSchema.index({ condition: 1 });
patientSchema.index({ createdAt: -1 });

export const Patient = model<PatientDocument>("Patient", patientSchema);
