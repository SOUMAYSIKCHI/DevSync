import React, { useState } from 'react';
import { User, Calendar, MapPin, Code, Camera, Edit3, Github, Linkedin, Twitter } from 'lucide-react';

const ProfileView = () => {
  // Sample user data based on your schema
  const [user] = useState({
    firstName: "Alex",
    lastName: "Johnson",
    age: 28,
    gender: "male",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    galleryUrls: [
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop",
      "",
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=300&h=200&fit=crop",
      ""
    ],
    about: "Full-stack developer passionate about creating innovative solutions and building amazing user experiences. Love to collaborate and learn new technologies.",
    skills: ["React", "Node.js", "Python", "MongoDB", "TypeScript"],
    createdAt: "2023-08-15T10:30:00Z",
    updatedAt: "2024-12-15T14:22:00Z"
  });

  const getActiveGalleryImages = () => {
    return user.galleryUrls
      .map((url, index) => ({ url, index }))
      .filter(item => item.url && item.url !== "");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGenderIcon = () => {
    switch(user.gender) {
      case 'male': return '👨';
      case 'female': return '👩';
      default: return '👤';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Code className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">DevSync</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl overflow-hidden ring-4 ring-blue-500/30">
                {user.avatarUrl ? (
                  <img 
                    src={user.avatarUrl} 
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <User className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-gray-800 flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-3xl font-bold text-white">
                  {user.firstName} {user.lastName}
                </h2>
                <span className="text-2xl">{getGenderIcon()}</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{user.age} years old</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Member since {formatDate(user.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Edit3 className="w-4 h-4" />
                  <span>Last updated {formatDate(user.updatedAt)}</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-3">
                <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                  <Github className="w-5 h-5 text-white" />
                </button>
                <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                  <Linkedin className="w-5 h-5 text-white" />
                </button>
                <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                  <Twitter className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-400" />
                About Me
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {user.about}
              </p>
            </div>

            {/* Gallery Section */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Camera className="w-5 h-5 mr-2 text-blue-400" />
                Gallery ({getActiveGalleryImages().length}/6)
              </h3>
              {getActiveGalleryImages().length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {getActiveGalleryImages().map((item, idx) => (
                    <div key={idx} className="relative group">
                      <div className="aspect-video rounded-lg overflow-hidden bg-gray-800">
                        <img 
                          src={item.url} 
                          alt={`Gallery ${item.index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <span className="text-white font-medium">View</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No gallery images uploaded yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Skills Section */}
          <div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Code className="w-5 h-5 mr-2 text-blue-400" />
                Skills ({user.skills.length}/5)
              </h3>
              {user.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-full text-sm text-white font-medium hover:from-blue-500/30 hover:to-cyan-500/30 transition-colors cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-400">
                  <Code className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No skills added yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;