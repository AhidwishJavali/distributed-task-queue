import { Queue } from "bullmq";
import redisConfig from "../config/redis";
const deadLetterQueue = new Queue("dead-letter", {
    connection: redisConfig,
});

export default deadLetterQueue;