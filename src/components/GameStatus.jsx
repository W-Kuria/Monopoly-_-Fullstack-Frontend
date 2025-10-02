import { formatCurrency, isGameOver, getWinner } from '../utils/gameUtils';
import './style/GameStatus.css';

function GameStatus({ gameState, gameId }) {
  const winner = getWinner(gameState);
  const gameOver = isGameOver(gameState);
  
  return (
    <div className="game-status">
      <div className="status-header">
        <h3>Game Status</h3>
        <div className="game-id">ID: {gameId}</div>
      </div>
      
      <div className="status-info">
        {gameOver ? (
          <div className="game-over">
            <div className="winner-announcement">
              🏆 Game Over! 🏆
            </div>
            {winner && (
              <div className="winner-details">
                <strong>{winner.name}</strong> wins!
                <div className="winner-worth">
                  Final Worth: {formatCurrency(winner.money)}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="game-active">
            <div className="current-turn">
              {gameState.players.length > 0 && gameState.currentPlayer < gameState.players.length ? (
                <>
                  <span className="turn-label">Current Turn:</span>
                  <span className="current-player">
                    {gameState.players[gameState.currentPlayer].name}
                  </span>
                </>
              ) : (
                <span className="waiting">Waiting for players...</span>
              )}
            </div>
            
            <div className="game-stats">
              <div className="stat-item">
                <span className="stat-label">Players:</span>
                <span className="stat-value">{gameState.players.length}</span>
              </div>
              
              <div className="stat-item">
                <span className="stat-label">Properties Owned:</span>
                <span className="stat-value">
                  {gameState.properties ? gameState.properties.filter(p => p.owner).length : 0}
                </span>
              </div>
              
              <div className="stat-item">
                <span className="stat-label">Available Properties:</span>
                <span className="stat-value">
                  {gameState.properties ? gameState.properties.filter(p => !p.owner).length : 28}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="game-actions">
        {gameState.gameStarted ? (
          <div className="game-started">
            <span className="status-indicator active">🟢 Game In Progress</span>
          </div>
        ) : (
          <div className="game-waiting">
            <span className="status-indicator waiting">🟡 Waiting to Start</span>
            <p className="waiting-message">
              Need at least 2 players to begin
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GameStatus;