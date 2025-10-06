import React, { useState } from "react";
import GameStatus from "./components/GameStatus"
import GamePage from "./components/GamePage";
import GameLobby from "./components/GameLobby";
import Game from "./dice";

function App() {

  const [currentPlayerId, setCurrentPlayerId] = useState(1);

  const switchTurn = () => {
    setCurrentPlayerId((prev) => (prev === 1 ? 2 : 1));
  };

  return (
    <div>
      <GamePage/>
      <GameStatus/>

      <p>Current Turn: Player {currentPlayerId}</p>
      <Game playerId={currentPlayerId} turn={switchTurn}/>
    </div>
  );
}

export default App;
