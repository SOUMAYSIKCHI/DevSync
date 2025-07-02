import { BASE_URL } from "../Constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../Utils/userSlice";

import React, { useEffect, useState } from "react";
import {
  Heart,
  MessageCircle,
  Bell,
  User,
  Settings,
  LogOut,
  Users,
  Code,
  Github,
  Twitter,
  Linkedin,
  Mail,
  ChevronDown,
  Search,
  Briefcase,
  Menu,
  X,
  Home,
} from "lucide-react";
import toast from "react-hot-toast";
import { addRequest } from "../Utils/RequestSlice";
import { clearMsgNotification } from "../Utils/msgNotificationSlice";
const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMessageNotificationOpen, setIsMessageNotificationOpen] =
    useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const messages = useSelector((state) => state.msgnotif);
  const unreadCount = messages.length;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getReq = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/request/received`, {
        withCredentials: true,
      });
      dispatch(addRequest(res.data));
    } catch (error) {
      toast.error("Error fetching requests");
      console.error(error);
    }
  };
  const profilePic = useSelector((state) => state?.user?.avatarUrl);
  const firstName = useSelector((state) => state?.user?.firstName);
  const reqLength = useSelector((state) => state?.request?.length);
  

  useEffect(() => {
    getReq();
  }, []);

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/logout",
        {},
        { withCredentials: true }
      );
      if (res.status === 200) {
        dispatch(removeUser());
        navigate("/");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const connectionReqPageHandler = () => {
    navigate("/v1/connections");
  };

  const editProfHandler = () => {
    navigate("/v1/editProfile");
  };

  const handleMessageButton = () => {
    navigate("/v1/connections");
  };

  const handleJobsButton = () => {
    navigate("/v1/jobs");
  };

  const handleHomeButton = () => {
    navigate("/v1");
  };

  const clearMessageButton = () => {
    dispatch(clearMsgNotification());
  };
  const handleMessageClick = (fromUserId) => {
    closeMobileMenu();
    navigate(`/v1/chat/${fromUserId}`);
    setIsMessageNotificationOpen(false);
    setIsMobileMenuOpen(false);
  };

  const truncateMessage = (message, maxLength = 50) => {
    return message.length > maxLength
      ? message.substring(0, maxLength) + "..."
      : message;
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
    setIsMessageNotificationOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-xl border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            onClick={() => navigate("/v1")}
            className="flex cursor-pointer items-center space-x-4"
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                DevSync
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Jobs */}
            <button
              onClick={handleJobsButton}
              className="p-2 bg-gray-800 hover:bg-gray-700 cursor-pointer rounded-full transition-colors duration-200"
              title="Jobs"
            >
              <Briefcase className="w-5 h-5 text-gray-300" />
            </button>

            {/* Message Notifications */}
            <div className="relative">
              <button
                onClick={() =>
                  setIsMessageNotificationOpen(!isMessageNotificationOpen)
                }
                className="relative p-2 bg-gray-800 hover:bg-gray-700 cursor-pointer rounded-full transition-colors duration-200"
                title="Messages"
              >
                <Bell className="w-5 h-5 text-gray-300" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Message Notifications Dropdown */}
              {isMessageNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-50 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-gray-700">
                    <h3 className="text-white font-medium">Messages</h3>
                  </div>
                  <div className="py-2">
                    {messages.length > 0 ? (
                      messages.map((message) => (
                        <button
                          key={message.fromUserId}
                          onClick={() => handleMessageClick(message.fromUserId)}
                          className={`flex w-full items-start space-x-3 px-4 py-3 hover:bg-gray-700 transition-colors cursor-pointer`}
                        >
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500">
                              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <div className="flex items-center justify-between">
                              <p
                                className={`text-sm font-medium  text-gray-300`}
                              >
                                {message.fromUser}
                              </p>
                            </div>
                            <p className={`text-sm mt-1 text-gray-400`}>
                              {truncateMessage(message.preview)}
                            </p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center text-gray-400">
                        <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No messages yet</p>
                      </div>
                    )}
                  </div>
                  {messages.length > 0 && (
                    <div className="border-t border-gray-700 p-2">
                      <button
                        onClick={clearMessageButton}
                        className="w-full cursor-pointer text-center py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Clear All messages
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Connection Requests */}
            <div className="relative">
              <button
                onClick={connectionReqPageHandler}
                className="relative p-2 bg-gray-800 cursor-pointer hover:bg-gray-700 rounded-full transition-colors duration-200"
                title="Connection Requests"
              >
                <Users className="w-5 h-5 text-gray-300" />
                {reqLength > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {reqLength}
                  </span>
                )}
              </button>
            </div>

            {/* Messages Button */}
            <button
              onClick={handleMessageButton}
              className="p-2 bg-gray-800 hover:bg-gray-700 cursor-pointer rounded-full transition-colors duration-200"
              title="All Messages"
            >
              <MessageCircle className="w-5 h-5 text-gray-300" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="cursor-pointer flex items-center space-x-2 p-1 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors duration-200"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-purple-500">
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500">
                        {profilePic ? (
                          <img
                            src={profilePic}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">{firstName}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={handleHomeButton}
                      className="flex w-full cursor-pointer items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                      <Home className="w-4 h-4" />
                      <span>Home</span>
                    </button>

                    <button
                      onClick={editProfHandler}
                      className="flex w-full cursor-pointer items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                      <span className="ml-auto text-xs bg-gradient-to-r from-green-400 to-blue-400 text-white px-2 py-1 rounded-full">
                        New
                      </span>
                    </button>

                    <button
                      onClick={connectionReqPageHandler}
                      className="flex w-full cursor-pointer items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      <span>Matches</span>
                    </button>

                    <button
                      onClick={handleJobsButton}
                      className="flex w-full cursor-pointer items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                      <Briefcase className="w-4 h-4" />
                      <span>Jobs</span>
                    </button>
                  </div>
                  <div className="border-t border-gray-700 py-2">
                    <button
                      onClick={logoutHandler}
                      className="flex cursor-pointer items-center space-x-3 px-4 py-2 text-red-400 hover:bg-gray-700 transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 bg-gray-800 hover:bg-gray-700 cursor-pointer rounded-full transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Profile Section */}
              <div className="flex items-center space-x-3 px-3 py-3 border-b border-gray-700">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500">
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-white font-medium">{firstName}</p>
                </div>
              </div>

              {/* Navigation Items */}
              <button
                onClick={() => {
                  handleHomeButton();
                  closeMobileMenu();
                }}
                className="flex w-full cursor-pointer items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </button>

              <button
                onClick={() => {
                  handleJobsButton();
                  closeMobileMenu();
                }}
                className="flex w-full cursor-pointer items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Briefcase className="w-5 h-5" />
                <span>Jobs</span>
              </button>

              <button
                onClick={() => {
                  setIsMessageNotificationOpen(!isMessageNotificationOpen);
                }}
                className="flex w-full cursor-pointer items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span>Message Notifications</span>
                {unreadCount > 0 && (
                  <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium ml-auto">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Mobile Message Notifications */}
              {isMessageNotificationOpen && (
                <div className="ml-8 cursor-pointer mt-2 space-y-2">
                  {messages.length > 0 ? (
                    messages.map((message) => (
                      <button
                        key={message.fromUserId}
                        onClick={() => handleMessageClick(message.fromUserId)}
                        className="cursor-pointer flex w-full items-start space-x-3 px-3 py-2 hover:bg-gray-700 rounded-lg transition-colors bg-gray-750">
                        <div  className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-purple-500">
                            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                              <User className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        </div>
                        <div onClick={() => handleMessageClick(message.fromUserId)} className="flex-1 cursor-pointer min-w-0 text-left">
                          <p className="text-sm font-medium text-gray-300">
                            {message.fromUser}
                          </p>
                          <p className="text-xs mt-1 text-gray-400">
                            {truncateMessage(message.preview, 30)}
                          </p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-4 text-center text-gray-400">
                      <p className="text-sm">No messages yet</p>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => {
                  connectionReqPageHandler();
                  closeMobileMenu();
                }}
                className="flex w-full cursor-pointer items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Users className="w-5 h-5" />
                <span>Connection Requests</span>
                {reqLength > 0 && (
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium ml-auto">
                    {reqLength}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  handleMessageButton();
                  closeMobileMenu();
                }}
                className="cursor-pointer flex w-full items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>All Messages</span>
              </button>

              <button
                onClick={() => {
                  editProfHandler();
                  closeMobileMenu();
                }}
                className="flex cursor-pointer w-full items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
                <span className="ml-auto text-xs bg-gradient-to-r from-green-400 to-blue-400 text-white px-2 py-1 rounded-full">
                  New
                </span>
              </button>

              <button
                onClick={() => {
                  connectionReqPageHandler();
                  closeMobileMenu();
                }}
                className="flex cursor-pointer w-full items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Heart className="w-5 h-5" />
                <span>Matches</span>
              </button>

              <div className="border-t cursor-pointer border-gray-700 pt-2">
                <button
                  onClick={() => {
                    logoutHandler();
                    closeMobileMenu();
                  }}
                  className="flex w-full cursor-pointer items-center space-x-3 px-3 py-2 text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {(isProfileOpen || isMessageNotificationOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsProfileOpen(false);
            setIsMessageNotificationOpen(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;