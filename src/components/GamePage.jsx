import { useState, useEffect } from 'react';
import gameService from '../services/gameService';
import './GamePage.css';

function GamePage() {
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

  // Simple Monopoly board properties (just the basics for now)
  const boardSpaces = [
    { id: 0, name: "GO", type: "special" },
    { id: 1, name: "Mediterranean Ave", type: "property", price: 60, color: "brown" },
    { id: 2, name: "Community Chest", type: "special" },
    { id: 3, name: "Baltic Ave", type: "property", price: 60, color: "brown" },
    { id: 4, name: "Income Tax", type: "special" },
    { id: 5, name: "Reading Railroad", type: "railroad", price: 200 },
    { id: 6, name: "Oriental Ave", type: "property", price: 100, color: "lightblue" },
    { id: 7, name: "Chance", type: "special" },
    { id: 8, name: "Vermont Ave", type: "property", price: 100, color: "lightblue" },
    { id: 9, name: "Connecticut Ave", type: "property", price: 120, color: "lightblue" },
    { id: 10, name: "Jail", type: "special" },
    // Add more spaces as needed - keeping it simple for now
  ];

  // Function to roll dice - now with backend communication
  const rollDice = async () => {
    if (isRolling) return; // Prevent multiple rolls
    
    setIsRolling(true);
    
    try {
      // Call backend to roll dice
      const gameId = localStorage.getItem('currentGameId') || 'demo-game';
      const playerId = localStorage.getItem('playerId') || 'player-1';
      
      const result = await gameService.rollDice(gameId, playerId);
      
      // Update dice display with backend result
      setDiceValue([result.dice1, result.dice2]);
      
      // Move player based on backend calculation
      if (result.newPosition !== undefined) {
        updatePlayerPosition(playerId, result.newPosition);
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

  // Function to buy property
  const buyProperty = async (propertyId) => {
    try {
      const gameId = localStorage.getItem('currentGameId') || 'demo-game';
      const playerId = localStorage.getItem('playerId') || 'player-1';
      
      const result = await gameService.buyProperty(gameId, playerId, propertyId);
      
      if (result.success) {
        // Update game state with new property ownership
        setGameState(result.gameState);
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
        const gameId = localStorage.getItem('currentGameId');
        if (gameId) {
          const state = await gameService.getGameState(gameId);
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
      <h1>Monopoly Game</h1>
      
      {/* Game Board */}
      <div className="game-board">
        <div className="board-center">
          <h2>MONOPOLY</h2>
          
          {/* Dice Section */}
          <div className="dice-section">
            <div className="dice">
              <div className="die">{diceValue[0]}</div>
              <div className="die">{diceValue[1]}</div>
            </div>
            <button 
              onClick={rollDice} 
              disabled={isRolling}
              className="roll-button"
            >
              {isRolling ? "Rolling..." : "Roll Dice"}
            </button>
          </div>
        </div>

        {/* Board Spaces - Now with buy functionality */}
        <div className="board-spaces">
          {boardSpaces.map(space => (
            <div key={space.id} className={`board-space ${space.type}`}>
              <div className="space-name">{space.name}</div>
              {space.price && <div className="space-price">${space.price}</div>}
              
              {/* Show players on this space */}
              <div className="players-on-space">
                {Object.entries(playerPositions).map(([playerId, position]) => 
                  position === space.id ? (
                    <div key={playerId} className="player-token">
                      {playerId === 'player-1' ? '🔴' : '🔵'}
                    </div>
                  ) : null
                )}
              </div>
              
              {/* Buy button for properties */}
              {space.type === 'property' && (
                <button 
                  className="buy-button"
                  onClick={() => buyProperty(space.id)}
                >
                  Buy
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Player Info Panel */}
      <div className="player-info">
        <h3>Players</h3>
        {gameState.players.length === 0 ? (
          <p>No players joined yet</p>
        ) : (
          gameState.players.map((player, index) => (
            <div key={index} className="player-card">
              <span>{player.name}</span>
              <span>${player.money || 1500}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default GamePage;