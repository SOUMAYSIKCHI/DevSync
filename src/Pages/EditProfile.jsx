import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  User,
  Plus,
  X,
  Camera,
  Save,
  ArrowLeft,
  Upload,
  Linkedin,
  Github,
  Edit,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../Constants";
import { addUser } from "../Utils/userSlice";

const EditProfile = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const initialSkills =
    user.skills && user.skills.length
      ? [...user.skills] // existing skills
          .slice(0, 5) // keep first five if more
          .concat(Array(5).fill("")) // pad with blanks
          .slice(0, 5) // final length = 5
      : Array(5).fill("");
  const [profileData, setProfileData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    age: user.age || "",
    gender: user.gender || "",
    about: user.about || "",
    skills: user.skills || initialSkills,
    galleryUrls: user.galleryUrls
      ? user.galleryUrls.filter((url) => url && url.trim() !== "")
      : [],
    avatarUrl: user.avatarUrl || null,
    linkdlnUrl: user.linkdlnUrl || "",
    GithubUrl: user.GithubUrl || "",
  });
  const [removedImages, setRemovedImages] = useState({
    avatar: false,
    galleryIndexes: [],
  });

  // Fixed: Added missing uploadFiles state
  const [uploadFiles, setUploadFiles] = useState({
    avatarFile: null,
    galleryFiles: {},
  });

  const [aboutUsCount, setAboutUsCount] = useState(
    profileData.about?.length || 0
  );

  const handleInputChange = (field, value) => {
    if (field === "about" && value.length > 200) return;

    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "about") {
      setAboutUsCount(value.length);
    }
  };

  const handleSkillChange = (index, value) => {
    const newSkills = [...profileData.skills];
    newSkills[index] = value;
    setProfileData((prev) => ({
      ...prev,
      skills: newSkills,
    }));
  };

  // Fixed: Added missing handleAvatarUpload function
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileData((prev) => ({
        ...prev,
        avatarUrl: imageUrl,
      }));
      setUploadFiles((prev) => ({
        ...prev,
        avatarFile: file,
      }));
    }
  };

  // Fixed: Added missing handleGalleryImageUpload function
  const handleGalleryImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileData((prev) => {
        const newImages = [...prev.galleryUrls];
        // Ensure array has enough elements
        while (newImages.length <= index) {
          newImages.push("");
        }
        newImages[index] = imageUrl;
        return {
          ...prev,
          galleryUrls: newImages,
        };
      });

      setUploadFiles((prev) => ({
        ...prev,
        galleryFiles: {
          ...prev.galleryFiles,
          [index]: file,
        },
      }));
    }
  };

  const removeImage = (indexToRemove) => {
    setProfileData((prev) => {
      const newImages = [...prev.galleryUrls];
      newImages[indexToRemove] = "";
      return { ...prev, galleryUrls: newImages };
    });

    setUploadFiles((prev) => {
      const newGalleryFiles = { ...prev.galleryFiles };
      delete newGalleryFiles[indexToRemove];
      return { ...prev, galleryFiles: newGalleryFiles };
    });

    setRemovedImages((prev) => ({
      ...prev,
      galleryIndexes: [...new Set([...prev.galleryIndexes, indexToRemove])],
    }));
  };

  const removeAvatar = () => {
    setProfileData((prev) => ({ ...prev, avatarUrl: null }));
    setUploadFiles((prev) => ({ ...prev, avatarFile: null }));
    setRemovedImages((prev) => ({ ...prev, avatar: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData for file upload
    const formData = new FormData();

    // Add text data
    formData.append("firstName", profileData.firstName);
    formData.append("lastName", profileData.lastName);
    formData.append("age", profileData.age);
    formData.append("gender", profileData.gender);
    formData.append("about", profileData.about);

    formData.append(
      "skills",
      JSON.stringify(profileData.skills.filter((skill) => skill.trim() !== ""))
    );
    formData.append("linkdlnUrl", profileData.linkdlnUrl);
    formData.append("GithubUrl", profileData.GithubUrl);
    if (uploadFiles.avatarFile) {
      formData.append("avatarFile", uploadFiles.avatarFile);
    } else if (removedImages.avatar) {
      formData.append("avatarUrl", ""); // clear avatar
    } else if (
      profileData.avatarUrl &&
      typeof profileData.avatarUrl === "string" &&
      !profileData.avatarUrl.startsWith("blob:")
    ) {
      formData.append("avatarUrl", profileData.avatarUrl); // valid Cloudinary URL
    }

    formData.append(
      "removedGalleryIndexes",
      JSON.stringify(removedImages.galleryIndexes)
    );
    formData.append(
      "galleryUrls",
      JSON.stringify(
        profileData.galleryUrls.filter(
          (url) =>
            url &&
            typeof url === "string" &&
            !url.startsWith("blob:") &&
            !url.startsWith("data:")
        )
      )
    );

    // Add avatar file if exists
    if (uploadFiles.avatarFile) {
      formData.append("avatarFile", uploadFiles.avatarFile);
    }

    // Add gallery files with specific names
    Object.entries(uploadFiles.galleryFiles).forEach(([index, file]) => {
      formData.append(`galleryImage${index}`, file);
    });

    try {
      // Make API call using axios
      const response = await axios.patch(
        `${BASE_URL}/profile/profileUpdate`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        dispatch(addUser(response.data.data));
      } else {
        toast.error(`Profile update failed: ${response.data.message}`);
      }
    } catch (error) {
      if (error.response) {
        // Server responded with error status
        alert(`Error: ${error.response.data.message || "Server error"}`);
      } else if (error.request) {
        // Request was made but no response received
        alert("Network error: No response from server");
      } else {
        // Something else happened
        alert("Error updating profile");
      }
    }
  };

  const renderImageSlot = (index) => {
    // Ensure we have an array of at least 6 elements
    const images = [...profileData.galleryUrls];
    while (images.length < 6) {
      images.push("");
    }

    const hasImage = images[index] && images[index].trim() !== "";

    return (
      <div key={index} className="relative group">
        <div className="w-20 h-20 bg-gray-800 border-2 border-dashed border-gray-600 rounded-2xl flex items-center justify-center hover:border-blue-500 transition-all duration-300 hover:bg-gray-750">
          {hasImage ? (
            <>
              <img
                src={images[index]}
                alt={`Profile ${index + 1}`}
                className="w-full h-full object-cover rounded-2xl"
              />
              {/* Edit button */}
              <label className="absolute top-1 left-1 cursor-pointer w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors opacity-0 group-hover:opacity-100">
                <Edit className="w-3 h-3 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  multiple={false}
                  onChange={(e) => handleGalleryImageUpload(e, index)}
                  className="hidden"
                />
              </label>
              {/* Remove button */}
              <button
                onClick={() => removeImage(index)}
                className="absolute top-0 right-21 cursor-pointer w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </>
          ) : (
            <label className="w-full h-full flex items-center justify-center cursor-pointer">
              <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                <Plus className="w-3 h-3 text-gray-400 group-hover:text-white" />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleGalleryImageUpload(e, index)}
                className="hidden"
                multiple={false}
              />
            </label>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.history.back()}
              className="w-12 h-12 cursor-pointer bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all duration-200 border border-white/10"
            >
              <ArrowLeft className="w-6 h-6 text-gray-300" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
              <p className="text-blue-300 text-sm">Make your profile shine</p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-gradient-to-r cursor-pointer from-blue-500 to-purple-600 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-blue-500/25"
          >
            <Save className="w-5 h-5" />
            <span>Save Changes</span>
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Avatar Section */}
          <div className="xl:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-4">
                Profile Avatar
              </h2>
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center overflow-hidden border-4 border-white/20">
                    {profileData.avatarUrl ? (
                      <img
                        src={profileData.avatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-white/70" />
                    )}
                  </div>
                  {profileData.avatarUrl && (
                    <>
                      {/* Edit button */}
                      <label className="absolute top-2 left-2 w-8 h-8 cursor-pointer bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors opacity-0 group-hover:opacity-100">
                        <Edit className="w-4 h-4 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                          multiple={false}
                        />
                      </label>
                      {/* Remove button */}
                      <button
                        onClick={removeAvatar}
                        className="absolute top-2 right-2 w-8 h-8 cursor-pointer bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4  text-white" />
                      </button>
                    </>
                  )}
                </div>

                {!profileData.avatarUrl && (
                  <label className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl cursor-pointer transition-all duration-200 flex items-center space-x-2 border border-white/20">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm font-medium">Upload Avatar</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      multiple={false}
                    />
                  </label>
                )}
                <p className="text-xs text-gray-400 text-center">
                  Recommended: Square image, at least 200x200px
                </p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="xl:col-span-2">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
              <div className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    Age
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="80"
                    value={profileData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                    placeholder="Enter your age"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    Gender
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {["male", "female", "others"].map((gender) => (
                      <button
                        key={gender}
                        type="button"
                        onClick={() => handleInputChange("gender", gender)}
                        className={`px-6 cursor-pointer py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                          profileData.gender === gender
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent shadow-lg"
                            : "bg-white/10 text-white/80 hover:bg-white/20 border-white/20"
                        }`}
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    Professional Links
                  </label>
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Linkedin className="h-5 w-5 text-blue-400" />
                      </div>
                      <input
                        type="url"
                        value={profileData.linkdlnUrl}
                        onChange={(e) =>
                          handleInputChange("linkdlnUrl", e.target.value)
                        }
                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Github className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="url"
                        value={profileData.GithubUrl}
                        onChange={(e) =>
                          handleInputChange("GithubUrl", e.target.value)
                        }
                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                        placeholder="https://github.com/yourusername"
                      />
                    </div>
                  </div>
                </div>

                {/* Skills - Compact Grid */}

                <div className="grid grid-cols-5 gap-3">
                  {Array.from({ length: 5 }, (_, i) => (
                    <input
                      key={i}
                      type="text"
                      value={profileData.skills[i] || ""}
                      maxLength={15}
                      onChange={(e) => handleSkillChange(i, e.target.value)}
                      className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl
                 text-white placeholder-white/50 focus:outline-none
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                 backdrop-blur-sm transition-all duration-200 text-sm"
                      placeholder={`Skill ${i + 1}`}
                    />
                  ))}
                </div>

                {/* About Me */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    About Me
                    <span className="text-xs text-blue-300 ml-2 font-normal">
                      ({aboutUsCount}/200)
                    </span>
                  </label>
                  <textarea
                    value={profileData.about}
                    onChange={(e) => handleInputChange("about", e.target.value)}
                    rows={4}
                    maxLength={200}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none backdrop-blur-sm transition-all duration-200"
                    placeholder="Tell us about yourself, your interests, and what makes you unique..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Profile Photos */}
          <div className="xl:col-span-3">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-2">
                  Profile Gallery
                </h2>
                <p className="text-sm text-blue-300">
                  Upload up to 6 photos to showcase your personality and
                  interests.
                </p>
              </div>

              {/* Photo Grid - Compact squares */}
              <div className="grid grid-cols-6 md:grid-cols-6 gap-4 mb-6">
                {Array.from({ length: 6 }, (_, index) =>
                  renderImageSlot(index)
                )}
              </div>

              {/* Tips and Info */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Camera className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-medium text-white">
                      Photo Guidelines
                    </span>
                  </div>
                  <span className="text-sm text-blue-300">
                    {
                      profileData.galleryUrls.filter(
                        (img) => img && img.trim() !== ""
                      ).length
                    }
                    /6 uploaded
                  </span>
                </div>
                <ul className="text-xs text-blue-300 mt-3 space-y-1 grid grid-cols-1 md:grid-cols-2 gap-1">
                  <li>• Clear, high-quality images</li>
                  <li>• Show your face and smile</li>
                  <li>• Include varied activities/interests</li>
                  <li>• Avoid group photos as main pics</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Save Button */}
        <div className="xl:hidden mt-8 flex justify-center">
          <button
            onClick={handleSubmit}
            className="w-full max-w-sm px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
          >
            <Save className="w-5 h-5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
