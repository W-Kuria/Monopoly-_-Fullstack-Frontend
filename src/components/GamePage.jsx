import { useState, useEffect } from 'react';
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

  // Function to roll dice
  const rollDice = () => {
    if (isRolling) return; // Prevent multiple rolls
    
    setIsRolling(true);
    
    // Simulate dice animation
    setTimeout(() => {
      const dice1 = Math.floor(Math.random() * 6) + 1;
      const dice2 = Math.floor(Math.random() * 6) + 1;
      setDiceValue([dice1, dice2]);
      setIsRolling(false);
      
      // Move player (we'll implement this next)
      movePlayer(dice1 + dice2);
    }, 1000);
  };

  // Function to move player
  const movePlayer = (spaces) => {
    // This will communicate with backend later
    console.log(`Moving player ${spaces} spaces`);
    // For now, just log it - we'll add backend communication next
  };

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

        {/* Board Spaces - Simple grid for now */}
        <div className="board-spaces">
          {boardSpaces.map(space => (
            <div key={space.id} className={`board-space ${space.type}`}>
              <div className="space-name">{space.name}</div>
              {space.price && <div className="space-price">${space.price}</div>}
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