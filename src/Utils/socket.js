const baseSocketURL =
  location.hostname === "localhost"
    ? "http://localhost:3300"
    : "https://devsync.co.in";

export const createSocketConnection = () => {
  if (!socket) {
    socket = io(baseSocketURL, {
      path: "/api/socket.io",
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
  }
  return socket;
};
