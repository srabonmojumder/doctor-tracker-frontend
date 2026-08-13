import { z } from "zod";

export const doctorInputSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  specialization: z.string().trim().min(2, "Specialization is required"),
  hospital: z.string().trim().min(2, "Hospital is required"),
  phone: z.string().trim().min(6, "Phone number looks too short"),
  email: z.string().trim().email("Invalid email"),
});

export const doctorUpdateSchema = doctorInputSchema.partial();

export const doctorListQuerySchema = z.object({
  search: z.string().trim().optional(),
  specialization: z.string().trim().optional(),
  dateFrom: z.string().trim().optional(),
  dateTo: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sort: z.enum(["newest", "oldest", "name"]).default("newest"),
});

export type DoctorInput = z.infer<typeof doctorInputSchema>;
export type DoctorListQuery = z.infer<typeof doctorListQuerySchema>;
