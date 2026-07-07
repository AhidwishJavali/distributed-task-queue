import { Worker } from "bullmq";
import redisConfig from "../config/redis";
const dlqWorker = new Worker(
    "dead-letter",
    async (job) => {
        console.log("\n======================");
        console.log("💀 DEAD LETTER QUEUE");
        console.log("======================");

        console.log(job.data);

        console.log("======================\n");
    },
    {
        connection: redisConfig,
    }
);

console.log("💀 DLQ Worker running...");