import deadLetterQueue from "../queues/dead-letter.queue";
import jobQueue from "../queues/job.queue";
import jobRepository from "../repositories/job.repository";

const priorityMap = {
    HIGH: 1,
    MEDIUM: 2,
    LOW: 3,
} as const;

class DLQService {
    async getFailedJobs(
    userId: string,
    role: "USER" | "ADMIN"
) {
    const jobs = await deadLetterQueue.getJobs([
        "waiting",
        "active",
        "completed",
        "failed",
    ]);

    const result = [];

    for (const job of jobs) {

        const dbJob =
            await jobRepository.findByIdForUser(
                job.data.jobId,
                userId,
                role
            );

        if (!dbJob) {
            continue;
        }

        result.push({
            id: job.id,
            ...job.data,
        });
    }

    return result;
}

    async retry(
    jobId: string,
    userId: string,
    role: "USER" | "ADMIN"
) {
        const jobs = await deadLetterQueue.getJobs([
            "waiting",
            "active",
            "completed",
            "failed",
        ]);

        const failedJob = jobs.find(
            (j) => String(j.id) === jobId
        );

        if (!failedJob) {
            throw new Error("DLQ job not found");
        }

        const dbJob =
    await jobRepository.findByIdForUser(
        failedJob.data.jobId,
        userId,
        role
    );

        if (!dbJob) {
    await failedJob.remove();

    return {
        removed: true,
        message: "Stale DLQ entry removed.",
    };
}

        await jobRepository.updateStatus(
            dbJob.id,
            "PENDING"
        );

        await jobQueue.add(
            "process-job",
            {
                jobId: dbJob.id,
            },
            {
                attempts: 3,
                priority:
                    priorityMap[dbJob.priority],
            }
        );

        await failedJob.remove();

        return dbJob;
    }

    async delete(
    jobId: string,
    userId: string,
    role: "USER" | "ADMIN"
) {
    const jobs = await deadLetterQueue.getJobs([
        "waiting",
        "active",
        "completed",
        "failed",
    ]);

    const failedJob = jobs.find(
        (j) => String(j.id) === jobId
    );

    if (!failedJob) {
        throw new Error("DLQ job not found");
    }

    const dbJob =
        await jobRepository.findByIdForUser(
            failedJob.data.jobId,
            userId,
            role
        );

    if (!dbJob) {
        await failedJob.remove();
        return;
    }

    await failedJob.remove();

    return {
        success: true,
    };
}

    async clear(
    userId: string,
    role: "USER" | "ADMIN"
) {
    const jobs = await deadLetterQueue.getJobs([
        "waiting",
        "active",
        "completed",
        "failed",
    ]);

    for (const job of jobs) {

        const dbJob =
            await jobRepository.findByIdForUser(
                job.data.jobId,
                userId,
                role
            );

        if (!dbJob) {
            continue;
        }

        await job.remove();
    }
}
}

export default new DLQService();