import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../Utils/socket";
import { useSelector } from "react-redux";
import { BASE_URL } from "../Constants";
import axios from "axios";
import toast from "react-hot-toast";
const Message = () => {
  const { targetUserId } = useParams();
  const user = useSelector((state) => state.user);
  const curr_userId = user?._id;
  const userName = user?.firstName;
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatMessages = async () => {
    try {
      const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });
      const arr = chat?.data?.messages;
      const newArr = arr.map(({ senderId, text }) => ({
        from: senderId.firstName,
        senderId: senderId._id,
        text,
      }));
      setMessages(newArr);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchChatMessages();
  }, []);

  useEffect(() => {
    if (!curr_userId) return;
    const socket = createSocketConnection();

    socket.on("connect", () => {
      socket.emit("joinChat", {
        curr_userId,
        targetUserId,
        userName,
      });
    });

    socket.on("messageReceived", ({ fromUser, text, fromUserId }) => {
      console.log("message received from " + fromUser);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          from: fromUser,
          senderId: fromUserId,
          text,
        },
      ]);
    });

    socket.on("connectionDenied", ({ reason }) => {
      setMessages((prev) => [
        ...prev,
        {
          from: "System",
          senderId: "system",
          text: reason,
        },
      ]);
      toast.error(reason);
    });

    return () => {
      socket.disconnect();
    };
  }, [curr_userId, targetUserId]);

  const sendMessageBtn = () => {
    if (!newMsg.trim()) return;
    const socket = createSocketConnection();

    socket.emit("sendMessage", {
      text: newMsg,
      userName,
      curr_userId,
      targetUserId,
    });
    setNewMsg("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessageBtn();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-2 sm:p-4 lg:p-6">
      <div className="max-w-4xl mx-auto h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] lg:h-[calc(100vh-3rem)] flex flex-col bg-gray-800/90 backdrop-blur-lg rounded-2xl border border-gray-600/50 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-gray-800 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg sm:text-xl font-bold text-white flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
              Private Chat
            </h1>
            <div className="text-sm text-blue-200">
              {messages.length} messages
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-transparent">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-lg">No messages yet</p>
                <p className="text-sm">Start the conversation!</p>
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isCurrentUser = msg.senderId === curr_userId;
              return (
                <div
                  key={idx}
                  className={`flex ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  } mb-4`}
                >
                  <div
                    className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg ${
                      isCurrentUser ? "order-2" : "order-1"
                    }`}
                  >
                    {/* User name */}
                    <div
                      className={`text-xs text-gray-300 mb-1 ${
                        isCurrentUser ? "text-right" : "text-left"
                      } px-3`}
                    >
                      {isCurrentUser ? "You" : msg.from}
                    </div>

                    {/* Message bubble */}
                    <div
                      className="relative px-4 py-3 rounded-2xl shadow-lg 
                          bg-gray-700/80 backdrop-blur-sm text-white border border-gray-600/50 rounded-bl-md break-words"
                    >
                      {msg.text}

                      {/* Message tail */}
                      <div className="absolute top-0 w-0 h-0 left-0 border-r-8 border-r-gray-700 border-t-8 border-t-transparent"></div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-gray-800/90 backdrop-blur-sm border-t border-gray-600/50 p-4 sm:p-6">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full bg-gray-700/80 backdrop-blur-sm border border-gray-600/50 text-white rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 resize-none scrollbar-hide"
                placeholder="Type your message..."
                rows="1"
                style={{
                  minHeight: "48px",
                  maxHeight: "120px",
                  overflow: "hidden",
                }}
                onInput={(e) => {
                  e.target.style.height = "48px";
                  e.target.style.height =
                    Math.min(e.target.scrollHeight, 120) + "px";
                }}
              />

              {/* Character count */}
              {newMsg.length > 0 && (
                <div className="absolute bottom-1 right-3 text-xs text-gray-400">
                  {newMsg.length}
                </div>
              )}
            </div>

            <button
              onClick={sendMessageBtn}
              disabled={!newMsg.trim()}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                newMsg.trim()
                  ? "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>

          <div className="mt-2 text-xs text-gray-400 text-center">
            <span className="italic">Note:</span> Only the latest{" "}
            <span className="text-blue-400 font-semibold">50 messages</span> are
            retained. Older messages are auto-deleted.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
