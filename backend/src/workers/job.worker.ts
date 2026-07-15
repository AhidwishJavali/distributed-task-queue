import { Worker } from "bullmq";
import jobRepository from "../repositories/job.repository";
import { delay } from "../utils/delay";
import deadLetterQueue from "../queues/dead-letter.queue";
import redisConfig from "../config/redis";
import jobLogService from "../services/jobLog.service";
const WORKER_NAME = process.env.WORKER_NAME || "Worker";
const worker = new Worker(
  "jobs",
  async (job) => {
    const { jobId } = job.data;

const dbJob = await jobRepository.findById(jobId);
async function runStage(
    progress: number,
    stage: string
) {
    /*throw new Error(
    `Forced failure during ${stage}`
);*/
    await job.updateProgress(progress);

    await jobRepository.updateProgress(
        jobId,
        progress,
        stage,
        WORKER_NAME
    );
    await jobLogService.addLog(
    jobId,
    `${stage} (${progress}%)`
);

    console.log(
        `📊 ${WORKER_NAME} | ${stage} (${progress}%)`
    );

    await delay(3000);

    if (Math.random() < 0.1) {
        throw new Error(
            `Job failed during ${stage}`
        );
    }
}
if (!dbJob) {
    console.log("\n==============================");
    console.log("⚠️ Stale Queue Job Detected");
    console.log(`BullMQ ID   : ${job.id}`);
    console.log(`Database ID : ${jobId}`);
    console.log("Reason      : Database record no longer exists.");
    console.log("Removing stale queue job...");
    console.log("==============================\n");

    return;
}

console.log("\n==============================");
console.log(`🚀 ${WORKER_NAME} Processing New Job`);
console.log(`Database ID : ${jobId}`);
console.log(`BullMQ ID   : ${job.id}`);
console.log(`Title       : ${dbJob?.title}`);
console.log(`Priority    : ${dbJob?.priority}`);
console.log("==============================\n");
await jobLogService.addLog(
    jobId,
    `${WORKER_NAME} started processing`
);

    try {
        await jobRepository.updateStatus(jobId, "RUNNING");

        /*const random = Math.random();

        if (random < 0.5) {
            throw new Error("Random Failure");
        }
       throw new Error("Forced Failure");

        await job.updateProgress(10);
await delay(5000);

await job.updateProgress(30);
await delay(5000);

await job.updateProgress(60);
await delay(5000);

await job.updateProgress(90);
await delay(5000);

await job.updateProgress(100);
await delay(5000);*/
const stages = [
    {
        progress: 10,
        stage: "Loading Image",
    },
    {
        progress: 30,
        stage: "Pre-processing",
    },
    {
        progress: 60,
        stage: "Applying Grayscale",
    },
    {
        progress: 90,
        stage: "Edge Detection",
    },
    {
        progress: 100,
        stage: "Saving Result",
    },
];

for (const currentStage of stages) {
    if (dbJob.progress >= currentStage.progress) {
        continue;
    }

    await runStage(
        currentStage.progress,
        currentStage.stage
    );
}

        await jobRepository.updateStatus(jobId, "COMPLETED");
        await jobRepository.updateProgress(
    jobId,
    100,
    "Completed",
    WORKER_NAME
);
await jobLogService.addLog(
    jobId,
    "Job completed successfully"
);

    } catch (error: any) {

    if (error.code === "P2025") {
        console.log("\n==============================");
        console.log("⚠️ Database record disappeared while processing.");
        console.log(`Database ID : ${jobId}`);
        console.log("Discarding stale job.");
        console.log("==============================\n");

        return;
    }

    throw error;
}
},
  {
    connection: redisConfig,
    concurrency: 4,

    lockDuration: 15000,

    stalledInterval: 5000,

    maxStalledCount: 5,
}
);
worker.on("completed", (job) => {
    console.log(`✅ ${WORKER_NAME} completed Job ${job?.id}`);
});

worker.on("failed", async (job, err) => {
    console.log(`❌ ${WORKER_NAME} failed Job ${job?.id}`);
    console.log(err.message);

    if (!job) return;

    console.log(
        `Attempt ${job.attemptsMade} of ${job.opts.attempts}`
    );

    if (job.attemptsMade >= (job.opts.attempts ?? 1)) {

    await jobRepository.updateStatus(
        job.data.jobId,
        "FAILED"
    );
    await jobLogService.addLog(
    job.data.jobId,
    `Job failed: ${err.message}`
);

    await deadLetterQueue.add("failed-job", {
        jobId: job.data.jobId,
        bullJobId: job.id,
        title: (await jobRepository.findById(job.data.jobId))?.title,
        priority: (await jobRepository.findById(job.data.jobId))?.priority,
        error: err.message,
        failedAt: new Date(),
    });

    console.log("💀 Job permanently moved to DLQ.");
}else {
        console.log("🔄 BullMQ will retry...");
        await jobLogService.addLog(
    job.data.jobId,
    `Retry ${job.attemptsMade} scheduled`
);
    }
});
worker.on("progress", (job, progress) => {
    console.log(`📊 Job ${job.id}: ${progress}%`);
});
console.log(`🚀 ${WORKER_NAME} is running...`);
async function shutdown(signal: string) {
    console.log(`\n⚠️ Received ${signal}`);
    console.log(`${WORKER_NAME} is shutting down gracefully...`);

    await worker.close();

    console.log(`${WORKER_NAME} disconnected from Redis.`);
    console.log(`${WORKER_NAME} exited safely.`);

    process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
