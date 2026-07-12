import { Router } from "express";

import userController from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";
import { adminOnly } from "../middleware/admin.middleware";

const router = Router();

router.use(authenticate);
router.use(adminOnly);

router.get("/", userController.getUsers);

router.get(
    "/:id/jobs",
    userController.getUserJobs
);

router.delete(
    "/:id",
    userController.deleteUser
);

export default router;