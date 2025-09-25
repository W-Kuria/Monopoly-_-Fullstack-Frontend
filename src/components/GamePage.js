import React from 'react';

const GamePage = () => {
  return (
    <div>
      <h2>Monopoly Game</h2>
      <div id="game-board">
        <p>Game board will be rendered here</p>
      </div>
      <div id="player-info">
        <p>Player information will be displayed here</p>
      </div>
      <div id="game-controls">
        <button>Roll Dice</button>
        <button>End Turn</button>
      </div>
    </div>
  );
};

export default GamePage;