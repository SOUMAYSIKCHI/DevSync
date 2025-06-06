import { useState,useEffect } from "react";
import Login from "../Components/Login";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../Constants";
import { addUser } from "../Utils/userSlice";
// logo for starting page

const DevSyncLogo = () => (
  <>
    <div>
      <style>
        {`
        .logo-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #ff4458 0%, #ff6b7a 50%, #a855f7 100%);
            border-radius: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            box-shadow: 0 20px 60px rgba(255, 68, 88, 0.3);
            animation: logo-glow 3s ease-in-out infinite;
          }

          .logo-icon::before {
            content: '';
            position: absolute;
            inset: 3px;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border-radius: 27px;
            z-index: 1;
          }

          .logo-symbol {
            position: relative;
            z-index: 2;
            font-size: 1.5rem;
            font-weight: 800;
            background: linear-gradient(135deg, #ff4458, #a855f7);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            transform: rotate(-10deg);
          }

          @keyframes logo-glow {
            0%, 100% { 
              box-shadow: 0 20px 60px rgba(255, 68, 88, 0.3);
              transform: scale(1);
            }
            50% { 
              box-shadow: 0 25px 80px rgba(255, 68, 88, 0.5);
              transform: scale(1.05);
            }
          }



        `}
      </style>
    </div>
    <div className="logo-icon">
      <div className="logo-symbol">{"{}"}</div>
    </div>
  </>
);

// DevCard Component
const DevCard = ({ name, role, skills, avatar, avatarColor }) => (
  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-center w-full relative overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500  via-blue-500 to-purple-500"></div>
    <div
      className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-bold text-white ${avatarColor}`}
    >
      {avatar}
    </div>
    <div className="text-white text-xl font-semibold mb-2">{name}</div>
    <div className="text-white/70 text-base mb-4">{role}</div>
    <div className="flex flex-wrap gap-2 justify-center mb-6">
      {skills.map((skill, index) => (
        <span
          key={index}
          className="bg-white/10 text-white px-3 py-1 rounded-2xl text-sm font-medium"
        >
          {skill}
        </span>
      ))}
    </div>
    <div className="flex gap-4 justify-center">
      <button className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center text-xl hover:bg-red-600 transition-colors">
        ✗
      </button>
      <button className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center text-xl hover:bg-green-600 transition-colors">
        ♡
      </button>
    </div>
  </div>
);

// Phone Component
const Phone = ({ children, rotation, scale, top, left, right, bottom }) => (
  <div
    className="absolute bg-black rounded-3xl p-2 shadow-2xl pointer-events-none"
    style={{
      width: "280px",
      height: "580px",
      top: top,
      left: left,
      right: right,
      bottom: bottom,
      transform: `rotate(${rotation}deg) scale(${scale})`,
      animation: `float 6s ease-in-out infinite`,
    }}
  >
    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-6">
      {children}
    </div>
  </div>
);

// Main Body Component

// Main App Component
const DevSyncApp = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(BASE_URL + "/profile/profileView", {
          withCredentials: true,
        });

        if (res.status === 200) {
          dispatch(addUser(res.data.user));
          navigate("/v1");
        }
      } catch (err) {
        // Do nothing, stay on landing page
      }
    };

    checkAuth();
  }, []);
  

  const handleButtonClick = () => {
    setIsFormVisible(true);
  };

  const developers = [
    {
      name: "Lisa Rodriguez",
      role: "AI/Data Scientist",
      skills: ["Python", "ML", "TensorFlow"],
      avatar: "LR",
      avatarColor: "bg-gradient-to-br from-orange-500 to-orange-600",
    },
    {
      name: "David Johnson",
      role: "DevOps Engineer",
      skills: ["Docker", "K8s", "AWS"],
      avatar: "DJ",
      avatarColor: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      name: "Akshay Saini",
      role: "DevYoutuber",
      skills: ["React.js", "Javascript", "Node.js"],
      avatar: "AS",
      avatarColor: "bg-gradient-to-br from-green-500 to-green-600",
    },
    {
      name: "Soumay Sikchi",
      role: "Frontend Developer",
      skills: ["React", "TypeScript", "Vue"],
      avatar: "SS",
      avatarColor: "bg-gradient-to-br from-purple-500 to-purple-600",
    },
    {
      name: "Tom Roberts",
      role: "Game Developer",
      skills: ["Unity", "C#", "Unreal"],
      avatar: "TR",
      avatarColor: "bg-gradient-to-br from-red-500 to-red-600",
    },
    {
      name: "Jane Doe",
      role: "Backend Developer",
      skills: ["Node.js", "Go", "PostgreSQL"],
      avatar: "JD",
      avatarColor: "bg-gradient-to-br from-teal-500 to-teal-600",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* nav barrrrrrrrrrr */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Logo */}
            <div className="flex items-center space-x-3">
              <DevSyncLogo />
              <span className="text-white font-bold text-xl">DevSync</span>
            </div>

            {/* Right side - Login Button */}
            <div className="flex items-center">
              <button
                onClick={handleButtonClick}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* body sectionn */}
      <div
        className="relative min-h-screen overflow-hidden pt-16"
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
        {/* hero body--------------------- */}

        {/* Main content */}
        <div className="relative min-h-screen flex flex-col items-center justify-center px-8">
          {/* Hero text - made smaller */}

          {isFormVisible && <Login />}

          <div className="text-center mb-12 z-10">
            <h1 className="text-3xl md:text-6xl font-black text-white mb-8 leading-tight drop-shadow-2xl">
              Connect with amazing developers.
            </h1>
            <button
              onClick={handleButtonClick}
              className="w-[50%] sm:w-auto px-6 sm:px-10 py-3 sm:py-4 text-lg sm:text-xl font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl"
            >
              Start DevSync
            </button>
          </div>

          {/* Floating phones */}
          <div className="absolute inset-0 pointer-events-none">
            <Phone rotation={-15} scale={0.8} top="10%" left="5%">
              <DevCard {...developers[0]} />
            </Phone>

            <Phone rotation={12} scale={0.9} top="15%" right="8%">
              <DevCard {...developers[1]} />
            </Phone>

            <div className="hidden md:block">
              <Phone rotation={-8} scale={0.7} bottom="20%" left="10%">
                <DevCard {...developers[2]} />
              </Phone>
            </div>

            <div className="hidden md:block">
              <Phone rotation={18} scale={0.85} bottom="15%" right="5%">
                <DevCard {...developers[3]} />
              </Phone>
            </div>

            <div className="hidden md:block">
              <Phone rotation={-25} scale={0.6} top="50%" left="-5%">
                <DevCard {...developers[4]} />
              </Phone>
            </div>

            <div className="hidden md:block">
              <Phone rotation={22} scale={0.75} top="45%" right="-8%">
                <DevCard {...developers[5]} />
              </Phone>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px) rotate(var(--rotation))
                scale(var(--scale));
            }
            50% {
              transform: translateY(-20px) rotate(var(--rotation))
                scale(var(--scale));
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

          @media (max-width: 768px) {
            .phone:nth-child(n + 5) {
              display: none;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default DevSyncApp;
