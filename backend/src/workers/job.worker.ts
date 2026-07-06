import { Worker } from "bullmq";
import jobRepository from "../repositories/job.repository";
import { delay } from "../utils/delay";
const WORKER_NAME = process.env.WORKER_NAME || "Worker";
const worker = new Worker(
  "jobs",
  async (job) => {
    const { jobId } = job.data;

const dbJob = await jobRepository.findById(jobId);

console.log("\n==============================");
console.log(`🚀 ${WORKER_NAME} Processing New Job`);
console.log(`Database ID : ${jobId}`);
console.log(`BullMQ ID   : ${job.id}`);
console.log(`Title       : ${dbJob?.title}`);
console.log(`Priority    : ${dbJob?.priority}`);
console.log("==============================\n");

    try {
        await jobRepository.updateStatus(jobId, "RUNNING");

        const random = Math.random();

        if (random < 0.5) {
            throw new Error("Random Failure");
        }

        await job.updateProgress(10);
await delay(1000);

await job.updateProgress(30);
await delay(1000);

await job.updateProgress(60);
await delay(1000);

await job.updateProgress(90);
await delay(1000);

await job.updateProgress(100);
await delay(1000);

        await jobRepository.updateStatus(jobId, "COMPLETED");
    } catch (error) {


        throw error;
    }
},
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
    concurrency: 4,
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

        console.log("💀 Job permanently failed.");
    } else {
        console.log("🔄 BullMQ will retry...");
    }
});
worker.on("progress", (job, progress) => {
    console.log(`📊 Job ${job.id}: ${progress}%`);
});
console.log(`🚀 ${WORKER_NAME} is running...`);
