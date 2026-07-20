import {
    Request,
    Response,
    NextFunction,
    RequestHandler,
} from "express";
import jobService from "../services/job.service";
import { createJobSchema } from "../validators/job.validators";
import { CreateJobDTO,  JobParams } from "../types/job.types";
import { updateJobSchema } from "../validators/job.validators";
import jobLogService from "../services/jobLog.service";

class JobController {
  async createJob(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
      const validatedData = createJobSchema.parse(req.body);

    const job = await jobService.createJob(validatedData);
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
  async getAllJobs(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {

const jobs = await jobService.getAllJobs(
    {
        search:
            typeof req.query.search === "string"
                ? req.query.search
                : undefined,

        status:
            typeof req.query.status === "string"
                ? (req.query.status as any)
                : undefined,

        priority:
            typeof req.query.priority === "string"
                ? (req.query.priority as any)
                : undefined,

        sort:
            typeof req.query.sort === "string"
                ? (req.query.sort as any)
                : undefined,
    }
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
async getStatistics(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {

        const stats =
            await jobService.getStatistics();

        res.status(200).json({
            success: true,
            data: stats,
        });

        return;
    } catch (error) {
        next(error);
    }
}
async getJobById(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {

        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const job = await jobService.getJobById(
    id,
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
async updateJob(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {

        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

        const validatedData = updateJobSchema.parse(req.body);

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
    updateData
);
    res.status(200).json({
            success: true,
            message: "Job updated successfully",
            data: job,
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
async deleteJob(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {

        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

await jobService.deleteJob(
    id,
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

async deleteAllJobs(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {    


await jobService.deleteAllJobs();    

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

async getJobLogs(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

        const logs = await jobLogService.getLogs(id);

        res.status(200).json({
            success: true,
            data: logs,
        });

    } catch (error) {
        next(error);
    }
}

}

export default new JobController();