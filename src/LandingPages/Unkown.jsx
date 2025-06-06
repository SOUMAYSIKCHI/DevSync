import React from 'react'

const Unkown = () => {
  return (
    <div
      className="relative min-h-screen overflow-hidden flex items-center justify-center"
      style={{
        background:
          "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full opacity-10"
          style={{
            width: "500px",
            height: "500px",
            top: "-250px",
            right: "-250px",
            background: "linear-gradient(135deg, #ff4458, #a855f7)",
            animation: "pulse 4s ease-in-out infinite",
          }}
        ></div>
        <div
          className="absolute rounded-full opacity-10"
          style={{
            width: "500px",
            height: "500px",
            bottom: "-250px",
            left: "-250px",
            background: "linear-gradient(135deg, #4ade80, #3b82f6)",
            animation: "pulse 4s ease-in-out infinite reverse",
          }}
        ></div>
      </div>

      {/* 404 Content */}
      <div className="relative z-10 text-center px-8 max-w-2xl">
        {/* Animated 404 Number */}
        <div className="mb-8">
          <h1 
            className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 mb-4"
            style={{
              animation: "glow 2s ease-in-out infinite alternate",
            }}
          >
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Oops! Developer Not Found
          </h2>
          <p className="text-white/70 text-lg md:text-xl mb-6 leading-relaxed">
            Looks like this developer has swiped on the wrong page. 
            <br className="hidden md:block" />
            Let's get you back to finding your perfect coding match!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl"
          > Go Back
          </button>
        </div>

        {/* Floating Code Symbols */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute text-white/20 text-6xl font-mono"
            style={{
              top: "20%",
              left: "10%",
              animation: "float 6s ease-in-out infinite",
            }}
          >
            {'</>'}
          </div>
          <div 
            className="absolute text-white/20 text-4xl font-mono"
            style={{
              top: "30%",
              right: "15%",
              animation: "float 8s ease-in-out infinite reverse",
            }}
          >
            {'{}'}
          </div>
          <div 
            className="absolute text-white/20 text-5xl font-mono"
            style={{
              bottom: "25%",
              left: "15%",
              animation: "float 7s ease-in-out infinite",
            }}
          >
            {'[]'}
          </div>
          <div 
            className="absolute text-white/20 text-3xl font-mono"
            style={{
              bottom: "35%",
              right: "10%",
              animation: "float 9s ease-in-out infinite reverse",
            }}
          >
            {'()'}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes glow {
          0% {
            text-shadow: 0 0 20px rgba(255, 68, 88, 0.5), 
                         0 0 40px rgba(168, 85, 247, 0.3), 
                         0 0 60px rgba(59, 130, 246, 0.2);
          }
          100% {
            text-shadow: 0 0 30px rgba(255, 68, 88, 0.8), 
                         0 0 50px rgba(168, 85, 247, 0.5), 
                         0 0 70px rgba(59, 130, 246, 0.3);
          }
        }
      `}</style>
    </div>
  );
};

export default Unkown;