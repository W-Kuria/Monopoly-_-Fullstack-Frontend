import { useState, useEffect } from 'react';
import gameService from '../services/gameService';
import Board from './Board';
import PlayerStats from './PlayerStats';
import GameStatus from './GameStatus';
import Game from '../dice'; // Import existing dice component
import Draw_card from '../Card'; // Import existing card component
import { formatCurrency, passedGO, GO_MONEY } from '../utils/gameUtils';
import './GamePage.css';

function GamePage({ gameId, playerId, onLeaveGame }) {
  // Game state - this will hold all the important game information
  const [gameState, setGameState] = useState({
    players: [],
    currentPlayer: 0,
    properties: [],
    gameStarted: false
  });

  // Player position tracking
  const [playerPositions, setPlayerPositions] = useState({});
  
  // Dice state
  const [diceValue, setDiceValue] = useState([1, 1]);
  const [isRolling, setIsRolling] = useState(false);

  // Card drawing trigger state
  const [cardTriggered, setCardTriggered] = useState(false);
  
  // Property purchase modal
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);

  // Function to roll dice - now with backend communication
  const rollDice = async () => {
    if (isRolling) return; // Prevent multiple rolls
    
    setIsRolling(true);
    
    try {
      // Call backend to roll dice
      const currentGameId = gameId || localStorage.getItem('currentGameId') || 'demo-game';
      const currentPlayerId = playerId || localStorage.getItem('playerId') || 'player-1';
      
      const result = await gameService.rollDice(currentGameId, currentPlayerId);
      
      // Update dice display with backend result
      setDiceValue([result.dice1, result.dice2]);
      
      // Move player based on backend calculation
      if (result.newPosition !== undefined) {
        const oldPosition = playerPositions[currentPlayerId] || 0;
        updatePlayerPosition(currentPlayerId, result.newPosition);
        
        // Check if player passed GO
        if (passedGO(oldPosition, result.newPosition)) {
          alert(`You passed GO! Collect ${formatCurrency(GO_MONEY)}`);
        }
      }
      
      // Update game state with backend response
      if (result.gameState) {
        setGameState(result.gameState);
      }
      
    } catch (error) {
      console.error('Failed to roll dice:', error);
      // Fallback to local dice roll if backend fails
      const dice1 = Math.floor(Math.random() * 6) + 1;
      const dice2 = Math.floor(Math.random() * 6) + 1;
      setDiceValue([dice1, dice2]);
    } finally {
      setIsRolling(false);
    }
  };

  // Function to update player position
  const updatePlayerPosition = (playerId, newPosition) => {
    setPlayerPositions(prev => ({
      ...prev,
      [playerId]: newPosition
    }));
  };

  // Handle property click
  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
    setShowPropertyModal(true);
  };
  
  // Function to buy property
  const buyProperty = async (propertyId) => {
    try {
      const currentGameId = gameId || localStorage.getItem('currentGameId') || 'demo-game';
      const currentPlayerId = playerId || localStorage.getItem('playerId') || 'player-1';
      
      const result = await gameService.buyProperty(currentGameId, currentPlayerId, propertyId);
      
      if (result.success) {
        // Update game state with new property ownership
        setGameState(result.gameState);
        setShowPropertyModal(false);
        alert(`Property purchased successfully!`);
      } else {
        alert(result.message || 'Failed to purchase property');
      }
    } catch (error) {
      console.error('Failed to buy property:', error);
      alert('Error purchasing property');
    }
  };

  // Load game state when component mounts
  useEffect(() => {
    const loadGameState = async () => {
      try {
        const currentGameId = gameId || localStorage.getItem('currentGameId');
        if (currentGameId) {
          const state = await gameService.getGameState(currentGameId);
          setGameState(state);
          
          // Set player positions if available
          if (state.playerPositions) {
            setPlayerPositions(state.playerPositions);
          }
        }
      } catch (error) {
        console.error('Failed to load game state:', error);
        // Set demo data if backend is not available
        setGameState({
          players: [
            { id: 'player-1', name: 'You', money: 1500 },
            { id: 'player-2', name: 'Player 2', money: 1500 }
          ],
          currentPlayer: 0,
          properties: [],
          gameStarted: true
        });
      }
    };
    
    loadGameState();
  }, []);

  return (
    <div className="game-page">
      <div className="game-header">
        <h1>Monopoly Game</h1>
        <div className="game-info">
          <span>Game ID: {gameId}</span>
          <button onClick={onLeaveGame} className="leave-button">
            Leave Game
          </button>
        </div>
      </div>
      
      {/* Main Game Area */}
      <div className="game-main">
        {/* Game Board */}
        <Board 
          playerPositions={playerPositions}
          onPropertyClick={handlePropertyClick}
          gameState={gameState}
        />
        
        {/* Game Controls */}
        <div className="game-controls">
          <GameStatus gameState={gameState} gameId={gameId} />
          
          <div className="dice-section">
            <h3>Your Turn</h3>
            <div className="dice-display">
              <div className="die">{diceValue[0]}</div>
              <div className="die">{diceValue[1]}</div>
            </div>
            <Game playerId={playerId} /> {/* Use existing dice component */}
            <button 
              onClick={rollDice} 
              disabled={isRolling}
              className="roll-button"
            >
              {isRolling ? "Rolling..." : "Roll Dice (Backend)"}
            </button>
          </div>
        </div>
      </div>

      {/* Player Stats Panel */}
      <PlayerStats 
        gameState={gameState} 
        currentPlayerId={playerId}
      />
      
      {/* Property Purchase Modal */}
      {showPropertyModal && selectedProperty && (
        <div className="modal-overlay" onClick={() => setShowPropertyModal(false)}>
          <div className="property-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedProperty.name}</h3>
            <p>Price: ${selectedProperty.price}</p>
            <div className="modal-buttons">
              <button 
                onClick={() => buyProperty(selectedProperty.id)}
                className="buy-btn"
              >
                Buy Property
              </button>
              <button 
                onClick={() => setShowPropertyModal(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Card Component */}
      <Draw_card triggered={cardTriggered} />
    </div>
  );
}

export default GamePage;