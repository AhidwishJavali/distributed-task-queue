import { Request, Response, NextFunction } from "express";
import jobService from "../services/job.service";
import { createJobSchema } from "../validators/job.validators";
import { CreateJobDTO,  JobParams } from "../types/job.types";
import { updateJobSchema } from "../validators/job.validators";
import { AuthRequest } from "../middleware/auth.middleware";

class JobController {
  async createJob(req: Request, res: Response) {
    try {
      // Validate request body
      const validatedData = createJobSchema.parse(req.body);

     const userId = (req as AuthRequest).user.id;

const job = await jobService.createJob({
    ...validatedData,
    userId,
});

      // Send success response
       res.status(201).json({
        success: true,
        message: "Job created successfully",
        data: job,
      });
      return;
    } catch (error: any) {
      next(error);
    }
  }
  async getAllJobs(req: Request, res: Response,
    next: NextFunction) {
    try {
        const userId = (req as AuthRequest).user.id;

const { id, role } = (req as AuthRequest).user;

const jobs = await jobService.getAllJobs(
    id,
    role
);

        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });
        return;

    } catch (error: any) {

        next(error);
        return;

    }
}
async getJobById(
    req: Request<JobParams>,
    res: Response,
    next: NextFunction
) {
    try {

        const { id } = req.params;
        const user = (req as AuthRequest).user;
        const job = await jobService.getJobById(
    id,
    user.id,
    user.role
);
        if (!job) {
             res.status(404).json({
                success: false,
                message: "Job not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: job,
        });
        return;

    } catch (error: any) {

        next(error);
        return;

    }
}
async updateJob(req: Request<JobParams>, res: Response, next: NextFunction) {
    try {

        const { id } = req.params;
        const user = (req as AuthRequest).user;

        const validatedData = updateJobSchema.parse(req.body);

        // Convert ISO strings to Date objects if present
        const updateData = {
            ...validatedData,
            startedAt: validatedData.startedAt
                ? new Date(validatedData.startedAt)
                : undefined,
            completedAt: validatedData.completedAt
                ? new Date(validatedData.completedAt)
                : undefined,
        };

        const job = await jobService.updateJob(
    id,
    user.id,
    user.role,
    updateData
);
    res.status(200).json({
            success: true,
            message: "Job updated successfully",
            data: job,
        });
        return;

    } catch (error: any) {

        // Prisma throws if record doesn't exist
        if (error.code === "P2025") {
             res.status(404).json({
                success: false,
                message: "Job not found",
            });
            return;
        }

        next(error);
    }
}
async deleteJob(req: Request<JobParams>, res: Response, next: NextFunction) {
    try {

        const { id } = req.params;

        const user = (req as AuthRequest).user;

await jobService.deleteJob(
    id,
    user.id,
    user.role
);

         res.status(200).json({
            success: true,
            message: "Job deleted successfully",
        });
        return;

    } catch (error: any) {

        if (error.code === "P2025") {
             res.status(404).json({
                success: false,
                message: "Job not found",
            });
            return;
        }

        next(error);
    }
}

async deleteAllJobs(req: Request, res: Response, next: NextFunction) {
    try {
        const user = (req as AuthRequest).user;

        await jobService.deleteAllJobs(user);

        res.status(200).json({
            success: true,
            message: "All jobs deleted successfully",
        });

        return;
    } catch (error) {
        next(error);
    }
}
async deleteAllJobs(req: Request, res: Response, next: NextFunction) {
    try {    

        const user = (req as AuthRequest).user;

await jobService.deleteAllJobs(
    user.id,
    user.role
);    

         res.status(200).json({
            success: true,
            message: "All jobs deleted successfully",
        });
        return;

    } catch (error: any) {            
        next(error);
        return;
    }
}

}

export default new JobController();