import { Request, Response } from "express";
import { FilterQuery } from "mongoose";
import { Patient, PatientDocument } from "../models/Patient";
import { Doctor } from "../models/Doctor";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { sendSuccess } from "../utils/ApiResponse";
import { patientInputSchema, patientListQuerySchema, patientUpdateSchema } from "../validators/patient.schema";

const SORT_MAP: Record<string, Record<string, 1 | -1>> = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  name: { name: 1 },
};

function buildFilter(query: ReturnType<typeof patientListQuerySchema.parse>): FilterQuery<PatientDocument> {
  const filter: FilterQuery<PatientDocument> = {};

  if (query.search) {
    filter.$text = { $search: query.search };
  }
  if (query.condition) {
    filter.condition = query.condition;
  }
  if (query.doctor) {
    filter.doctor = query.doctor;
  }
  if (query.dateFrom || query.dateTo) {
    filter.createdAt = {};
    if (query.dateFrom) filter.createdAt.$gte = new Date(query.dateFrom);
    if (query.dateTo) filter.createdAt.$lte = new Date(query.dateTo);
  }

  return filter;
}

async function paginatedPatients(res: Response, filter: FilterQuery<PatientDocument>, query: ReturnType<typeof patientListQuerySchema.parse>) {
  const skip = (query.page - 1) * query.limit;

  const [patients, total] = await Promise.all([
    Patient.find(filter)
      .sort(SORT_MAP[query.sort])
      .skip(skip)
      .limit(query.limit)
      .populate("doctor", "name specialization hospital")
      .lean(),
    Patient.countDocuments(filter),
  ]);

  sendSuccess(res, patients, {
    page: query.page,
    limit: query.limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / query.limit)),
  });
}

export const listPatients = asyncHandler(async (req: Request, res: Response) => {
  const query = patientListQuerySchema.parse(req.query);
  await paginatedPatients(res, buildFilter(query), query);
});

export const listPatientsForDoctor = asyncHandler(async (req: Request, res: Response) => {
  const doctorId = req.params.doctorId;
  const doctor = await Doctor.findById(doctorId).lean();
  if (!doctor) throw ApiError.notFound("Doctor not found");

  const query = patientListQuerySchema.parse(req.query);
  const filter = buildFilter(query);
  filter.doctor = doctorId;
  await paginatedPatients(res, filter, query);
});

export const getPatient = asyncHandler(async (req: Request, res: Response) => {
  const patient = await Patient.findById(req.params.id).populate("doctor", "name specialization hospital");
  if (!patient) throw ApiError.notFound("Patient not found");
  sendSuccess(res, patient);
});

export const createPatientForDoctor = asyncHandler(async (req: Request, res: Response) => {
  const doctorId = req.params.doctorId;
  const doctor = await Doctor.findById(doctorId).lean();
  if (!doctor) throw ApiError.notFound("Doctor not found");

  const input = patientInputSchema.parse(req.body);
  const patient = await Patient.create({ ...input, doctor: doctorId });
  sendSuccess(res, patient, undefined, 201);
});

export const updatePatient = asyncHandler(async (req: Request, res: Response) => {
  const input = patientUpdateSchema.parse(req.body);
  const patient = await Patient.findByIdAndUpdate(req.params.id, input, { new: true }).populate(
    "doctor",
    "name specialization hospital"
  );
  if (!patient) throw ApiError.notFound("Patient not found");
  sendSuccess(res, patient);
});

export const deletePatient = asyncHandler(async (req: Request, res: Response) => {
  const patientId = req.params.id ?? req.params.patientId;
  const patient = await Patient.findByIdAndDelete(patientId);
  if (!patient) throw ApiError.notFound("Patient not found");
  sendSuccess(res, { id: patient.id });
});

export const listConditions = asyncHandler(async (_req: Request, res: Response) => {
  const conditions = await Patient.distinct("condition");
  sendSuccess(res, conditions.sort());
});
