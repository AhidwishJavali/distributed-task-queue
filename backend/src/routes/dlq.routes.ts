import { Router } from "express";
import dlqController from "../controllers/dlq.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);
router.delete(
    "/",
    dlqController.clearDLQ
);

router.get("/", dlqController.getFailedJobs);

router.post("/:id/retry", dlqController.retryJob);
router.delete(
    "/:id",
    dlqController.deleteJob
);

export default router;