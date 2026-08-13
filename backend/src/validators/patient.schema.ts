import { z } from "zod";

export const patientInputSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  age: z.coerce.number().int().min(0).max(130),
  gender: z.enum(["male", "female", "other"]),
  condition: z.string().trim().min(2, "Condition is required"),
  phone: z.string().trim().min(6, "Phone number looks too short"),
  address: z.string().trim().min(2, "Address is required"),
});

export const patientUpdateSchema = patientInputSchema.partial();

export const patientListQuerySchema = z.object({
  search: z.string().trim().optional(),
  condition: z.string().trim().optional(),
  doctor: z.string().trim().optional(),
  dateFrom: z.string().trim().optional(),
  dateTo: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sort: z.enum(["newest", "oldest", "name"]).default("newest"),
});

export type PatientInput = z.infer<typeof patientInputSchema>;
export type PatientListQuery = z.infer<typeof patientListQuerySchema>;
