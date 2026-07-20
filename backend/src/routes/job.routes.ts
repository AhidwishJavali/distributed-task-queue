import { Router } from "express";
import jobController from "../controllers/job.controller";


const router = Router();




/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Create a new job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *     responses:
 *       201:
 *         description: Job created successfully
 */
router.post("/", (req, res, next) =>
    jobController.createJob(req, res, next)
);

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get all jobs
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of jobs
 */
router.get("/", (req, res, next) =>
    jobController.getAllJobs(req, res, next)
);

router.get(
    "/statistics",
    (req, res, next) => jobController.getStatistics(req, res, next)
);
/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Get a job by ID
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job details
 *       404:
 *         description: Job not found
 */
router.get("/:id", (req, res, next) =>
    jobController.getJobById(req, res, next)
);

router.get(
    "/:id/logs",
    (req, res, next) => jobController.getJobLogs(req, res, next)
);
/**
 * @swagger
 * /jobs/{id}:
 *   patch:
 *     summary: Update a job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Job updated successfully
 */
router.patch("/:id", (req, res, next) =>
    jobController.updateJob(req, res, next)
);

/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     summary: Delete a job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job deleted successfully
 */
router.delete("/:id", (req, res, next) =>
    jobController.deleteJob(req, res, next)
);

/**
 * @swagger
 * /jobs:
 *   delete:
 *     summary: Delete all jobs (Admin or own jobs)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Jobs deleted successfully
 */
router.delete("/", (req, res, next) =>
    jobController.deleteAllJobs(req, res, next)
);

export default router;