import { Router } from "express";
import jobRoutes from "./job.routes";
import authRoutes from "./auth.routes";

const router = Router();

router.use("/auth", authRoutes);

router.use("/jobs", jobRoutes);

export default router;