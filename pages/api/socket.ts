import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../types/next";

export const config = {
    api: {
        bodyParser: false,
    },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
    if (!res.socket.server.io) {
        const httpServer: NetServer = res.socket.server as any;
        const io = new SocketIOServer(httpServer, {
            path: "/api/socket",
            addTrailingSlash: false,
        });
        res.socket.server.io = io;

        io.on("connection", (socket) => {
            console.log("Client connected:", socket.id);

            socket.on("join-room", (roomName) => {
                socket.join(roomName);
                console.log(`Socket ${socket.id} joined room ${roomName}`);
            });

            socket.on("update-queue", (data) => {
                // Broadcast to everyone in the room
                io.to(data.roomName).emit("queue-updated", data.queue);
            });

            socket.on("call-candidate", (data) => {
                io.to(data.roomName).emit("candidate-called", data.candidate);
            });
        });
    }
    res.end();
};

export default ioHandler;
