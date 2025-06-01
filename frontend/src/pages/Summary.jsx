import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { addToCollection } from '../api/collection';
import { finishGame, getCardsByGameMode, getCardDetail } from '../api/game';
import { getMe } from '../api/user';

const Summary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // ข้อมูลเกมที่ส่งมาจากหน้าเกม
  const gameData = location.state || {
    gameModeId: 1,
    matchedPairs: [] // array ของ { card1Id, card2Id, isMatch }
  };

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userScore, setUserScore] = useState(0);
  const [totalPairs, setTotalPairs] = useState(0);

  // Animation state for buttons
  const [buttonStates, setButtonStates] = useState({});

  // โหลดข้อมูลเมื่อ component mount
  useEffect(() => {
    initializeSummary();
  }, []);

  // ฟังก์ชันสำหรับโหลดข้อมูลทั้งหมด
  const initializeSummary = async () => {
    setLoading(true);
    try {
      // 1. ดึงข้อมูล user เพื่อแสดงคะแนน
      await loadUserScore();

      // 2. ดึงการ์ดทั้งหมดจาก game mode
      await loadGameCards();

    } catch (error) {
      console.error('Error initializing summary:', error);
      setError('Failed to load game summary');
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันดึงคะแนน user
  const loadUserScore = async () => {
    try {
      const userResult = await getMe();
      if (userResult.success && userResult.data) {
        setUserScore(userResult.data.liveScore || 0);
      }
    } catch (error) {
      console.error('Error fetching user score:', error);
    }
  };

  // ฟังก์ชันโหลดการ์ดและสร้างคำถาม
  const loadGameCards = async () => {
    try {
      // ดึงการ์ดทั้งหมดจาก game mode
      const cardsResult = await getCardsByGameMode(gameData.gameModeId);
      if (!cardsResult.success || !cardsResult.data) {
        setError('Failed to load game cards');
        return;
      }

      const allCards = cardsResult.data;
      
      // สร้างคู่การ์ดที่ match กัน (การ์ดที่มี matchId เดียวกัน)
      const cardPairs = [];
      const processedMatchIds = new Set();

      for (const card of allCards) {
        if (card.matchId && !processedMatchIds.has(card.matchId)) {
          // หาการ์ดคู่ที่มี matchId เดียวกัน
          const matchingCard = allCards.find(c => 
            c.id !== card.id && c.matchId === card.matchId
          );

          if (matchingCard) {
            // ดึง detail ของทั้งสองการ์ด
            const [card1Detail, card2Detail] = await Promise.all([
              getCardDetail(card.id),
              getCardDetail(matchingCard.id)
            ]);

            if (card1Detail.success && card2Detail.success) {
              // เช็คว่าคู่นี้ user จับคู่ถูกหรือเปล่า
              const userMatch = gameData.matchedPairs?.find(pair => 
                (pair.card1Id === card.id && pair.card2Id === matchingCard.id) ||
                (pair.card1Id === matchingCard.id && pair.card2Id === card.id)
              );

              cardPairs.push({
                id: cardPairs.length + 1,
                card1: {
                  id: card.id,
                  detail: card1Detail.data.detail
                },
                card2: {
                  id: matchingCard.id,
                  detail: card2Detail.data.detail
                },
                isCorrect: userMatch ? userMatch.isMatch : false,
                wasAttempted: !!userMatch, // user พยายามจับคู่หรือเปล่า
                color: getRandomColor(),
                isAddedToProfile: false,
                gameModeId: gameData.gameModeId
              });

              processedMatchIds.add(card.matchId);
            }
          }
        }
      }

      setQuestions(cardPairs);
      setTotalPairs(cardPairs.length);

    } catch (error) {
      console.error('Error loading game cards:', error);
      setError('Failed to load game cards');
    }
  };

  // ฟังก์ชันสำหรับสุ่มสี
  const getRandomColor = () => {
    const colors = [
      "bg-cyan-400", "bg-pink-400", "bg-purple-400", "bg-gray-400",
      "bg-green-400", "bg-blue-600", "bg-yellow-400", "bg-purple-300",
      "bg-red-400", "bg-indigo-400", "bg-teal-400", "bg-orange-400"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Function to add/remove card from profile collection
  const toggleAddToProfile = (questionId) => {
    setButtonStates(prev => ({ ...prev, [`add-${questionId}`]: true }));
    setTimeout(() => {
      setButtonStates(prev => ({ ...prev, [`add-${questionId}`]: false }));
    }, 300);

    setQuestions(prevQuestions => 
      prevQuestions.map(question => 
        question.id === questionId 
          ? { ...question, isAddedToProfile: !question.isAddedToProfile }
          : question
      )
    );
  };

  // Function to save selected cards to profile using API
  const saveToProfile = async () => {
    setButtonStates(prev => ({ ...prev, save: true }));
    
    const selectedCards = questions.filter(q => q.isAddedToProfile);
    if (selectedCards.length === 0) {
      alert('Please select at least one card pair to add to your collection.');
      setButtonStates(prev => ({ ...prev, save: false }));
      return;
    }

    try {
      setLoading(true);
      let successCount = 0;
      let errorCount = 0;

      // เพิ่มแต่ละคู่การ์ดที่เลือกไว้เข้า collection
      for (const card of selectedCards) {
        try {
          const result = await addToCollection(
            card.card1.id,
            card.card2.id,
            card.gameModeId
          );
          
          if (result.success) {
            successCount++;
          } else {
            errorCount++;
            console.error('Failed to add card to collection:', result.msg);
          }
        } catch (error) {
          errorCount++;
          console.error('Error adding card to collection:', error);
        }
      }

      if (successCount > 0) {
        alert(`${successCount} card pair(s) added to your collection!`);
        // รีเซ็ต selection หลังจากบันทึกสำเร็จ
        setQuestions(prevQuestions =>
          prevQuestions.map(question => ({
            ...question,
            isAddedToProfile: false
          }))
        );
      }

      if (errorCount > 0) {
        alert(`Warning: ${errorCount} card pair(s) could not be added to your collection.`);
      }
    } catch (error) {
      console.error('Error saving to collection:', error);
      alert('Failed to save cards to collection. Please try again.');
    } finally {
      setLoading(false);
      setButtonStates(prev => ({ ...prev, save: false }));
    }
  };

  // ฟังก์ชันสำหรับจบเกมและรีเซ็ตคะแนน
  const handleFinishGame = async () => {
    try {
      const result = await finishGame();
      if (result.success) {
        console.log('Game finished successfully');
        // อัพเดทคะแนน user หลังจากจบเกม
        await loadUserScore();
      } else {
        console.error('Failed to finish game:', result.msg);
      }
    } catch (error) {
      console.error('Error finishing game:', error);
    }
  };

  const handlePlayAgain = async () => {
    setButtonStates(prev => ({ ...prev, playAgain: true }));
    await handleFinishGame();
    setTimeout(() => {
      navigate('/main');
    }, 200);
  };

  const handleHome = async () => {
    setButtonStates(prev => ({ ...prev, home: true }));
    await handleFinishGame();
    setTimeout(() => {
      navigate('/main');
    }, 200);
  };

  const handleViewProfile = async () => {
    setButtonStates(prev => ({ ...prev, profile: true }));
    await handleFinishGame();
    setTimeout(() => {
      navigate('/profile');
    }, 200);
  };

  const handleBack = async () => {
    setButtonStates(prev => ({ ...prev, back: true }));
    await handleFinishGame();
    setTimeout(() => {
      navigate(-1);
    }, 150);
  };

  const selectedCount = questions.filter(q => q.isAddedToProfile).length;
  const correctAnswers = questions.filter(q => q.isCorrect && q.wasAttempted).length;
  const attemptedAnswers = questions.filter(q => q.wasAttempted).length;

  const ArrowIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="transition-all duration-300 group-hover:translate-x-1">
      <path 
        d="M15 18L9 12L15 6" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );

  const CheckIcon = () => (
    <svg className="w-4 h-4 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );

  const XIcon = () => (
    <svg className="w-4 h-4 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );

  // Loading state
  if (loading && questions.length === 0) {
    return (
      <div className="min-h-screen bg-orange-300 flex items-center justify-center">
        <div className="text-white text-2xl font-bold animate-pulse">Loading Summary...</div>
      </div>
    );
  }

  // Error state
  if (error && questions.length === 0) {
    return (
      <div className="min-h-screen bg-orange-300 flex flex-col items-center justify-center">
        <div className="text-red-600 text-xl font-bold mb-4">{error}</div>
        <button
          onClick={() => navigate('/main')}
          className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-100"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-300 flex flex-col font-pixelify" style={{ fontFamily: 'monospace' }}>
      {/* Header matching Profile template */}
      <div className="flex items-center justify-between p-4 bg-bgOrange">
        <button
          onClick={handleBack}
          className={`group text-white hover:text-orange-200 transition-all duration-300 transform hover:scale-110 hover:-translate-x-2 hover:rotate-12 active:scale-95 active:rotate-45 ${
            buttonStates.back ? 'animate-spin scale-75' : ''
          }`}
        >
          <ArrowIcon />
        </button>
        <div className="text-center">
          <div className="text-white text-6xl font-bold animate-pulse hover:animate-bounce transition-all duration-300">SUMMARY</div>
          <div className="text-white text-lg">Live Score: {userScore}</div>
          <div className="text-white text-md">Correct: {correctAnswers}/{totalPairs}</div>
        </div>
        <div className="w-6"></div> {/* Spacer */}
      </div>

      <div className="flex justify-center py-3">
      </div>

      {/* Questions List - matching Profile card style */}
      <div className="flex-1 px-4 pb-6">
        {questions.length === 0 ? (
          <div className="text-center text-white text-xl mt-10">
            No card pairs available for this game mode
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={question.id} className="relative animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                {/* Card matching Profile template style */}
                <div className={`${question.color} rounded-lg p-4 shadow-lg border-4 border-white relative transition-all duration-300 hover:shadow-2xl hover:scale-102 hover:-translate-y-1 ${
                  question.isAddedToProfile ? 'ring-4 ring-yellow-400 animate-pulse' : ''
                } ${!question.wasAttempted ? 'opacity-75' : ''}`}>
                  
                  {/* Question Number - top left */}
                  <div className="absolute top-2 left-2 bg-white text-black font-bold px-2 py-1 rounded text-sm min-w-[24px] text-center transform hover:scale-110 hover:rotate-12 transition-all duration-200">
                    {index + 1}
                  </div>

                  {/* Status Indicator - top right */}
                  <div className="absolute top-2 right-2 flex-shrink-0">
                    {!question.wasAttempted ? (
                      <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        ?
                      </div>
                    ) : question.isCorrect ? (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-400 hover:scale-125 transition-all duration-200 animate-bounce">
                        <CheckIcon />
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-400 hover:scale-125 transition-all duration-200 animate-bounce">
                        <XIcon />
                      </div>
                    )}
                  </div>
                  
                  {/* Card 1 section */}
                  <div className="font-pixelify bg-white text-black p-3 rounded-md mb-3 font-mono text-sm border-2 border-gray-300 mt-8 hover:border-blue-400 hover:shadow-inner transition-all duration-200">
                    <div className="font-bold text-xs text-gray-600 mb-1">Card 1 (ID: {question.card1?.id})</div>
                    {question.card1?.detail}
                  </div>
                  
                  {/* Card 2 section */}
                  <div className="font-pixelify bg-white text-black p-3 rounded-md font-mono text-sm border-2 border-gray-300 hover:border-blue-400 hover:shadow-inner transition-all duration-200">
                    <div className="font-bold text-xs text-gray-600 mb-1">Card 2 (ID: {question.card2?.id})</div>
                    {question.card2?.detail}
                  </div>

                  {/* Match Status */}
                  <div className="mt-2 text-center">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                      !question.wasAttempted 
                        ? 'bg-gray-200 text-gray-600' 
                        : question.isCorrect 
                          ? 'bg-green-200 text-green-800' 
                          : 'bg-red-200 text-red-800'
                    }`}>
                      {!question.wasAttempted ? 'Not Attempted' : question.isCorrect ? 'Matched!' : 'Not Matched'}
                    </span>
                  </div>
                  
                  {/* Add to Profile Button - bottom right */}
                  <div className="flex justify-end mt-3 pt-2">
                    <button
                      onClick={() => toggleAddToProfile(question.id)}
                      disabled={loading}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                        question.isAddedToProfile
                          ? 'bg-yellow-400 text-black shadow-lg animate-bounce hover:animate-pulse hover:bg-yellow-300'
                          : 'bg-white text-black hover:bg-yellow-100 hover:shadow-lg hover:border-yellow-300 border-2 border-transparent'
                      } ${buttonStates[`add-${question.id}`] ? 'animate-spin scale-125' : ''}`}
                    >
                      <span className={`inline-block transition-transform duration-300 ${question.isAddedToProfile ? 'animate-pulse' : 'hover:scale-110'}`}>
                        {question.isAddedToProfile ? '★ ADDED' : '+ ADD'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Save to Profile Button */}
        {selectedCount > 0 && (
          <div className="mt-6 animate-slideUp">
            <button
              onClick={saveToProfile}
              disabled={loading}
              className={`w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 font-pixelify shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2 active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed ${
                buttonStates.save ? 'animate-pulse scale-110 bg-yellow-300' : ''
              }`}
            >
              <span className="inline-flex items-center space-x-2 group-hover:animate-bounce">
                <span className="text-2xl group-hover:animate-spin">💾</span>
                <span className="group-hover:scale-110 transition-transform duration-200">
                  {loading ? 'SAVING...' : `SAVE ${selectedCount} PAIR(S) TO COLLECTION`}
                </span>
              </span>
            </button>
          </div>
        )}

        {/* Bottom Buttons */}
        <div className="flex flex-col space-y-3 mt-6">
          <div className="flex space-x-4">
            <button
              onClick={handlePlayAgain}
              disabled={loading}
              className={`flex-1 bg-green-500 hover:bg-green-400 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 font-pixelify shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2 active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed ${
                buttonStates.playAgain ? 'animate-pulse scale-110 bg-green-300' : ''
              }`}
            >
              <span className="group-hover:animate-bounce inline-block transition-transform duration-200">
                🎮 PLAY AGAIN
              </span>
            </button>
            
            <button
              onClick={handleHome}
              disabled={loading}
              className={`flex-1 bg-blue-500 hover:bg-blue-400 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 font-pixelify shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2 active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed ${
                buttonStates.home ? 'animate-pulse scale-110 bg-blue-300' : ''
              }`}
            >
              <span className="group-hover:animate-bounce inline-block transition-transform duration-200">
                🏠 HOME
              </span>
            </button>
          </div>
          
          <button
            onClick={handleViewProfile}
            disabled={loading}
            className={`w-full bg-purple-500 hover:bg-purple-400 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 font-pixelify shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2 active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed ${
              buttonStates.profile ? 'animate-pulse scale-110 bg-purple-300' : ''
            }`}
          >
            <span className="inline-flex items-center space-x-2 group-hover:animate-bounce p-3">
              <span className="text-xl group-hover:animate-spin">📖</span>
              <span className="group-hover:scale-110 transition-transform duration-200">
                VIEW MY COLLECTION
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .font-pixelify {
          font-family: 'Courier New', monospace;
          letter-spacing: 1px;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
        
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default Summary;