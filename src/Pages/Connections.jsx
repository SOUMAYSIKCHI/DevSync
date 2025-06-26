import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Check,
  X,
  MessageCircle,
  ArrowLeft,
  Search,
  Filter,
  MoreVertical,
  Camera,
  Image,
  ExternalLink,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BASE_URL } from "../Constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../Utils/connectionSlice";
import { addRequest } from "../Utils/RequestSlice";
const Connections = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const connectionRequests = useSelector((state) => state.request);
  const [activeTab, setActiveTab] = useState("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const friends =  useSelector((state) => state.connections);

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


  //get all the connections list ie friend list of me
  const getConnectionList = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
      });
      dispatch(addConnections(res.data));
    } catch (error) {
      console.log(error);
      toast.error("Error fetching connections");
    }
  };

  useEffect(() => {
    getConnectionList();
    getReq();
  }, []);
  
  const handleRequest = async (requestId,status) => {
    try {
      const res = await axios.post(`${BASE_URL}/request/review/${status}/${requestId}`,
        {}, 
        { withCredentials: true }
      );
      toast.success(`Connection request ${status}!`); 
      await getReq();
      await getConnectionList();
    } catch (error) {
      toast.error(`Error in request`);
      console.error(error);
    }
  };
  
  const handleBackButton = ()=>{
    navigate("/v1");
  }
  const handleChatButton = (targetUserId)=>{
    navigate(`/v1/chat/${targetUserId}`)
  }

  const getTime = (dateString) => {
    if (!dateString) return "Unknown";
    
    const createdAt = new Date(dateString);
    const now = new Date();
    const diffMs = now - createdAt;

    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffYears = Math.floor(diffDays / 365);

    if (diffYears > 0) {
      return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
    } else if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    } else {
      return `${diffSeconds} second${diffSeconds > 1 ? "s" : ""} ago`;
    }
  };

  // Fixed filtering logic to handle the correct data structure
  const filteredFriends = friends.filter(
    (friend) =>
      friend.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRequests = connectionRequests.filter(
    (request) =>
      request.fromUserId?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.fromUserId?.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );
   const LinkedInIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );

  // GitHub SVG Icon Component
  const GitHubIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
  const renderGallery = (galleryUrls, maxVisible = 4, showLabel = true) => {
    if (!galleryUrls || galleryUrls.length === 0) return null;
    
    // Filter out empty URLs
    const validUrls = galleryUrls.filter((url) => url && url.trim() !== "");
    if (validUrls.length === 0) return null;

    const visiblePhotos = validUrls.slice(0, maxVisible);
    const remainingCount = validUrls.length - maxVisible;

    return (
      <div className="mt-3 sm:mt-4">
        {showLabel && (
          <div className="flex items-center space-x-2 mb-2 sm:mb-3">
            <Image className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
            <p className="text-gray-400 text-xs sm:text-sm">
              Recent photos ({validUrls.length})
            </p>
          </div>
        )}
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2">
          {visiblePhotos.map((photo, index) => (
            <div
              key={index}
              className="relative flex-shrink-0 group cursor-pointer"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-xl font-medium shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300">
                <img
                  src={photo}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                {index === maxVisible - 1 && remainingCount > 0 && (
                  <div className="absolute inset-0 bg-black/70 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <span className="text-white text-xs sm:text-sm font-bold">
                      +{remainingCount}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSocialLinks = (person) => {
    const hasLinkedIn = person.linkdlnUrl && person.linkdlnUrl.trim();
    const hasGitHub = person.GithubUrl && person.GithubUrl.trim();
    
    if (!hasLinkedIn && !hasGitHub) return null;

    return (
      <div className="flex items-center space-x-2 mt-3 sm:mt-4">
        {hasLinkedIn && (
          <a
            href={person.linkdlnUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-blue-600/20 text-blue-300 text-xs sm:text-sm rounded-lg sm:rounded-xl font-medium border border-blue-500/30 hover:bg-blue-600/30 transition-colors"
          >
            <LinkedInIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">LinkedIn</span>
            <ExternalLink className="w-2 h-2 sm:w-3 sm:h-3" />
          </a>
        )}
        {hasGitHub && (
          <a
            href={person.GithubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-gray-600/20 text-gray-300 text-xs sm:text-sm rounded-lg sm:rounded-xl font-medium border border-gray-500/30 hover:bg-gray-600/30 transition-colors"
          >
            <GitHubIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">GitHub</span>
            <ExternalLink className="w-2 h-2 sm:w-3 sm:h-3" />
          </a>
        )}
      </div>
    );
  };

  const renderFriendCard = (friend) => (
    <div
      key={friend._id}
      className="bg-white/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/10 hover:bg-white/8 hover:border-white/20 transition-all duration-300 shadow-xl"
    >
      <div className="flex items-start space-x-3 sm:space-x-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
            {friend.avatarUrl ? (
              <img 
                src={friend.avatarUrl}
                alt={friend.firstName}
                className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
              />
            ) : (
              <span className="text-white font-bold text-sm sm:text-xl">
                {(friend.firstName?.[0] || '') + (friend.lastName?.[0] || '')}
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-white font-bold text-lg sm:text-xl">
                {friend.firstName} {friend.lastName}
              </h3>
              <p className="text-blue-300 text-xs sm:text-xs mt-1 font-medium">
                Connected {getTime(friend.connectionUpdatedAt)}
              </p>
            </div>
            
            {/* Message Button */}
            <button onClick={()=>handleChatButton(friend._id)}
              className="flex cursor-pointer items-center space-x-1 sm:space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 text-xs sm:text-sm rounded-lg sm:rounded-xl font-medium border border-blue-500/30 hover:border-blue-500/50 transition-all duration-200"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">Message</span>
            </button>
          </div>

          {/* About */}
          {friend.about && (
            <p className="text-gray-300 text-xs sm:text-sm mt-2">{friend.about}</p>
          )}

          {/* Skills */}
          {friend.skills && friend.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-2 mt-3 sm:mt-4">
              {friend.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 sm:px-3 sm:py-1.5 bg-blue-500/20 text-blue-300 text-xs sm:text-sm rounded-lg sm:rounded-xl font-medium border border-blue-500/30"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* Social Links */}
          {renderSocialLinks(friend)}

          {/* Gallery */}
          {renderGallery(friend.galleryUrls, 6, true)}
        </div>
      </div>
    </div>
  );

  const renderRequestCard = (request) => (
    <div
      key={request._id}
      className="bg-white/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/10 hover:bg-white/8 hover:border-white/20 transition-all duration-300 shadow-xl"
    >
      <div className="flex items-start space-x-3 sm:space-x-4">
        {/* Avatar */}
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
          {request.fromUserId?.avatarUrl ? (
            <img
              src={request.fromUserId.avatarUrl}
              alt={request.fromUserId.firstName}
              className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
            />
          ) : (
            <span className="text-white font-bold text-sm sm:text-xl">
              {(request.fromUserId?.firstName?.[0] || '') + (request.fromUserId?.lastName?.[0] || '')}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div>
            <h3 className="text-white font-bold text-lg sm:text-xl">
              {request.fromUserId?.firstName} {request.fromUserId?.lastName}
            </h3>
            <p className="text-purple-300 text-xs sm:text-xs mt-1 font-medium">
              Requested {getTime(request.createdAt)}
            </p>
          </div>

          {/* About */}
          {request.fromUserId?.about && (
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl sm:rounded-2xl border border-gray-600/30">
              <p className="text-gray-300 text-xs sm:text-sm italic">
                "{request.fromUserId.about}"
              </p>
            </div>
          )}

          {/* Skills */}
          {request.fromUserId?.skills && request.fromUserId.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-2 mt-3 sm:mt-4">
              {request.fromUserId.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 sm:px-3 sm:py-1.5 bg-purple-500/20 text-purple-300 text-xs sm:text-sm rounded-lg sm:rounded-xl font-medium border border-purple-500/30"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* Social Links */}
          {renderSocialLinks(request.fromUserId)}

          {/* Gallery */}
          {renderGallery(request.fromUserId?.galleryUrls, 6, true)}

          {/* Action Buttons */}
          <div className="flex space-x-2 sm:space-x-3 mt-4 sm:mt-6">
            <button
              onClick={() => handleRequest(request._id,"accepted")}
              className="cursor-pointer flex-1 px-3 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl sm:rounded-2xl transition-all duration-200 flex items-center justify-center space-x-1 sm:space-x-2 font-medium shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <Check className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Accept</span>
            </button>
            <button
              onClick={() => handleRequest(request._id,"rejected")}
              className="flex-1 cursor-pointer px-3 py-2 sm:px-6 sm:py-3 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-xl sm:rounded-2xl transition-colors flex items-center justify-center space-x-1 sm:space-x-2 font-medium border border-gray-600/50 text-sm sm:text-base"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Decline</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-3 sm:p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button onClick={handleBackButton} className="w-10 h-10 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all duration-200 border border-white/10 shadow-lg cursor-pointer">
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-white mb-1">
                Connections
              </h1>
              <p className="text-blue-300 text-sm sm:text-lg">
                Manage your developer network
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6 sm:mb-8">
          <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search connections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base sm:text-lg shadow-lg"
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 sm:mb-8 bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-1 border border-white/10 shadow-lg">
          <button
            onClick={() => setActiveTab("friends")}
            className={`flex-1 cursor-pointer px-3 py-2 sm:px-8 sm:py-4 rounded-lg sm:rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 sm:space-x-3 ${
              activeTab === "friends"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-lg">My Connections</span>
            <span className="bg-white/20 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-bold">
              {friends.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 cursor-pointer px-3 py-2 sm:px-8 sm:py-4 rounded-lg sm:rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 sm:space-x-3 ${
              activeTab === "requests"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-lg">Requests</span>
            {connectionRequests.length > 0 && (
              <span className="bg-gradient-to-r from-red-500 to-pink-500 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm text-white font-bold shadow-lg">
                {connectionRequests.length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 sm:space-y-6">
          {activeTab === "friends" && (
            <>
              {filteredFriends.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <p className="text-gray-400 text-sm sm:text-lg">
                      {filteredFriends.length} connection
                      {filteredFriends.length !== 1 ? "s" : ""}
                      {searchQuery && ` matching "${searchQuery}"`}
                    </p>
                  </div>
                  {filteredFriends.map(renderFriendCard)}
                </>
              ) : (
                <div className="text-center py-12 sm:py-16 bg-white/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-white/10">
                  <Users className="w-16 h-16 sm:w-20 sm:h-20 text-gray-600 mx-auto mb-4 sm:mb-6" />
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">
                    {searchQuery
                      ? "No connections found"
                      : "No connections yet"}
                  </h3>
                  <p className="text-gray-400 text-base sm:text-lg mb-6 sm:mb-8 max-w-md mx-auto px-4">
                    {searchQuery
                      ? `No connections match "${searchQuery}"`
                      : "Start building your network by connecting with other developers"}
                  </p>
                  {!searchQuery && (
                    <button onClick={handleBackButton} className="px-6 py-3 sm:px-8 sm:py-4 cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl sm:rounded-2xl transition-all duration-200 font-medium text-base sm:text-lg shadow-lg hover:shadow-xl">
                      Find People to Connect
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          {activeTab === "requests" && (
            <>
              {filteredRequests.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <p className="text-gray-400 text-sm sm:text-lg">
                      {filteredRequests.length} pending request
                      {filteredRequests.length !== 1 ? "s" : ""}
                      {searchQuery && ` matching "${searchQuery}"`}
                    </p>
                  </div>
                  {filteredRequests.map(renderRequestCard)}
                </>
              ) : (
                <div className="text-center py-12 sm:py-16 bg-white/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-white/10">
                  <UserPlus className="w-16 h-16 sm:w-20 sm:h-20 text-gray-600 mx-auto mb-4 sm:mb-6" />
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">
                    {searchQuery ? "No requests found" : "No pending requests"}
                  </h3>
                  <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto px-4">
                    {searchQuery
                      ? `No connection requests match "${searchQuery}"`
                      : "You'll see new connection requests here when people want to connect with you"}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Connections;