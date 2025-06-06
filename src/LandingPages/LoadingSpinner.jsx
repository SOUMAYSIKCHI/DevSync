// Components/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="w-16 h-16 border-4 border-transparent border-t-purple-500 border-l-blue-500 border-r-red-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
