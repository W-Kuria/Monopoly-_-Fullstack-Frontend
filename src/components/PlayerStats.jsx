import { useState } from 'react';
import { getPlayerProperties, calculatePlayerWorth, formatCurrency } from '../utils/gameUtils';
import './style/PlayerStats.css';

function PlayerStats({ gameState, currentPlayerId }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const handlePlayerClick = (player) => {
    setSelectedPlayer(selectedPlayer?.id === player.id ? null : player);
  };

  return (
    <div className="player-stats">
      <h3>Player Statistics</h3>
      
      <div className="players-list">
        {gameState.players.map((player, index) => {
          const properties = getPlayerProperties(gameState, player.id);
          const totalWorth = calculatePlayerWorth(gameState, player.id);
          const isCurrentPlayer = player.id === currentPlayerId;
          const isActivePlayer = index === gameState.currentPlayer;
          
          return (
            <div key={player.id} className="player-stat-card">
              <div 
                className={`player-summary ${isCurrentPlayer ? 'current-user' : ''} ${isActivePlayer ? 'active-turn' : ''}`}
                onClick={() => handlePlayerClick(player)}
              >
                <div className="player-info">
                  <span className="player-name">
                    {player.name}
                    {isCurrentPlayer && ' (You)'}
                    {isActivePlayer && ' 🎯'}
                  </span>
                  <span className="player-money">{formatCurrency(player.money)}</span>
                </div>
                
                <div className="player-stats-summary">
                  <span className="properties-count">{properties.length} properties</span>
                  <span className="total-worth">Worth: {formatCurrency(totalWorth)}</span>
                </div>
              </div>
              
              {selectedPlayer?.id === player.id && (
                <div className="player-details">
                  <h4>Properties Owned:</h4>
                  {properties.length === 0 ? (
                    <p className="no-properties">No properties owned</p>
                  ) : (
                    <div className="properties-list">
                      {properties.map(property => (
                        <div key={property.id} className={`property-item ${property.color || 'special'}`}>
                          <span className="property-name">{property.name}</span>
                          <span className="property-value">{formatCurrency(property.price)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="wealth-breakdown">
                    <div className="wealth-item">
                      <span>Cash:</span>
                      <span>{formatCurrency(player.money)}</span>
                    </div>
                    <div className="wealth-item">
                      <span>Property Value:</span>
                      <span>{formatCurrency(totalWorth - player.money)}</span>
                    </div>
                    <div className="wealth-item total">
                      <span>Total Worth:</span>
                      <span>{formatCurrency(totalWorth)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {gameState.players.length === 0 && (
        <div className="no-players">
          <p>No players have joined the game yet.</p>
        </div>
      )}
    </div>
  );
}

export default PlayerStats;