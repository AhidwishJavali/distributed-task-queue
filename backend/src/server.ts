import dotenv from "dotenv";
import app from "./app";
import path from "path";

import jobQueue from "./queues/job.queue";
dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});