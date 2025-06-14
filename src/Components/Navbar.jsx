// Navbar.js
import { BASE_URL } from "../Constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch ,useSelector} from "react-redux";
import { removeUser } from "../Utils/userSlice";
import React, { useEffect, useState } from 'react';
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
  Briefcase
} from 'lucide-react';
import toast from "react-hot-toast";
import { addRequest } from "../Utils/RequestSlice";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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
  useEffect(()=>{
    getReq();
  },[]);
  const profilePic = useSelector(state=>state?.user?.avatarUrl)
  const firstName = useSelector((state)=>state?.user?.firstName);
  const reqLength = useSelector((state) => state?.request?.length);
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
    }
  };
  const connectionReqPageHandler = ()=>{
    navigate("/v1/connections");
  }
  const editProfHandler = ()=>{
    navigate("/v1/editProfile")
  }
  const handleMessageButton = ()=>{
    navigate("/v1/connections");
  }
  const handleJobsButton = ()=>{
    navigate("/v1/jobs"); // Add your jobs route here
  }
 
 
  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-xl border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div  onClick={()=>navigate("/v1")} className="flex cursor-pointer items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                DevSync
              </span>
            </div>
          </div>
         
          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Jobs */}
            <button  
              onClick={handleJobsButton} 
              className="p-2 bg-gray-800 hover:bg-gray-700 cursor-pointer rounded-full transition-colors duration-200"
              title="Jobs"
            >
              <Briefcase className="w-5 h-5 text-gray-300" />
            </button>

            {/* Connection Requests */}
            <div className="relative">
              <button onClick={connectionReqPageHandler} className="relative p-2 bg-gray-800  cursor-pointer  hover:bg-gray-700 rounded-full transition-colors duration-200">
                <Users className="w-5 h-5 text-gray-300" />
                {reqLength > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {reqLength}
                  </span>
                )}
              </button>
            </div>
            
            {/* Messages */}
            <button  onClick={handleMessageButton} className="p-2 bg-gray-800 hover:bg-gray-700  cursor-pointer rounded-full transition-colors duration-200">
              <MessageCircle className="w-5 h-5 text-gray-300" />
            </button>
            
            
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="  cursor-pointer flex items-center space-x-2 p-1 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors duration-200"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-purple-500">
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
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
                          <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
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
                    <button onClick={editProfHandler}  className="flex w-full cursor-pointer items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors">
                      <User className="w-4 h-4" />
                      <span >Profile</span>
                      <span className="ml-auto text-xs bg-gradient-to-r from-green-400 to-blue-400 text-white px-2 py-1 rounded-full">New</span>
                    </button>
                    
                    <button onClick={connectionReqPageHandler} className="flex w-full cursor-pointer items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors">
                      <Heart className="w-4 h-4" />
                      <span>Matches</span>
                    </button>

                    <button onClick={handleJobsButton} className="flex w-full cursor-pointer items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors">
                      <Briefcase className="w-4 h-4" />
                      <span>Jobs</span>
                    </button>
                  </div>
                  <div className="border-t border-gray-700 py-2">
                    <button
                      onClick={logoutHandler}
                      className="flex  cursor-pointer items-center space-x-3 px-4 py-2 text-red-400 hover:bg-gray-700 transition-colors w-full text-left"
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
     
      {/* Click outside to close dropdowns */}
      {(isProfileOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsProfileOpen(false);
            // setIsNotificationOpen(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;
