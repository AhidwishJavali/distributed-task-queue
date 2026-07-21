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
            await jobRepository.findById(
                job.data.jobId,
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
    await jobRepository.findById(
        failedJob.data.jobId,
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
                    priorityMap[dbJob.priority as keyof typeof priorityMap],
            }
        );

        await failedJob.remove();

        return dbJob;
    }

    async delete(
    jobId: string,
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
        await jobRepository.findById(
            failedJob.data.jobId,
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
) {
    const jobs = await deadLetterQueue.getJobs([
        "waiting",
        "active",
        "completed",
        "failed",
    ]);

    for (const job of jobs) {

        const dbJob =
            await jobRepository.findById(
                job.data.jobId,
            );

        if (!dbJob) {
            continue;
        }

        await job.remove();
    }
}
}

export default new DLQService();