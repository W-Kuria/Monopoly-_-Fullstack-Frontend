import { useState, useEffect } from 'react';
import './style/Board.css';

function Board({ playerPositions, onPropertyClick, gameState }) {
  // Complete Monopoly board layout (40 spaces)
  const boardSpaces = [
    // Bottom row (right to left)
    { id: 0, name: "GO", type: "corner", position: "bottom-right" },
    { id: 1, name: "Mediterranean Ave", type: "property", price: 60, color: "brown", position: "bottom" },
    { id: 2, name: "Community Chest", type: "chest", position: "bottom" },
    { id: 3, name: "Baltic Ave", type: "property", price: 60, color: "brown", position: "bottom" },
    { id: 4, name: "Income Tax", type: "tax", position: "bottom" },
    { id: 5, name: "Reading Railroad", type: "railroad", price: 200, position: "bottom" },
    { id: 6, name: "Oriental Ave", type: "property", price: 100, color: "lightblue", position: "bottom" },
    { id: 7, name: "Chance", type: "chance", position: "bottom" },
    { id: 8, name: "Vermont Ave", type: "property", price: 100, color: "lightblue", position: "bottom" },
    { id: 9, name: "Connecticut Ave", type: "property", price: 120, color: "lightblue", position: "bottom" },
    
    // Left side (bottom to top)
    { id: 10, name: "Jail", type: "corner", position: "bottom-left" },
    { id: 11, name: "St. Charles Place", type: "property", price: 140, color: "pink", position: "left" },
    { id: 12, name: "Electric Company", type: "utility", price: 150, position: "left" },
    { id: 13, name: "States Ave", type: "property", price: 140, color: "pink", position: "left" },
    { id: 14, name: "Virginia Ave", type: "property", price: 160, color: "pink", position: "left" },
    { id: 15, name: "Pennsylvania Railroad", type: "railroad", price: 200, position: "left" },
    { id: 16, name: "St. James Place", type: "property", price: 180, color: "orange", position: "left" },
    { id: 17, name: "Community Chest", type: "chest", position: "left" },
    { id: 18, name: "Tennessee Ave", type: "property", price: 180, color: "orange", position: "left" },
    { id: 19, name: "New York Ave", type: "property", price: 200, color: "orange", position: "left" },
    
    // Top row (left to right)
    { id: 20, name: "Free Parking", type: "corner", position: "top-left" },
    { id: 21, name: "Kentucky Ave", type: "property", price: 220, color: "red", position: "top" },
    { id: 22, name: "Chance", type: "chance", position: "top" },
    { id: 23, name: "Indiana Ave", type: "property", price: 220, color: "red", position: "top" },
    { id: 24, name: "Illinois Ave", type: "property", price: 240, color: "red", position: "top" },
    { id: 25, name: "B&O Railroad", type: "railroad", price: 200, position: "top" },
    { id: 26, name: "Atlantic Ave", type: "property", price: 260, color: "yellow", position: "top" },
    { id: 27, name: "Ventnor Ave", type: "property", price: 260, color: "yellow", position: "top" },
    { id: 28, name: "Water Works", type: "utility", price: 150, position: "top" },
    { id: 29, name: "Marvin Gardens", type: "property", price: 280, color: "yellow", position: "top" },
    
    // Right side (top to bottom)
    { id: 30, name: "Go To Jail", type: "corner", position: "top-right" },
    { id: 31, name: "Pacific Ave", type: "property", price: 300, color: "green", position: "right" },
    { id: 32, name: "North Carolina Ave", type: "property", price: 300, color: "green", position: "right" },
    { id: 33, name: "Community Chest", type: "chest", position: "right" },
    { id: 34, name: "Pennsylvania Ave", type: "property", price: 320, color: "green", position: "right" },
    { id: 35, name: "Short Line Railroad", type: "railroad", price: 200, position: "right" },
    { id: 36, name: "Chance", type: "chance", position: "right" },
    { id: 37, name: "Park Place", type: "property", price: 350, color: "darkblue", position: "right" },
    { id: 38, name: "Luxury Tax", type: "tax", position: "right" },
    { id: 39, name: "Boardwalk", type: "property", price: 400, color: "darkblue", position: "right" }
  ];

  // Group spaces by position for rendering
  const getSpacesByPosition = (position) => {
    return boardSpaces.filter(space => space.position === position);
  };

  // Check if property is owned
  const getPropertyOwner = (spaceId) => {
    if (!gameState.properties) return null;
    const property = gameState.properties.find(p => p.id === spaceId);
    return property ? property.owner : null;
  };

  return (
    <div className="monopoly-board">
      {/* Top row */}
      <div className="board-row top-row">
        {getSpacesByPosition('top-left').map(space => (
          <div key={space.id} className={`board-space corner ${space.type}`}>
            <div className="space-content">
              <div className="space-name">{space.name}</div>
              <div className="players-here">
                {Object.entries(playerPositions).map(([playerId, position]) => 
                  position === space.id ? (
                    <div key={playerId} className={`player-token player-${playerId}`}>
                      {playerId === 'player-1' ? '🔴' : '🔵'}
                    </div>
                  ) : null
                )}
              </div>
            </div>
          </div>
        ))}
        
        {getSpacesByPosition('top').map(space => (
          <div 
            key={space.id} 
            className={`board-space ${space.type}`}
            onClick={() => space.type === 'property' && onPropertyClick(space)}
          >
            <div className="space-content">
              {space.color && <div className={`color-bar ${space.color}`}></div>}
              <div className="space-name">{space.name}</div>
              {space.price && <div className="space-price">${space.price}</div>}
              {getPropertyOwner(space.id) && (
                <div className="owner-indicator">Owned</div>
              )}
              <div className="players-here">
                {Object.entries(playerPositions).map(([playerId, position]) => 
                  position === space.id ? (
                    <div key={playerId} className={`player-token player-${playerId}`}>
                      {playerId === 'player-1' ? '🔴' : '🔵'}
                    </div>
                  ) : null
                )}
              </div>
            </div>
          </div>
        ))}
        
        {getSpacesByPosition('top-right').map(space => (
          <div key={space.id} className={`board-space corner ${space.type}`}>
            <div className="space-content">
              <div className="space-name">{space.name}</div>
              <div className="players-here">
                {Object.entries(playerPositions).map(([playerId, position]) => 
                  position === space.id ? (
                    <div key={playerId} className={`player-token player-${playerId}`}>
                      {playerId === 'player-1' ? '🔴' : '🔵'}
                    </div>
                  ) : null
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Middle section with left, center, and right */}
      <div className="board-middle">
        {/* Left column */}
        <div className="board-column left-column">
          {getSpacesByPosition('left').reverse().map(space => (
            <div 
              key={space.id} 
              className={`board-space ${space.type}`}
              onClick={() => space.type === 'property' && onPropertyClick(space)}
            >
              <div className="space-content">
                {space.color && <div className={`color-bar ${space.color}`}></div>}
                <div className="space-name">{space.name}</div>
                {space.price && <div className="space-price">${space.price}</div>}
                {getPropertyOwner(space.id) && (
                  <div className="owner-indicator">Owned</div>
                )}
                <div className="players-here">
                  {Object.entries(playerPositions).map(([playerId, position]) => 
                    position === space.id ? (
                      <div key={playerId} className={`player-token player-${playerId}`}>
                        {playerId === 'player-1' ? '🔴' : '🔵'}
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Center area */}
        <div className="board-center">
          <div className="monopoly-logo">
            <h2>MONOPOLY</h2>
            <div className="logo-subtitle">Classic Edition</div>
          </div>
        </div>

        {/* Right column */}
        <div className="board-column right-column">
          {getSpacesByPosition('right').map(space => (
            <div 
              key={space.id} 
              className={`board-space ${space.type}`}
              onClick={() => space.type === 'property' && onPropertyClick(space)}
            >
              <div className="space-content">
                {space.color && <div className={`color-bar ${space.color}`}></div>}
                <div className="space-name">{space.name}</div>
                {space.price && <div className="space-price">${space.price}</div>}
                {getPropertyOwner(space.id) && (
                  <div className="owner-indicator">Owned</div>
                )}
                <div className="players-here">
                  {Object.entries(playerPositions).map(([playerId, position]) => 
                    position === space.id ? (
                      <div key={playerId} className={`player-token player-${playerId}`}>
                        {playerId === 'player-1' ? '🔴' : '🔵'}
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom row */}
      <div className="board-row bottom-row">
        {getSpacesByPosition('bottom-left').map(space => (
          <div key={space.id} className={`board-space corner ${space.type}`}>
            <div className="space-content">
              <div className="space-name">{space.name}</div>
              <div className="players-here">
                {Object.entries(playerPositions).map(([playerId, position]) => 
                  position === space.id ? (
                    <div key={playerId} className={`player-token player-${playerId}`}>
                      {playerId === 'player-1' ? '🔴' : '🔵'}
                    </div>
                  ) : null
                )}
              </div>
            </div>
          </div>
        ))}
        
        {getSpacesByPosition('bottom').reverse().map(space => (
          <div 
            key={space.id} 
            className={`board-space ${space.type}`}
            onClick={() => space.type === 'property' && onPropertyClick(space)}
          >
            <div className="space-content">
              {space.color && <div className={`color-bar ${space.color}`}></div>}
              <div className="space-name">{space.name}</div>
              {space.price && <div className="space-price">${space.price}</div>}
              {getPropertyOwner(space.id) && (
                <div className="owner-indicator">Owned</div>
              )}
              <div className="players-here">
                {Object.entries(playerPositions).map(([playerId, position]) => 
                  position === space.id ? (
                    <div key={playerId} className={`player-token player-${playerId}`}>
                      {playerId === 'player-1' ? '🔴' : '🔵'}
                    </div>
                  ) : null
                )}
              </div>
            </div>
          </div>
        ))}
        
        {getSpacesByPosition('bottom-right').map(space => (
          <div key={space.id} className={`board-space corner ${space.type}`}>
            <div className="space-content">
              <div className="space-name">{space.name}</div>
              <div className="players-here">
                {Object.entries(playerPositions).map(([playerId, position]) => 
                  position === space.id ? (
                    <div key={playerId} className={`player-token player-${playerId}`}>
                      {playerId === 'player-1' ? '🔴' : '🔵'}
                    </div>
                  ) : null
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Board;