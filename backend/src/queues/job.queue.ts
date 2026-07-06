import { Queue } from "bullmq";

const jobQueue = new Queue("jobs", {
    connection: {
        host: "127.0.0.1",
        port: 6379,
    },
});

export default jobQueue;