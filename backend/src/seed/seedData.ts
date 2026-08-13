import bcrypt from "bcryptjs";
import { env } from "../config/env";
import { Admin } from "../models/Admin";
import { Doctor } from "../models/Doctor";
import { Patient, PatientGender } from "../models/Patient";

const specializations = [
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Dermatology",
  "Oncology",
  "Psychiatry",
  "General Medicine",
];

const hospitals = [
  "City General Hospital",
  "Sunrise Medical Center",
  "St. Mary's Hospital",
  "Green Valley Clinic",
  "Metro Health Institute",
];

const conditions = [
  "Hypertension",
  "Diabetes",
  "Asthma",
  "Migraine",
  "Arthritis",
  "Allergy",
  "Anxiety",
  "Fracture",
  "Skin Infection",
  "Routine Checkup",
];

const genders: PatientGender[] = ["male", "female", "other"];

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomDateWithinDays(days: number): Date {
  const now = Date.now();
  const past = now - Math.floor(Math.random() * days) * 24 * 60 * 60 * 1000;
  return new Date(past);
}

// Creates the admin account only if it doesn't already exist - safe to call on every boot.
export async function ensureAdminSeeded(): Promise<void> {
  const email = env.adminEmail.toLowerCase();
  const existing = await Admin.findOne({ email });
  if (existing) return;

  const passwordHash = await bcrypt.hash(env.adminPassword, 10);
  await Admin.create({ email, passwordHash });
  console.log(`Seeded admin account: ${email}`);
}

// Inserts sample doctors/patients only if the collections are empty - safe to call on every boot.
export async function ensureSampleDataSeeded(): Promise<void> {
  const existingDoctors = await Doctor.countDocuments();
  if (existingDoctors > 0) return;

  const doctorNames = [
    "Dr. Ayesha Rahman",
    "Dr. Michael Chen",
    "Dr. Fatima Islam",
    "Dr. James Wilson",
    "Dr. Priya Sharma",
    "Dr. Tanvir Ahmed",
    "Dr. Sarah Johnson",
    "Dr. Kabir Hasan",
    "Dr. Emily Davis",
    "Dr. Rezaul Karim",
    "Dr. Laura Martinez",
    "Dr. Nasrin Akter",
  ];

  const doctors = await Doctor.insertMany(
    doctorNames.map((name, i) => ({
      name,
      specialization: specializations[i % specializations.length],
      hospital: randomItem(hospitals),
      phone: `+1-555-01${String(i).padStart(2, "0")}`,
      email: `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@doctortracker.com`,
      createdAt: randomDateWithinDays(180),
    }))
  );

  const patientFirstNames = [
    "Alex", "Jordan", "Sam", "Taylor", "Morgan", "Riya", "Arif", "Nadia",
    "Omar", "Sophia", "Liam", "Noah", "Emma", "Zainab", "Rafiq", "Chloe",
  ];
  const patientLastNames = [
    "Khan", "Smith", "Begum", "Brown", "Islam", "Garcia", "Ahmed", "Lee",
    "Miller", "Hossain", "Wilson", "Roy",
  ];

  const patientsToInsert = [];
  for (const doctor of doctors) {
    const patientCount = 2 + Math.floor(Math.random() * 6);
    for (let i = 0; i < patientCount; i++) {
      patientsToInsert.push({
        name: `${randomItem(patientFirstNames)} ${randomItem(patientLastNames)}`,
        age: 5 + Math.floor(Math.random() * 80),
        gender: randomItem(genders),
        condition: randomItem(conditions),
        phone: `+1-555-02${String(patientsToInsert.length).padStart(2, "0")}`,
        address: `${100 + patientsToInsert.length} Main Street`,
        doctor: doctor._id,
        createdAt: randomDateWithinDays(120),
      });
    }
  }

  const patients = await Patient.insertMany(patientsToInsert);
  console.log(`Seeded ${doctors.length} doctors and ${patients.length} patients.`);
}
