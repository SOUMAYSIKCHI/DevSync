import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSocketConnection } from "../Utils/socket";
import { addMsgNotification } from "../Utils/msgNotificationSlice";
const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const user = useSelector((state) => state.user);
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user?._id) return;

    const socketInstance = createSocketConnection(user._id); 
    setSocket(socketInstance);

    socketInstance.on("notifyMessage", ({ fromUser,fromUserId, preview }) => {
      dispatch(addMsgNotification({ fromUser,fromUserId, preview }));
      // console.log(`📩 New message from ${fromUser}: ${preview}`);
    });


    socketInstance.on("connect_error", (err) => {
      console.error("❌ Socket error:", err.message);
    });

    return () => {
      socketInstance.disconnect();
      setSocket(null);
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useNotificationSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    console.warn("⚠️ useNotificationSocket must be used inside <SocketProvider>");
  }
  return socket;
};
