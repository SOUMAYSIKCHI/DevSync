import { io } from "socket.io-client";

export const createSocketConnection = () => {
    return io("https://devsync.co.in", {
      path: "/api/socket.io",
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
};
