import jobRepository from "../repositories/job.repository";
import { CreateJobDTO, UpdateJobDTO } from "../types/job.types";
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
  async createJob(data: CreateJobDTO) {

    const job = await this.createDatabaseJob(data);

    await this.enqueueJob(job, data.delay ?? 0);

    return job;
}
  async getAllJobs() {
    return jobRepository.findAll();
}
async getJobById(id: string) {
    return jobRepository.findById(id);
}
async updateJob(id: string, data: UpdateJobDTO) {
    return jobRepository.update(id, data);
}
async deleteJob(id: string) {
    return jobRepository.delete(id);
}
async deleteAllJobs() {
    return jobRepository.deleteAll();
}

}

export default new JobService();