import React from "react";
import { useNavigate } from "react-router-dom";
import "../components/MonopolyBoard.css";

import Game from "./dice";

function GameBoard() {
    const [currentPlayerId, setCurrentPlayerId] = useState(1); 
    const switchTurn = () => {
    setCurrentPlayerId((prev) => (prev === 1 ? 2 : 1));
  };

  return (
    <div className="game-container">
      <p>Current Turn: Player {currentPlayerId}</p>
      <Game playerId={currentPlayerId} turn={switchTurn}/>
    </div>
  );   
}