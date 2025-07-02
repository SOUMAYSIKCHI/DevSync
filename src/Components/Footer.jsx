import React, { useState, useEffect } from 'react';
import { 
  Code, 
  Users, 
  Zap, 
  Shield, 
  ArrowRight, 
  Menu, 
  X, 
  Github, 
  Twitter, 
  Linkedin,
  Star,
  CheckCircle,
  Play,
  ChevronDown
} from 'lucide-react';



const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-15">
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
            <h3 className="text-white font-semibold mb-4">“Built by devs, for devs — syncing innovation, one commit at a time.”</h3>
            
          </div>

         
        </div>

        {/* Social Links & Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Icons */}
            <div className="flex items-center space-x-4">
        
              
              <a href="https://www.linkedin.com/company/devsyncindia/" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors group">
                <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
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
export default Footer;
