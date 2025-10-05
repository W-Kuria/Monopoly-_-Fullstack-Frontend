import React, { useState } from "react";
import Game from "./dice";

function App() {

  const [currentPlayerId, setCurrentPlayerId] = useState(1);

  const switchTurn = () => {
    setCurrentPlayerId((prev) => (prev === 1 ? 2 : 1));
  };

  return (
    <div>
      <p>Current Turn: Player {currentPlayerId}</p>
      <Game playerId={currentPlayerId} turn={switchTurn}/>
    </div>
  );
}

export default App;
