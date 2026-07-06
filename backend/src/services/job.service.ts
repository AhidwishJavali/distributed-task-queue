import jobRepository from "../repositories/job.repository";
import { CreateJobDTO, UpdateJobDTO } from "../types/job.types";
import jobQueue from "../queues/job.queue";
const priorityMap = {
    HIGH: 1,
    MEDIUM: 2,
    LOW: 3,
} as const;
class JobService {
  async createJob(data: CreateJobDTO) {
    //return jobRepository.create(data);
    const job = await jobRepository.create(data);

    await jobQueue.add(
    "process-job",
    {
        jobId: job.id,
    },
    {
        priority: priorityMap[data.priority],

        attempts: 3,

        backoff: {
            type: "exponential",
            delay: 2000,
        },

        removeOnComplete: 50,

        removeOnFail: 100,
    }
);
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