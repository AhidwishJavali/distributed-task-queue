import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import app from "./app";
import { initializeSocket } from "./config/socket";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});

initializeSocket(io);

io.on("connection", (socket) => {
    console.log(
        `🔌 Client connected: ${socket.id}`
    );

    socket.on("disconnect", () => {
        console.log(
            `❌ Client disconnected: ${socket.id}`
        );
    });
});

server.listen(PORT, () => {
    console.log(
        `🚀 Server running on port ${PORT}`
    );
});