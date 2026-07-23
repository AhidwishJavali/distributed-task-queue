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
app.use(
    "/assets",
    express.static(
        path.join(__dirname, "../assets")
    )
);

app.get("/", (_, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Distributed Task Queue API</title>

    <style>
        body{
            margin:0;
            font-family:Arial,Helvetica,sans-serif;
            background:#f5f7fb;
            display:flex;
            justify-content:center;
            align-items:center;
            height:100vh;
        }

        .card{
            background:white;
            padding:40px;
            border-radius:16px;
            box-shadow:0 8px 30px rgba(0,0,0,.08);
            text-align:center;
            max-width:650px;
        }

        img{
            width:140px;
            margin-bottom:20px;
        }

        h1{
            margin:0 0 16px;
            color:#222;
        }

        p{
            color:#555;
            line-height:1.6;
            margin-bottom:24px;
        }

        a{
            display:inline-block;
            margin:8px;
            padding:10px 18px;
            text-decoration:none;
            border-radius:8px;
            background:#2563eb;
            color:white;
            font-weight:600;
        }

        a:hover{
            background:#1d4ed8;
        }
    </style>
</head>

<body>

<div class="card">

    <img src="/assets/A.svg" alt="Logo">

    <h1>Distributed Task Queue API</h1>

    <p>
        The backend is running successfully.
    </p>


</div>

</body>
</html>
    `);
});
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