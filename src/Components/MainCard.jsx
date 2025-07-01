import React, { useState, useRef, useEffect } from "react";
import profilepix from "../assets/profilepix.png";
import {
  Heart,
  X,
  Star,
  MessageCircle,
  User,
  Award,
  ChevronLeft,
  ChevronRight,
  SkipForward,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { removeFeed } from "../Utils/feedSlice";
import axios from "axios";
import { BASE_URL } from "../Constants";
import toast from "react-hot-toast";

const MainCard = ({ getFeed }) => {
  const users = useSelector((state) => state.feed.users);
  const hasMore = useSelector((state) => state.feed.hasMore);
  const dispatch = useDispatch();

  const [currentProfile, setCurrentProfile] = useState(users[0]);
  const [showBlockConfirmation, setShowBlockConfirmation] = useState(false);

  useEffect(() => {
    if (users.length > 0) {
      setCurrentProfile(users[0]);
    }
  }, []);
  useEffect(() => {
    if (users.length > 0) {
      setCurrentProfile(users[0]);
    }
  }, [users]);

  const removeProfile = (userId) => {
    dispatch(removeFeed(userId));
    if (users.length === 2 && hasMore) {
      getFeed();
    }
  };

  const handleSendRequest = async (status, userId) => {
    if (status === "skip") {
        removeProfile(userId);
    } else {
      try {
        await axios.post(
          `${BASE_URL}/request/send/${status}/${userId}`,
          {},
          { withCredentials: true }
        );
        removeProfile(userId);
        toast.success(
          status === "interested" ? "Connection Request Sent." : "Ignored!!"
        );
      } catch (error) {
        toast.error("Issue in Backend. Please retry.");
      }
    }
  };

  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const cardRef = useRef(null);
  const [filteredGalleryUrls, setFilteredGalleryUrls] = useState(
    (currentProfile?.galleryUrls || []).filter((url) => url.trim() !== "")
  );

  useEffect(() => {
    const filtered = (currentProfile?.galleryUrls || []).filter(
      (url) => url.trim() !== ""
    );
    setFilteredGalleryUrls(filtered);
  }, [currentProfile]);

  useEffect(() => {
    if (filteredGalleryUrls.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) =>
          prev === filteredGalleryUrls.length - 1 ? 0 : prev + 1
        );
      }, 5000); // Auto-slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [filteredGalleryUrls]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [currentProfile]);

  const switchToNextProfile = () => {
    if (currentProfile) {
      setCurrentImageIndex(0);
    }
  };

  const nextImage = () => {
    if (currentProfile?.galleryUrls && filteredGalleryUrls.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === filteredGalleryUrls.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (currentProfile?.galleryUrls && filteredGalleryUrls.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? filteredGalleryUrls.length - 1 : prev - 1
      );
    }
  };

  const animateSwipe = (direction) => {
    setIsAnimating(true);
    setSwipeDirection(direction);

    setTimeout(() => {
      setIsAnimating(false);
      setSwipeDirection(null);
    }, 300);
  };

  const handleAction = (action) => {
    if (!currentProfile) return;
    if (action === "skip") {
      animateSwipe("right");
      handleSendRequest("skip", currentProfile._id);
    } else if (action === "interested") {
      animateSwipe("right");
      handleSendRequest("interested", currentProfile._id);
    } else if (action === "ignored") {
      // Show confirmation modal instead of directly blocking
      setShowBlockConfirmation(true);
    } else {
      switchToNextProfile();
    }
  };

  const handleBlockConfirm = () => {
    animateSwipe("left");
    handleSendRequest("ignored", currentProfile._id);
    setShowBlockConfirmation(false);
  };

  const handleBlockCancel = () => {
    setShowBlockConfirmation(false);
  };

  const getCardStyle = () => {
    if (isAnimating) {
      const translateX = swipeDirection === "right" ? "100%" : "-100%";
      const rotate = swipeDirection === "right" ? "15deg" : "-15deg";
      return {
        transform: `translateX(${translateX}) rotate(${rotate})`,
        opacity: 0,
        transition: "transform 0.3s ease-out, opacity 0.3s ease-out",
      };
    } else {
      return {
        transform: "translateX(0px) rotate(0deg)",
        transition: "transform 0.3s ease-out",
      };
    }
  };

  if (!currentProfile || (!hasMore && users.length === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
        <div className="text-white text-center">
          <p className="text-xl">No more profiles to show</p>
          <button
            onClick={getFeed}
            className="mt-4 px-6 py-2 bg-gradient-to-r cursor-pointer from-purple-500 to-pink-500 rounded-full"
          >
            Load More
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
      {/* Block Confirmation Modal */}
      {showBlockConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-sm w-full border border-gray-700 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Block User?
              </h3>
              <p className="text-gray-300 text-sm mb-6">
                Do you want to surely block this user? This action will permanently block them, and no further requests can be sent to them.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleBlockCancel}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBlockConfirm}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors font-medium"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="w-full max-w-md bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 text-white">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Discover</h1>
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-white bg-opacity-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-opacity-20 transition-colors">
                <img
                  src={users[0].avatarUrl || profilepix}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="p-6">
          <div className="relative">
            {/* Profile Image Container */}
            <div
              ref={cardRef}
              className="relative w-full h-96 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl overflow-hidden shadow-lg mb-4 select-none"
              style={getCardStyle()}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

              {/* Profile Image */}
              {filteredGalleryUrls &&
              filteredGalleryUrls.length > 0 &&
              filteredGalleryUrls[currentImageIndex] ? (
                <>
                  <img
                    src={filteredGalleryUrls[currentImageIndex]}
                    alt={`${currentProfile.firstName} ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />

                  {/* Navigation Arrows */}
                  {filteredGalleryUrls.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-colors z-10"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-colors z-10"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Image Indicators */}
                  {filteredGalleryUrls.length > 1 && (
                    <div className="absolute top-4 left-4 flex space-x-1">
                      {filteredGalleryUrls.map((_, index) => (
                        <div
                          key={index}
                          className={`h-1 rounded-full transition-all duration-300 ${
                            index === currentImageIndex
                              ? "bg-white w-6"
                              : "bg-white bg-opacity-50 w-1"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <User className="w-16 h-16 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No Photos</p>
                  </div>
                </div>
              )}

              {/* Profile Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <h2 className="text-2xl font-bold">
                    {currentProfile.firstName} {currentProfile.lastName}
                  </h2>
                  {currentProfile.age && (
                    <span className="text-xl">{currentProfile.age}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Bio Section */}
            {currentProfile.about && (
              <div className="mb-4">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {currentProfile.about}
                </p>
              </div>
            )}

            {/* Skills Section */}
            {currentProfile.skills && currentProfile.skills.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-400">
                    Interests
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentProfile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs rounded-full font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              {/* Pass Button */}
              <button
                onClick={() => handleAction("ignored")}
                className="w-14 h-14 cursor-pointer bg-gray-700 border-2 border-gray-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-gray-600 transform hover:scale-105 transition-all duration-200"
              >
                <X className="w-6 h-6 text-red-400" />
              </button>

              {/* Like Button */}
              <button
                onClick={() => handleAction("skip")}
                className="w-14 h-14 cursor-pointer bg-gradient-to-r from-green-500 to-green-800  rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <SkipForward className="w-6 h-6 text-white" />
              </button> 
            </div>

            {/* Additional Action Buttons */}
            <div className="flex justify-center space-x-3 mt-4">
              <button
                onClick={() => handleAction("interested")}
                className="px-4 py-2 cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-800  text-white text-sm font-medium rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Hint */}
        <div className="bg-gray-900 px-6 py-3 border-t border-gray-700">
          <p className="text-xs text-gray-500 flex items-center">
            <X className="w-4 h-4 text-red-400 mr-2" />
            The user will be permanently blocked, and no further requests can be
            sent to them.
          </p>
          <p className="text-xs pt-2 text-gray-500 flex items-center">
            <SkipForward className="w-4 h-4 text-white mr-2" />
            It will skip the user.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainCard;
