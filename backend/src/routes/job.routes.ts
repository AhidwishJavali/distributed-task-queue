import { Router } from "express";
import jobController from "../controllers/job.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/:id", jobController.getJobById);
router.post("/", jobController.createJob);
router.get("/", jobController.getAllJobs);
router.patch("/:id", jobController.updateJob);
router.delete("/:id", jobController.deleteJob);
router.delete("/", jobController.deleteAllJobs);

export default router;