
import { useState } from 'react';
import WelcomePage from './components/WelcomePage';
import GameBoard from './components/GameBoard'; 


function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [instructionsViewed, setInstructionsViewed] = useState(false);

  const handleStart = () => setGameStarted(true);
  const handleResume = () => setGameStarted(true);

  return (
    <>
      {!gameStarted ? (
        <WelcomePage
          onStart={handleStart}
          onResume={handleResume}
          showResume={!!localStorage.getItem("players")} 
          instructionsViewed={instructionsViewed}
          setInstructionsViewed={setInstructionsViewed}
        />

      ) : (
        <GameBoard />
      )}
    </>
  );
}

export default App;