"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";

let socket: any;

export const useSocket = () => {
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const socketInitializer = async () => {
            await fetch("/api/socket");
            socket = io({
                path: "/api/socket",
            });

            socket.on("connect", () => {
                setConnected(true);
            });

            socket.on("disconnect", () => {
                setConnected(false);
            });
        };

        socketInitializer();

        return () => {
            if (socket) socket.disconnect();
        };
    }, []);

    return { socket, connected };
};
