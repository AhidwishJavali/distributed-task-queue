import { Router } from "express";
import dlqController from "../controllers/dlq.controller";

const router = Router();
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