import express from "express";
import cors from "cors";
import routes from "./routes";

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

// API routes
app.use("/api", routes);

export default app;