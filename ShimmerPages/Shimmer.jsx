import React from 'react';

// Base Shimmer Component
const Shimmer = ({ className = "" }) => (
  <div className={`animate-pulse bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] ${className}`}>
    <div className="shimmer-animation"></div>
  </div>
);

export default Shimmer;