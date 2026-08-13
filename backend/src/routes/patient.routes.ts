import { Router } from "express";
import {
  deletePatient,
  getPatient,
  listConditions,
  listPatients,
  updatePatient,
} from "../controllers/patient.controller";

const router = Router();

router.get("/", listPatients);
router.get("/conditions", listConditions);
router.get("/:id", getPatient);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);

export default router;
