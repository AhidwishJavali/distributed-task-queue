import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./middleware/error.middleware";
import { serverAdapter } from "./config/bullboard";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger";
  import dlqRoutes from "./routes/dlq.routes";
import path from "path";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/dlq", dlqRoutes);
app.get("/health", (_, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
  });
});
app.use("/admin/queues", serverAdapter.getRouter());
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);
app.use("/api", routes);
app.use(
    "/processed-images",
    express.static(
        path.join(__dirname, "../output")
    )
);
app.use(
    "/images",
    express.static(
        path.join(__dirname, "../assets/images")
    )
);
app.use(errorHandler);


export default app;