import { useState } from 'react'
import GamePage from './components/GamePage'
import GameLobby from './components/GameLobby'
import './App.css'

function App() {
  const [currentGameId, setCurrentGameId] = useState(null)
  const [playerId, setPlayerId] = useState(null)

  // Handle when player joins a game
  const handleJoinGame = (gameId, playerIdFromServer) => {
    setCurrentGameId(gameId)
    setPlayerId(playerIdFromServer)
  }

  // Handle leaving game (back to lobby)
  const handleLeaveGame = () => {
    setCurrentGameId(null)
    setPlayerId(null)
    localStorage.removeItem('currentGameId')
    localStorage.removeItem('playerId')
    localStorage.removeItem('playerName')
  }

  return (
    <div className="App">
      {currentGameId ? (
        <GamePage 
          gameId={currentGameId} 
          playerId={playerId}
          onLeaveGame={handleLeaveGame}
        />
      ) : (
        <GameLobby onJoinGame={handleJoinGame} />
      )}
    </div>
  )
}

export default App
