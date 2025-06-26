import io from "socket.io-client";
import { BASE_URL } from "../Constants";

// export const createSocketConnection = () => {
//   if (location.hostname === "localhost") {
//     return io(BASE_URL);
//   } else {
//     return io("/", { path: "/api/socket.io" });
//   }
// };


export const createSocketConnection = (userId) => {
  const isLocalhost = location.hostname === "localhost";

  return io(isLocalhost ? BASE_URL : "/", {
    path: isLocalhost ? undefined : "/api/socket.io", // only for prod
    withCredentials: true,
    transports: ["websocket"],
    auth: { userId },
  });
};