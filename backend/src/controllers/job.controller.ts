import { Request, Response } from "express";
import jobService from "../services/job.service";
import { createJobSchema } from "../validators/job.validators";
import { CreateJobDTO,  JobParams } from "../types/job.types";
import { updateJobSchema } from "../validators/job.validators";

class JobController {
  async createJob(req: Request, res: Response) {
    try {
      // Validate request body
      const validatedData = createJobSchema.parse(req.body);

      // Call business logic
      const job = await jobService.createJob(validatedData);

      // Send success response
      return res.status(201).json({
        success: true,
        message: "Job created successfully",
        data: job,
      });
    } catch (error: any) {
      // We'll improve error handling later
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  async getAllJobs(req: Request, res: Response) {
    try {
        const jobs = await jobService.getAllJobs();

        return res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });

    } catch (error: any) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
}
async getJobById(
    req: Request<JobParams>,
    res: Response
) {
    try {

        const { id } = req.params;

        const job = await jobService.getJobById(id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: job,
        });

    } catch (error: any) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
}
async updateJob(req: Request<JobParams>, res: Response) {
    try {

        const { id } = req.params;

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

        const job = await jobService.updateJob(id, updateData);

        return res.status(200).json({
            success: true,
            message: "Job updated successfully",
            data: job,
        });

    } catch (error: any) {

        // Prisma throws if record doesn't exist
        if (error.code === "P2025") {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}
async deleteJob(req: Request<JobParams>, res: Response) {
    try {

        const { id } = req.params;

        await jobService.deleteJob(id);

        return res.status(200).json({
            success: true,
            message: "Job deleted successfully",
        });

    } catch (error: any) {

        if (error.code === "P2025") {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}
async deleteAllJobs(req: Request, res: Response) {
    try {    

        await jobService.deleteAllJobs();    

        return res.status(200).json({
            success: true,
            message: "All jobs deleted successfully",
        });

    } catch (error: any) {            
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

}

export default new JobController();