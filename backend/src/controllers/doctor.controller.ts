import { Request, Response } from "express";
import { FilterQuery } from "mongoose";
import { Doctor, DoctorDocument } from "../models/Doctor";
import { Patient } from "../models/Patient";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { sendSuccess } from "../utils/ApiResponse";
import { doctorInputSchema, doctorListQuerySchema, doctorUpdateSchema } from "../validators/doctor.schema";

const SORT_MAP: Record<string, Record<string, 1 | -1>> = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  name: { name: 1 },
};

export const listDoctors = asyncHandler(async (req: Request, res: Response) => {
  const query = doctorListQuerySchema.parse(req.query);
  const filter: FilterQuery<DoctorDocument> = {};

  if (query.search) {
    filter.$text = { $search: query.search };
  }
  if (query.specialization) {
    filter.specialization = query.specialization;
  }
  if (query.dateFrom || query.dateTo) {
    filter.createdAt = {};
    if (query.dateFrom) filter.createdAt.$gte = new Date(query.dateFrom);
    if (query.dateTo) filter.createdAt.$lte = new Date(query.dateTo);
  }

  const skip = (query.page - 1) * query.limit;

  const [doctors, total] = await Promise.all([
    Doctor.find(filter).sort(SORT_MAP[query.sort]).skip(skip).limit(query.limit).lean(),
    Doctor.countDocuments(filter),
  ]);

  // One aggregation call for patient counts across the current page of doctors,
  // instead of an N+1 query per doctor.
  const doctorIds = doctors.map((d) => d._id);
  const counts = await Patient.aggregate([
    { $match: { doctor: { $in: doctorIds } } },
    { $group: { _id: "$doctor", count: { $sum: 1 } } },
  ]);
  const countMap = new Map(counts.map((c) => [String(c._id), c.count]));

  const data = doctors.map((doctor) => ({
    ...doctor,
    patientCount: countMap.get(String(doctor._id)) ?? 0,
  }));

  sendSuccess(res, data, {
    page: query.page,
    limit: query.limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / query.limit)),
  });
});

export const getDoctor = asyncHandler(async (req: Request, res: Response) => {
  const doctor = await Doctor.findById(req.params.id).lean();
  if (!doctor) throw ApiError.notFound("Doctor not found");

  const patientCount = await Patient.countDocuments({ doctor: doctor._id });
  sendSuccess(res, { ...doctor, patientCount });
});

export const createDoctor = asyncHandler(async (req: Request, res: Response) => {
  const input = doctorInputSchema.parse(req.body);
  const doctor = await Doctor.create(input);
  sendSuccess(res, doctor, undefined, 201);
});

export const updateDoctor = asyncHandler(async (req: Request, res: Response) => {
  const input = doctorUpdateSchema.parse(req.body);
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, input, { new: true });
  if (!doctor) throw ApiError.notFound("Doctor not found");
  sendSuccess(res, doctor);
});

export const deleteDoctor = asyncHandler(async (req: Request, res: Response) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) throw ApiError.notFound("Doctor not found");

  await Promise.all([
    Doctor.deleteOne({ _id: doctor._id }),
    Patient.deleteMany({ doctor: doctor._id }),
  ]);
  sendSuccess(res, { id: doctor.id });
});

export const listSpecializations = asyncHandler(async (_req: Request, res: Response) => {
  const specializations = await Doctor.distinct("specialization");
  sendSuccess(res, specializations.sort());
});
