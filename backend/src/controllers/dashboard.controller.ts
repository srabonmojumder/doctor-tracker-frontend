import { Request, Response } from "express";
import { Doctor } from "../models/Doctor";
import { Patient } from "../models/Patient";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/ApiResponse";

const REGISTRATION_WINDOW_DAYS = 30;

function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export const getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  const since = new Date();
  since.setDate(since.getDate() - (REGISTRATION_WINDOW_DAYS - 1));
  since.setHours(0, 0, 0, 0);

  const [
    totalDoctors,
    totalPatients,
    patientsPerDoctorRaw,
    specializationDistribution,
    conditionDistribution,
    doctorRegistrations,
    patientRegistrations,
  ] = await Promise.all([
    Doctor.countDocuments(),
    Patient.countDocuments(),
    Patient.aggregate([
      { $group: { _id: "$doctor", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "doctors",
          localField: "_id",
          foreignField: "_id",
          as: "doctor",
        },
      },
      { $unwind: "$doctor" },
      { $project: { _id: 0, doctorId: "$doctor._id", doctorName: "$doctor.name", count: 1 } },
    ]),
    Doctor.aggregate([
      { $group: { _id: "$specialization", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, specialization: "$_id", count: 1 } },
    ]),
    Patient.aggregate([
      { $group: { _id: "$condition", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
      { $project: { _id: 0, condition: "$_id", count: 1 } },
    ]),
    Doctor.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
    ]),
    Patient.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
    ]),
  ]);

  const doctorCountByDay = new Map(doctorRegistrations.map((d) => [d._id as string, d.count as number]));
  const patientCountByDay = new Map(patientRegistrations.map((d) => [d._id as string, d.count as number]));

  const registrationsByDate = Array.from({ length: REGISTRATION_WINDOW_DAYS }, (_, i) => {
    const date = new Date(since);
    date.setDate(date.getDate() + i);
    const key = dayKey(date);
    return {
      date: key,
      doctors: doctorCountByDay.get(key) ?? 0,
      patients: patientCountByDay.get(key) ?? 0,
    };
  });

  sendSuccess(res, {
    totalDoctors,
    totalPatients,
    avgPatientsPerDoctor: totalDoctors > 0 ? Number((totalPatients / totalDoctors).toFixed(1)) : 0,
    patientsPerDoctor: patientsPerDoctorRaw,
    specializationDistribution,
    conditionDistribution,
    registrationsByDate,
  });
});
