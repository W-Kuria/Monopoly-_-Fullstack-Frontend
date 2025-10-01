import { useState } from 'react';
import gameService from '../services/gameService';
import './style/GameLobby.css';

function GameLobby({ onJoinGame }) {
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  // Create a new game
  const createGame = async () => {
    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }

    setIsCreating(true);
    try {
      const result = await gameService.createGame(playerName);
      
      // Store game info in localStorage
      localStorage.setItem('currentGameId', result.gameId);
      localStorage.setItem('playerId', result.playerId);
      localStorage.setItem('playerName', playerName);
      
      // Notify parent component
      onJoinGame(result.gameId, result.playerId);
      
    } catch (error) {
      console.error('Failed to create game:', error);
      alert('Failed to create game. Make sure the backend server is running.');
    } finally {
      setIsCreating(false);
    }
  };

  // Join an existing game
  const joinGame = async () => {
    if (!playerName.trim() || !gameId.trim()) {
      alert('Please enter your name and game ID');
      return;
    }

    setIsJoining(true);
    try {
      const result = await gameService.joinGame(gameId, playerName);
      
      // Store game info in localStorage
      localStorage.setItem('currentGameId', gameId);
      localStorage.setItem('playerId', result.playerId);
      localStorage.setItem('playerName', playerName);
      
      // Notify parent component
      onJoinGame(gameId, result.playerId);
      
    } catch (error) {
      console.error('Failed to join game:', error);
      alert('Failed to join game. Check the game ID and try again.');
    } finally {
      setIsJoining(false);
    }
  };

  // Quick demo mode (no backend needed)
  const startDemo = () => {
    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }

    // Set demo data
    localStorage.setItem('currentGameId', 'demo-game');
    localStorage.setItem('playerId', 'player-1');
    localStorage.setItem('playerName', playerName);
    
    onJoinGame('demo-game', 'player-1');
  };

  return (
    <div className="game-lobby">
      <div className="lobby-container">
        <h1>Monopoly Game Lobby</h1>
        <p>Welcome! Enter your name to start playing.</p>
        
        <div className="input-section">
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="name-input"
          />
        </div>

        <div className="game-options">
          <div className="option-card">
            <h3>Create New Game</h3>
            <p>Start a new game and invite friends</p>
            <button 
              onClick={createGame}
              disabled={isCreating}
              className="create-button"
            >
              {isCreating ? 'Creating...' : 'Create Game'}
            </button>
          </div>

          <div className="option-card">
            <h3>Join Existing Game</h3>
            <input
              type="text"
              placeholder="Enter Game ID"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              className="game-id-input"
            />
            <button 
              onClick={joinGame}
              disabled={isJoining}
              className="join-button"
            >
              {isJoining ? 'Joining...' : 'Join Game'}
            </button>
          </div>

          <div className="option-card">
            <h3>Demo Mode</h3>
            <p>Play offline without backend</p>
            <button 
              onClick={startDemo}
              className="demo-button"
            >
              Start Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameLobby;