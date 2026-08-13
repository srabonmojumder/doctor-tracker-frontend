import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { requireAuth } from "./middleware/requireAuth";
import authRoutes from "./routes/auth.routes";
import doctorRoutes from "./routes/doctor.routes";
import patientRoutes from "./routes/patient.routes";
import dashboardRoutes from "./routes/dashboard.routes";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());
if (!env.isProduction) {
  app.use(morgan("dev"));
}

app.get("/health", (_req, res) => res.json({ success: true, status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/doctors", requireAuth, doctorRoutes);
app.use("/api/patients", requireAuth, patientRoutes);
app.use("/api/dashboard", requireAuth, dashboardRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
