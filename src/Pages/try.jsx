import React, { useState } from 'react';
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
  Search
} from 'lucide-react';

const Navbar = ({ profilepix, logoutHandler }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  // Mock data for notifications
  const notifications = [
    { id: 1, type: 'connection', name: 'Sarah Chen', message: 'sent you a connection request', time: '2m ago', avatar: null },
    { id: 2, type: 'match', name: 'Alex Rivera', message: 'matched with you', time: '5m ago', avatar: null },
    { id: 3, type: 'message', name: 'Mike Johnson', message: 'sent you a message', time: '1h ago', avatar: null },
    { id: 4, type: 'connection', name: 'Emma Davis', message: 'accepted your request', time: '2h ago', avatar: null }
  ];

  const connectionRequests = notifications.filter(n => n.type === 'connection');
  const unreadCount = notifications.length;

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'connection': return <Users className="w-4 h-4 text-blue-400" />;
      case 'match': return <Heart className="w-4 h-4 text-pink-400" />;
      case 'message': return <MessageCircle className="w-4 h-4 text-green-400" />;
      default: return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-xl border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                DevSync
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search developers..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors duration-200"
              >
                <Bell className="w-5 h-5 text-gray-300" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">Notifications</h3>
                      <span className="text-xs text-gray-400">{unreadCount} new</span>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-4 border-b border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            {notification.avatar ? (
                              <img src={notification.avatar} alt="" className="w-10 h-10 rounded-full" />
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              {getNotificationIcon(notification.type)}
                              <span className="text-sm font-medium text-white">{notification.name}</span>
                            </div>
                            <p className="text-sm text-gray-400">{notification.message}</p>
                            <span className="text-xs text-gray-500">{notification.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-gray-700">
                    <button className="w-full text-center text-sm text-purple-400 hover:text-purple-300 font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Connection Requests */}
            <div className="relative">
              <button className="relative p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors duration-200">
                <Users className="w-5 h-5 text-gray-300" />
                {connectionRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {connectionRequests.length}
                  </span>
                )}
              </button>
            </div>

            {/* Messages */}
            <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors duration-200">
              <MessageCircle className="w-5 h-5 text-gray-300" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-1 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors duration-200"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-purple-500">
                  {profilepix ? (
                    <img src={profilepix} alt="Profile" className="w-full h-full object-cover" />
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
                        {profilepix ? (
                          <img src={profilepix} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">Your Name</p>
                        <p className="text-gray-400 text-sm">Developer</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    <a href="#" className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors">
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                      <span className="ml-auto text-xs bg-gradient-to-r from-green-400 to-blue-400 text-white px-2 py-1 rounded-full">New</span>
                    </a>
                    <a href="#" className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </a>
                    <a href="#" className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors">
                      <Heart className="w-4 h-4" />
                      <span>Matches</span>
                    </a>
                  </div>
                  <div className="border-t border-gray-700 py-2">
                    <button
                      onClick={logoutHandler}
                      className="flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-gray-700 transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search developers..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(isProfileOpen || isNotificationOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsProfileOpen(false);
            setIsNotificationOpen(false);
          }}
        />
      )}
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                DevSync
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Connect • Collaborate • Code
            </p>
            <p className="text-gray-500 text-sm max-w-md leading-relaxed">
              The ultimate platform for developers to connect, collaborate, and build meaningful professional relationships. 
              Find your coding partner, mentor, or next team member.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Discover</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Matches</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Messages</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Projects</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Community</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Safety</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">Contact Us</a></li>
            </ul>
          </div>
        </div>

        {/* Social Links & Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Icons */}
            <div className="flex items-center space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors group">
                <Github className="w-5 h-5 text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors group">
                <Twitter className="w-5 h-5 text-gray-400 group-hover:text-blue-400" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors group">
                <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors group">
                <Mail className="w-5 h-5 text-gray-400 group-hover:text-green-400" />
              </a>
            </div>

            {/* Copyright */}
            <div className="flex items-center space-x-4 text-gray-500 text-sm">
              <span>© 2025 DevSync. All rights reserved.</span>
              <div className="flex items-center space-x-1">
                <span>Beta</span>
                <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
                <span className="text-xs bg-gradient-to-r from-green-400 to-blue-400 text-white px-2 py-1 rounded-full">v1.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Demo App Component
const App = () => {
  const mockProfilePic = null; // Set to image URL if you have one
  
  const handleLogout = () => {
    // Add your logout logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Navbar profilepix={mockProfilePic} logoutHandler={handleLogout} />
      
      {/* Main Content */}
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">DevSync</span>
          </h1>
          <p className="text-gray-400 mb-8">Connect • Collaborate • Code</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <Heart className="w-8 h-8 text-pink-400 mb-4 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Find Matches</h3>
              <p className="text-gray-400 text-sm">Connect with developers who share your interests and skills</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <Users className="w-8 h-8 text-blue-400 mb-4 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Build Networks</h3>
              <p className="text-gray-400 text-sm">Grow your professional network with like-minded developers</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <Code className="w-8 h-8 text-green-400 mb-4 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Collaborate</h3>
              <p className="text-gray-400 text-sm">Work together on exciting projects and learn from each other</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default App;