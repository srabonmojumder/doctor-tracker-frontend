import { Router } from "express";
import {
  createDoctor,
  deleteDoctor,
  getDoctor,
  listDoctors,
  listSpecializations,
  updateDoctor,
} from "../controllers/doctor.controller";
import {
  createPatientForDoctor,
  deletePatient,
  listPatientsForDoctor,
} from "../controllers/patient.controller";

const router = Router();

router.get("/", listDoctors);
router.post("/", createDoctor);
router.get("/specializations", listSpecializations);
router.get("/:id", getDoctor);
router.put("/:id", updateDoctor);
router.delete("/:id", deleteDoctor);

// Patients scoped to a specific doctor.
router.get("/:doctorId/patients", listPatientsForDoctor);
router.post("/:doctorId/patients", createPatientForDoctor);
router.delete("/:doctorId/patients/:patientId", deletePatient);

export default router;
