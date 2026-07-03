import jobRepository from "../repositories/job.repository";
import { CreateJobDTO, UpdateJobDTO } from "../types/job.types";

class JobService {
  async createJob(data: CreateJobDTO) {
    return jobRepository.create(data);
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
}

export default new JobService();