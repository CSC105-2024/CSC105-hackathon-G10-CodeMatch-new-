import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { getMe, logoutUser } from '../api/user.ts';

const Main = () => {
  const navigate = useNavigate();
  const settingsRef = useRef(null);

  const [selectedBox, setSelectedBox] = useState('Java');
  const [username, setUsername] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isPlayButtonHovered, setIsPlayButtonHovered] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const [isSettingsHovered, setIsSettingsHovered] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getMe();
      if (res.success && res.data) {
        setUsername(res.data.username);
        setProfilePic(res.data.profilePic || '/assets/Pfp/ChickenPFP.png');
      } else {
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };

    if (showSettings) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettings]);

  const handlePlayClick = () => {
    switch(selectedBox.toLowerCase()) {
      case 'java':
        navigate('/java');
        break;
      case 'python':
        navigate('/python');
        break;
      case 'javascript':
        navigate('/javascript');
        break;
      case 'c++':
        navigate('/c++');
        break;
      case 'c#':
        navigate('/Csharp');
        break;
      case 'brainrot':
        navigate('/brainrot');
        break;
      default:
        navigate(`/${selectedBox.toLowerCase()}`);
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleSettingsClick = () => {
    setShowSettings(!showSettings);
  };

  const handleLogout = async () => {
    await logoutUser();
    setShowSettings(false);
    navigate('/login');
  };

  const programmingLanguages = [
    { name: 'Java', color: '#f89820', image: '/assets/Language/java-original.svg' },
    { name: 'Python', color: '#3776ab', image: '/assets/Language/python-original.svg' },
    { name: 'JavaScript', color: '#f7df1e', image: '/assets/Language/javascript-original.svg' },
    { name: 'C++', color: '#00599c', image: '/assets/Language/cplusplus-original.svg' },
    { name: 'C#', color: '#239120', image: '/assets/Language/csharp-original.svg' },
    { name: 'BrainRot', color: '#cc342d', image: '/assets/Language/Plankton.png' }
  ];

  return (
    <div className="min-h-screen bg-bgOrange flex flex-col font-pixelify">
      {/* Header */}
      <div className="flex justify-between items-center p-4 relative">
        {/* Profile Button */}
        <button
          onClick={handleProfileClick}
          className={`transition-all duration-300 transform ${
            isProfileHovered ? 'scale-110 rotate-3' : 'scale-100'
          }`}
          onMouseEnter={() => setIsProfileHovered(true)}
          onMouseLeave={() => setIsProfileHovered(false)}
        >
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <img src={profilePic} alt="Profile" className="w-12 h-12 rounded-full" />
          </div>
        </button>

        {/* Settings Button */}
        <div className="relative" ref={settingsRef}>
          <button 
            onClick={handleSettingsClick}
            className={`transition-all duration-300 transform ${
              isSettingsHovered ? 'scale-110 rotate-12' : 'scale-100'
            }`}
            onMouseEnter={() => setIsSettingsHovered(true)}
            onMouseLeave={() => setIsSettingsHovered(false)}
          >
            <img 
              src="/assets/button/setting.png" 
              alt="Settings" 
              className="w-8 h-8 hover:drop-shadow-lg transition-all duration-300"
            />
          </button>

          {showSettings && (
            <div className="absolute top-12 right-0 bg-white rounded-lg shadow-xl border-2 border-black z-50 min-w-48 animate-fadeIn">
              <div className="p-2">
                <div className="bg-gray-100 px-3 py-2 rounded-t-md border-b border-gray-300">
                  <h3 className="font-bold text-black text-sm font-pixelify">SETTINGS</h3>
                </div>
                <div className="py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 font-pixelify font-bold text-sm flex items-center space-x-2"
                  >
                    <svg 
                      className="w-4 h-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                      />
                    </svg>
                    <span>LOG OUT</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-4">
        <div className="bg-yellow-400 px-12 py-4 rounded-lg mb-4 mt-8 shadow-lg animate-bounce-slow">
          <h1 className="text-5xl font-bold font-pixelify text-black">CODE MATCH</h1>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black font-pixelify">CATEGORY: {selectedBox.toUpperCase()}</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12 max-w-2xl w-full">
          {programmingLanguages.map((lang) => (
            <button
              key={lang.name}
              onClick={() => setSelectedBox(lang.name)}
              className={`p-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:rotate-1 ${
                selectedBox === lang.name 
                  ? 'bg-white text-black shadow-lg scale-105 animate-pulse-gentle' 
                  : 'bg-black bg-opacity-20 text-white hover:bg-black hover:bg-opacity-30'
              }`}
            >
              <div className="flex flex-col items-center">
                <img src={lang.image} alt={lang.name} className="w-12 h-12 mb-2 transition-transform duration-300 hover:scale-110" />
                <span>{lang.name}</span>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handlePlayClick}
          className={`transition-all duration-300 transform ${
            isPlayButtonHovered ? 'scale-125 rotate-3' : 'scale-100'
          } hover:drop-shadow-2xl`}
          onMouseEnter={() => setIsPlayButtonHovered(true)}
          onMouseLeave={() => setIsPlayButtonHovered(false)}
        >
          <div className="relative">
            <div className={`absolute inset-0 bg-green-400 rounded-full blur-md opacity-50 ${
              isPlayButtonHovered ? 'animate-ping' : ''
            }`}></div>
            <div className="relative bg-green-500 hover:bg-green-400 px-8 py-4 rounded-full flex items-center space-x-3 shadow-lg border-4 border-green-600">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/727/727245.png" 
                alt="Play" 
                className={`w-10 h-10 transition-transform duration-300 ${
                  isPlayButtonHovered ? 'animate-bounce' : ''
                }`}
              />
              <span className="text-black font-bold text-2xl font-pixelify">PLAY</span>
            </div>
          </div>
        </button>
      </div>

      <div className="flex justify-end p-4">
        <div className="text-white font-bold bg-black bg-opacity-20 px-4 py-2 rounded-lg">
          User: {username}
        </div>
      </div>

      <style jsx>{`
        .pixel-font {
          font-family: 'Courier New', monospace;
          letter-spacing: 2px;
        }
        .pixel-border {
          border: 3px solid #000;
          box-shadow: 
            0 0 0 1px #000,
            0 0 0 2px #fff,
            0 0 0 3px #000;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
        @keyframes pulse-gentle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-gentle {
          animation: pulse-gentle 2s infinite;
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes fadeIn {
          0% { 
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          100% { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Main;
