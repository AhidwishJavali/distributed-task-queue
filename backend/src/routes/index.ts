import { Router } from "express";
import jobRoutes from "./job.routes";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";

const router = Router();

router.use("/auth", authRoutes);

router.use("/jobs", jobRoutes);
router.use("/users", userRoutes);

export default router;