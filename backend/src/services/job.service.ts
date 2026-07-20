import jobRepository from "../repositories/job.repository";
import { CreateJobDTO, UpdateJobDTO } from "../types/job.types";
import { JobQueryDTO } from "../types/job.types";
import jobQueue from "../queues/job.queue";
const priorityMap = {
    HIGH: 1,
    MEDIUM: 2,
    LOW: 3,
} as const;
class JobService {
    private async createDatabaseJob(data: CreateJobDTO) {
    return jobRepository.create(data);
}

private async enqueueJob(job: { id: string; priority: "LOW" | "MEDIUM" | "HIGH"; }, delay = 0) {
    await jobQueue.add(
    "process-job",
    {
        jobId: job.id,
    },
    {
        jobId: job.id,
        priority: priorityMap[job.priority],
        delay,
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 2000,
        },
        removeOnComplete: 50,
        removeOnFail: 100,
    }
);
}
private async rescheduleJob(
    job: {
        id: string;
        priority: "LOW" | "MEDIUM" | "HIGH";
        delay: number;
    }
) {
    const jobs = await jobQueue.getJobs([
        "waiting",
        "delayed",
        "prioritized",
    ]);

    const existing = jobs.find(
        (bullJob) => bullJob.data.jobId === job.id
    );

    if (existing) {
        await existing.remove();
    }

    await this.enqueueJob(job, job.delay);
}
  async createJob(data: CreateJobDTO) {

    const job = await this.createDatabaseJob(data);

    await this.enqueueJob(job, data.delay ?? 0);

    return job;
}
async getAllJobs(
    userId: string,
    role: "USER" | "ADMIN",
    query: JobQueryDTO
) {
    return jobRepository.findAllByUser(
        userId,
        role,
        query
    );
}
async getStatistics(
    userId: string,
    role: "USER" | "ADMIN"
) {
    return jobRepository.getStatistics(
        userId,
        role
    );
}
async getJobById(
    id: string,
    userId: string,
    role: "USER" | "ADMIN"
) {
    return jobRepository.findByIdForUser(
        id,
        userId,
        role
    );
}
async updateJob(
    id: string,
    userId: string,
    role: "USER" | "ADMIN",
    data: UpdateJobDTO
) {
    const job = await jobRepository.findByIdForUser(
        id,
        userId,
        role
    );

    if (!job) {
        throw new Error("Job not found");
    }

    if (job.status !== "PENDING") {
        throw new Error(
            "Only pending jobs can be edited."
        );
    }

    const updatedJob =
        await jobRepository.updateForUser(
            id,
            userId,
            role,
            data
        );

    await this.rescheduleJob({
        id: updatedJob.id,
        priority: updatedJob.priority,
        delay: updatedJob.delay,
    });

    return updatedJob;
}
async deleteJob(
    id: string,
    userId: string,
    role: "USER" | "ADMIN"
) {
    const job = await jobRepository.findByIdForUser(
        id,
        userId,
        role
    );

    if (!job) {
        throw new Error("Job not found");
    }

    if (job.status === "RUNNING") {
        throw new Error("Running jobs cannot be deleted.");
    }

    return jobRepository.deleteForUser(
        id,
        userId,
        role
    );
}
async deleteAllJobs(
    userId: string,
    role: "USER" | "ADMIN"
) {
    return jobRepository.deleteAllForUser(
        userId,
        role
    );
}

}

export default new JobService();