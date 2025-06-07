import { io } from "socket.io-client";

// let socket
// export const createSocketConnection = () => {
//   if (!socket) {
//     socket = io("http://localhost:3300", {
//       withCredentials: true,
//     });
//   }
//   return socket;
// };

export const createSocketConnection = () => {
    return io("/",{path:"/api/socket.io"});
};

