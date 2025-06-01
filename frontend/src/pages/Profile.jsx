import React, { useEffect, useState } from 'react';
import { getMe } from '../api/user.js';
import { getAllUserCollections, clearCollection as clearCollectionApi, removeFromCollection } from '../api/collection.js';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [collection, setCollection] = useState([]);
  const [stats, setStats] = useState({
    totalCards: 0,
    correctCards: 0,
    languages: [],
    averageScore: 0
  });

  const [isBackButtonHovered, setIsBackButtonHovered] = useState(false);
  const [isPlayButtonHovered, setIsPlayButtonHovered] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUserAndCollection = async () => {
      try {
        const userRes = await getMe();

        if (!userRes || !userRes.data || !userRes.data.username) {
          navigate('/login');
          return;
        }

        setUsername(userRes.data.username);

        const collectionRes = await getAllUserCollections();
        const cards = collectionRes.data;

        setCollection(cards);

        const languages = [...new Set(cards.map(card => card.gameMode.name))];
        setStats({
          totalCards: cards.length,
          correctCards: cards.length, 
          languages,
          averageScore: 0
        });
      } catch (error) {
        console.error('Failed to fetch user or collection', error);
        navigate('/login');
      }
    };

    fetchUserAndCollection();
  }, [navigate]);


  const deleteCard = async (cardId, gameDate) => {
    try {
      await removeFromCollection(cardId);
      const updatedCollection = collection.filter(card => !(card.id === cardId && card.gameDate === gameDate));
      setCollection(updatedCollection);
      const languages = [...new Set(updatedCollection.map(card => card.gameMode.name))];
      setStats({
        totalCards: updatedCollection.length,
        correctCards: updatedCollection.length,
        languages,
        averageScore: 0
      });
    } catch (error) {
      console.error('Failed to remove card from collection', error);
    }
  };

  const handleClearCollection = async () => {
    if (window.confirm('Are you sure you want to clear your entire collection? This cannot be undone.')) {
      try {
        await clearCollectionApi();
        setCollection([]);
        setStats({
          totalCards: 0,
          correctCards: 0,
          languages: [],
          averageScore: 0
        });
      } catch (error) {
        console.error('Failed to clear collection', error);
      }
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const ArrowIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="transition-transform duration-150">
      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const TrashIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="transition-transform duration-200">
      <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 6V4C8 3.47 8.21 2.96 8.59 2.59C8.96 2.21 9.47 2 10 2H14C14.53 2 15.04 2.21 15.41 2.59C15.79 2.96 16 3.47 16 4V6M19 6V20C19 20.53 18.79 21.04 18.41 21.41C18.04 21.79 17.53 22 17 22H7C6.47 22 5.96 21.79 5.59 21.41C5.21 21.04 5 20.53 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const XIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="transition-transform duration-150">
      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-orange-300 flex flex-col font-pixelify" style={{ fontFamily: 'monospace' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-bgOrange">
        <button
          onClick={handleBack}
          className={`text-white hover:text-orange-200 transition-all duration-300 transform ${isBackButtonHovered ? 'scale-110 rotate-12' : 'scale-100'} active:scale-95`}
          onMouseEnter={() => setIsBackButtonHovered(true)}
          onMouseLeave={() => setIsBackButtonHovered(false)}
        >
          <ArrowIcon />
        </button>
        <div className="text-center">
          <div className="text-white text-5xl p-4 font-bold animate-bounce-slow">{username || 'Loading...'}</div>
          <div className="text-white text-sm">collection</div>
        </div>
        <div className="w-3"></div>
      </div>

      {/* Collection Content */}
      {collection.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="bg-white rounded-lg p-6 text-center shadow-lg w-full font-pixelify max-w-sm transform hover:scale-105 transition-all duration-300">
            <div className="text-4xl mb-3 animate-bounce">📚</div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Collection Empty</h2>
            <p className="text-gray-600 text-sm mb-4">Start playing to collect cards!</p>
            <button
              onClick={() => navigate('/main')}
              className={`transition-all duration-300 transform ${isPlayButtonHovered ? 'scale-110 rotate-1' : 'scale-100'} hover:drop-shadow-lg`}
              onMouseEnter={() => setIsPlayButtonHovered(true)}
              onMouseLeave={() => setIsPlayButtonHovered(false)}
            >
              <div className="relative">
                <div className={`absolute inset-0 bg-green-400 rounded-lg blur-sm opacity-30 ${isPlayButtonHovered ? 'animate-pulse' : ''}`}></div>
                <div className="relative bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg text-sm border-2 border-green-600">
                  START PLAYING
                </div>
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 px-6 pb-6">
          <div className="relative mb-4">
            <button
              onClick={handleClearCollection}
              className="absolute -top-2 right-0 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 hover:rotate-12 transform z-10 hover:drop-shadow-xl"
              title="Clear all cards"
            >
              <TrashIcon />
            </button>
          </div>

          <div className="space-y-4">
            {collection.map((card) => (
              <div key={`${card.id}-${card.gameDate}`} className="relative transform hover:scale-105 transition-all duration-300">
                <div className={`${card.color} rounded-lg p-4 shadow-lg border-4 border-white relative hover:shadow-2xl transition-all duration-300`}>
                  <button
                    onClick={() => deleteCard(card.id, card.gameDate)}
                    className="absolute top-2 right-2 bg-white text-black hover:bg-red-500 hover:text-white w-8 h-8 rounded-sm flex items-center justify-center font-bold transition-all duration-300 shadow-md hover:scale-125 active:scale-95 hover:rotate-90 transform hover:drop-shadow-lg"
                    title="Delete this card"
                  >
                    <XIcon />
                  </button>
                  <div className="font-pixelify bg-white text-black p-3 rounded-md mb-3 font-mono text-sm border-2 border-gray-300 hover:border-gray-400 transition-all duration-200">
                    {card.card1.detail}
                  </div>
                  <div className="font-pixelify bg-white text-black p-3 rounded-md font-mono text-sm border-2 border-gray-300 hover:border-gray-400 transition-all duration-200">
                    {card.card2.detail}
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-2">
                    <span className="bg-black text-white px-2 py-1 rounded text-xs font-bold hover:bg-gray-800 transition-colors duration-200">
                      {card.gameMode.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
      `}</style>
    </div>
  );
};

export default Profile;
