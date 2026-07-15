import jobLogRepository from "../repositories/jobLog.repository";

class JobLogService {
    async addLog(jobId: string, message: string) {
        return jobLogRepository.create(jobId, message);
    }

    async getLogs(jobId: string) {
        return jobLogRepository.findByJob(jobId);
    }
    async getLogs(jobId: string) {
    return jobLogRepository.findByJobId(jobId);
}
}

export default new JobLogService();