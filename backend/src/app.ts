import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./middleware/error.middleware";
import { serverAdapter } from "./config/bullboard";

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (_, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
  });
});
app.use("/admin/queues", serverAdapter.getRouter());

// API routes
app.use("/api", routes);
app.use(errorHandler);


export default app;