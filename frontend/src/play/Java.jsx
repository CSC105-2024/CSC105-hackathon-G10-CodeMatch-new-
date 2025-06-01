import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Java = () => {
  const navigate = useNavigate();
  
  // Java programming concepts for card pairs
  const cardData = [
    { id: 1, concept: 'Class', description: 'Blueprint for objects' },
    { id: 2, concept: 'Object', description: 'Instance of a class' },
    { id: 3, concept: 'Method', description: 'Function inside a class' },
    { id: 4, concept: 'Variable', description: 'Container for data' },
    { id: 5, concept: 'Array', description: 'Collection of elements' },
    { id: 6, concept: 'Loop', description: 'Repeated execution' },
    { id: 7, concept: 'Inheritance', description: 'Class extends another' },
    { id: 8, concept: 'Exception', description: 'Error handling mechanism' }
  ];

  // Create pairs by duplicating each concept
  const createCardPairs = () => {
    const pairs = [];
    cardData.forEach((item, index) => {
      pairs.push({ ...item, pairId: index, uniqueId: `${index}-a`, type: 'concept' });
      pairs.push({ ...item, pairId: index, uniqueId: `${index}-b`, type: 'description' });
    });
    return shuffleArray(pairs);
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const [cards, setCards] = useState(createCardPairs());
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [matchAttempts, setMatchAttempts] = useState(0);
  const [theme, setTheme] = useState('default');
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Theme configurations with card colors
  const themes = {
    default: {
      name: 'Default',
      cardBack: 'bg-gray-900',
      cardBackHover: 'hover:bg-gray-800',
      cardFront: 'bg-gray-50',
      cardText: 'text-gray-900',
      matchedColors: [
        'border-gray-300', 'border-gray-400', 'border-gray-500', 'border-gray-600',
        'border-gray-700', 'border-gray-800', 'border-gray-200', 'border-gray-100'
      ],
      defaultBorder: 'border-gray-400',
      selectedRing: 'ring-gray-300',
      matchIndicator: 'bg-gray-400/30 border-gray-400'
    },
    purple: {
      name: 'Purple Theme',
      cardBack: 'bg-purple-900',
      cardBackHover: 'hover:bg-purple-800',
      cardFront: 'bg-purple-50',
      cardText: 'text-purple-900',
      matchedColors: [
        'border-purple-300', 'border-purple-400', 'border-purple-500', 'border-purple-600',
        'border-purple-700', 'border-purple-800', 'border-violet-500', 'border-fuchsia-500'
      ],
      defaultBorder: 'border-purple-400',
      selectedRing: 'ring-purple-300',
      matchIndicator: 'bg-purple-400/30 border-purple-400'
    },
    green: {
      name: 'Green Theme',
      cardBack: 'bg-green-900',
      cardBackHover: 'hover:bg-green-800',
      cardFront: 'bg-green-50',
      cardText: 'text-green-900',
      matchedColors: [
        'border-green-300', 'border-green-400', 'border-green-500', 'border-green-600',
        'border-green-700', 'border-green-800', 'border-emerald-500', 'border-teal-500'
      ],
      defaultBorder: 'border-green-400',
      selectedRing: 'ring-green-300',
      matchIndicator: 'bg-green-400/30 border-green-400'
    },
    red: {
      name: 'Red Theme',
      cardBack: 'bg-red-900',
      cardBackHover: 'hover:bg-red-800',
      cardFront: 'bg-red-50',
      cardText: 'text-red-900',
      matchedColors: [
        'border-red-300', 'border-red-400', 'border-red-500', 'border-red-600',
        'border-red-700', 'border-red-800', 'border-rose-500', 'border-pink-500'
      ],
      defaultBorder: 'border-red-400',
      selectedRing: 'ring-red-300',
      matchIndicator: 'bg-red-400/30 border-red-400'
    },
    orange: {
      name: 'Orange Theme',
      cardBack: 'bg-orange-900',
      cardBackHover: 'hover:bg-orange-800',
      cardFront: 'bg-orange-50',
      cardText: 'text-orange-900',
      matchedColors: [
        'border-orange-300', 'border-orange-400', 'border-orange-500', 'border-orange-600',
        'border-orange-700', 'border-orange-800', 'border-amber-500', 'border-yellow-500'
      ],
      defaultBorder: 'border-orange-400',
      selectedRing: 'ring-orange-300',
      matchIndicator: 'bg-orange-400/30 border-orange-400'
    },
    pink: {
      name: 'Pink Theme',
      cardBack: 'bg-pink-900',
      cardBackHover: 'hover:bg-pink-800',
      cardFront: 'bg-pink-50',
      cardText: 'text-pink-900',
      matchedColors: [
        'border-pink-300', 'border-pink-400', 'border-pink-500', 'border-pink-600',
        'border-pink-700', 'border-pink-800', 'border-rose-500', 'border-fuchsia-500'
      ],
      defaultBorder: 'border-pink-400',
      selectedRing: 'ring-pink-300',
      matchIndicator: 'bg-pink-400/30 border-pink-400'
    }
  };

  const currentTheme = themes[theme];

  const handleCardClick = (cardId) => {
    // Don't allow interaction with matched cards
    if (matchedPairs.includes(cardId)) {
      return;
    }

    // If card is already flipped, toggle it off
    if (flippedCards.includes(cardId)) {
      setFlippedCards(prev => prev.filter(id => id !== cardId));
      return;
    }

    // If we already have 2 cards flipped, don't allow more
    if (flippedCards.length >= 2) {
      return;
    }

    // Add the card to flipped cards
    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);
  };

  const checkMatch = (flippedCardIds) => {
    const [firstCardId, secondCardId] = flippedCardIds;
    const firstCard = cards.find(card => card.uniqueId === firstCardId);
    const secondCard = cards.find(card => card.uniqueId === secondCardId);

    if (firstCard.pairId === secondCard.pairId) {
      // Match found - increase score and keep cards matched
      setMatchedPairs(prev => [...prev, firstCardId, secondCardId]);
      setScore(prev => prev + 1);
      setFlippedCards([]);
    } else {
      // No match - just flip cards back, do nothing else
      setTimeout(() => {
        setFlippedCards([]);
      }, 1000); // Give 1 second to see the cards before flipping back
    }

    setMatchAttempts(prev => prev + 1);
  };

  const handleMatch = () => {
    if (flippedCards.length === 2) {
      checkMatch(flippedCards);
    }
  };

  const resetGame = () => {
    setCards(createCardPairs());
    setFlippedCards([]);
    setMatchedPairs([]);
    setScore(0);
    setMatchAttempts(0);
  };

  const isCardFlipped = (cardId) => {
    return flippedCards.includes(cardId) || matchedPairs.includes(cardId);
  };

  const isCardMatched = (cardId) => {
    return matchedPairs.includes(cardId);
  };

  const getBorderColor = (cardId) => {
    if (isCardMatched(cardId)) {
      const card = cards.find(c => c.uniqueId === cardId);
      return currentTheme.matchedColors[card.pairId] || currentTheme.matchedColors[0];
    }
    return currentTheme.defaultBorder;
  };

  const getCardBackgroundClass = (cardId) => {
    if (isCardFlipped(cardId)) {
      return currentTheme.cardFront;
    }
    return `${currentTheme.cardBack} ${currentTheme.cardBackHover}`;
  };

  const getSelectedRingClass = (cardId) => {
    if (flippedCards.includes(cardId) && !matchedPairs.includes(cardId)) {
      return `ring-4 ${currentTheme.selectedRing} ring-opacity-75`;
    }
    return '';
  };

  const getMatchIndicatorClass = () => {
    return currentTheme.matchIndicator;
  };

  const gameComplete = matchedPairs.length === 16;

  return (
    <div className="min-h-screen bg-gradient-to-r from-red-600 to-javaBlue p-4 md:p-8 font-pixelify">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Match the Postcard</h1>
          <div className="flex flex-col md:flex-row justify-between items-center text-white text-lg md:text-xl gap-4">
            <span>Category: Java</span>
            <div className="flex items-center gap-4 md:gap-8">
              <span>Match {matchAttempts}/8</span>
              <span>Score {score}/8</span>
            </div>
          </div>
          
          {/* Theme Selector */}
          <div className="mt-4 flex justify-center md:justify-end">
            <select 
              value={theme} 
              onChange={(e) => setTheme(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg text-lg transition-all duration-200 hover:bg-gray-700 active:scale-95"
            >
              {Object.entries(themes).map(([key, themeConfig]) => (
                <option key={key} value={key}>{themeConfig.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Game Board - 4x4 Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8 max-w-5xl mx-auto">
          {cards.map((card, index) => (
            <div
              key={card.uniqueId}
              className={`relative aspect-[3/4] cursor-pointer group transition-all duration-200 ${
                matchedPairs.includes(card.uniqueId) 
                  ? 'pointer-events-none' 
                  : 'hover:scale-105 active:scale-95 active:rotate-1'
              }`}
              onClick={() => handleCardClick(card.uniqueId)}
            >
              <div className={`w-full h-full rounded-xl border-4 md:border-6 ${getBorderColor(card.uniqueId)} transition-all duration-300 transform ${
                getCardBackgroundClass(card.uniqueId)
              } ${
                isCardFlipped(card.uniqueId) ? 'shadow-lg' : ''
              } ${
                getSelectedRingClass(card.uniqueId)
              }`}>
                
                {/* Card Content */}
                <div className="flex flex-col items-center justify-center h-full p-2 md:p-4 text-center">
                  {isCardFlipped(card.uniqueId) ? (
                    // Flipped card shows content
                    <div className={`${currentTheme.cardText} animate-in fade-in duration-300`}>
                      <div className="font-bold text-sm md:text-lg mb-2 md:mb-3">
                        {card.type === 'concept' ? card.concept : card.description}
                      </div>
                      <div className="text-xs md:text-sm opacity-70 bg-gray-100 px-2 md:px-3 py-1 md:py-2 rounded-lg">
                        {card.type === 'concept' ? 'Concept' : 'Definition'}
                      </div>
                      {/* PC: Show description in card */}
                      {!isMobile && (
                        <div className="text-xs mt-2 text-white bg-gray-600 px-2 py-1 rounded">
                          <strong>{card.type === 'concept' ? 'Def: ' : 'Concept: '}</strong>
                          {card.type === 'concept' ? card.description : card.concept}
                        </div>
                      )}
                    </div>
                  ) : (
                    // Card back shows Java logo
                    <div className="text-center">
                      <div className="text-gray-400 font-bold text-lg md:text-3xl mb-2 md:mb-3">JAVA</div>
                      <img src="../public/logoCard2.png" alt="Logo"></img>
                      <div className="text-gray-500 text-xs md:text-sm">Click to reveal</div>
                    </div>
                  )}
                </div>

                {/* Matched indicator - enhanced visibility with theme colors */}
                {isCardMatched(card.uniqueId) && (
                  <div className={`absolute inset-0 ${getMatchIndicatorClass()} rounded-xl border-4 md:border-6 animate-pulse`}></div>
                )}

                {/* Card press animation overlay */}
                <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-active:opacity-100 transition-opacity duration-150 pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Description under the lowest card */}
        {isMobile && flippedCards.length > 0 && (
          <div className="mb-8 animate-in slide-in-from-bottom duration-300">
            <div className="bg-white/95 backdrop-blur rounded-xl p-4 md:p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Card Details</h3>
              <div className="space-y-3">
                {flippedCards.map((cardId) => {
                  const card = cards.find(c => c.uniqueId === cardId);
                  return (
                    <div key={cardId} className="bg-gray-50 rounded-lg p-3">
                      <div className="font-semibold text-base text-gray-800 mb-1">
                        {card.type === 'concept' ? card.concept : card.description}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {card.type === 'concept' ? 'Concept' : 'Definition'}
                      </div>
                      <div className="text-sm text-gray-700">
                        <strong>{card.type === 'concept' ? 'Definition: ' : 'Concept: '}</strong>
                        {card.type === 'concept' ? card.description : card.concept}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Match Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleMatch}
            disabled={flippedCards.length !== 2}
            className={`px-8 md:px-12 py-3 md:py-4 rounded-xl font-bold text-white text-lg md:text-xl transition-all duration-200 transform ${
              flippedCards.length === 2 
                ? 'bg-green-500 hover:bg-green-600 hover:scale-105 active:scale-95 active:bg-green-700 shadow-lg hover:shadow-xl' 
                : 'bg-gray-600 cursor-not-allowed opacity-50'
            } ${
              flippedCards.length === 2 
                ? 'animate-pulse hover:animate-none' 
                : ''
            }`}
          >
            Match
          </button>
        </div>

        {/* Game Status */}
        {flippedCards.length === 0 && (
          <div className="text-center text-white text-base md:text-lg mb-8 animate-in fade-in duration-500">
            <p>Click any two cards to start matching!</p>
          </div>
        )}

        {flippedCards.length === 1 && (
          <div className="text-center text-white text-base md:text-lg mb-8 animate-in fade-in duration-300">
            <p>Select another card to make a match, or click the same card to close it!</p>
          </div>
        )}

        {flippedCards.length === 2 && (
          <div className="text-center text-white text-base md:text-lg mb-8 animate-in fade-in duration-300">
            <p>Click Match to check if they're a pair, or click cards to toggle them!</p>
          </div>
        )}

        {/* Game Complete */}
        {gameComplete && (
          <div className="text-center bg-white/10 backdrop-blur rounded-xl p-6 md:p-8 mb-8 animate-in slide-in-from-bottom duration-500">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">🎉 Congratulations!</h2>
            <p className="text-white/90 text-base md:text-lg">You completed the Java game!</p>
            <p className="text-white/90 text-base md:text-lg mb-6">Final Score: {score}/8 in {matchAttempts} attempts</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg text-lg font-bold transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                Play Again
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white rounded-lg text-lg font-bold transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                Back to Menu
              </button>
            </div>
          </div>
        )}

        {/* Reset Button */}
        <div className="flex justify-center">
          <button
            onClick={resetGame}
            className="px-6 md:px-8 py-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-xl font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 hover:shadow-lg flex items-center gap-3 text-base md:text-lg group"
          >
            <span className="text-xl md:text-2xl transition-transform duration-200 group-active:rotate-180">↻</span>
            Reset Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default Java;