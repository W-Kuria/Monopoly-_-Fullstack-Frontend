import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchUserGames, createGame } from "../services/api";

export default function WelcomePage() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [showGames, setShowGames] = useState(false);

  // Safer parse of user
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Normalize backend response (id vs game_id)
  const normalizeGame = (game) => ({
    ...game,
    id: game.id || game.game_id, // ensure consistent id
  });

  useEffect(() => {
    if (user) {
      fetchUserGames(user.id)
        .then((res) => {
          console.log("fetchUserGames response:", res.data);
          const gamesList = Array.isArray(res.data)
            ? res.data
            : res.data.games || [];
          setGames(gamesList.map(normalizeGame));
        })
        .catch((err) => console.error("Failed to load games:", err));
    }
  }, [user]);

  const handleStartGame = async () => {
    // Step 1: Ask how many players
    const numPlayers = parseInt(prompt("How many players? (2–4)", "2"), 10);
    if (isNaN(numPlayers) || numPlayers < 2 || numPlayers > 4) {
      alert("Player count must be between 2 and 4");
      return;
    }

    // Step 2: Ask for player names
    const playerNames = [];
    for (let i = 1; i <= numPlayers; i++) {
      let name = prompt(`Enter name for Player ${i}:`);
      if (!name || !name.trim()) {
        alert("Player names cannot be empty");
        return;
      }
      playerNames.push(name.trim());
    }

    try {
      // Step 3: Send to backend
      const res = await createGame({ 
        num_players: numPlayers, 
        players: playerNames, 
        userId: user?.id 
      });

      console.log("createGame response:", res.data);

      const newGame = normalizeGame(res.data);

      if (!newGame.id) {
        alert("Failed to create game: no ID returned");
        return;
      }

      alert(`Game created with ID: ${newGame.id}`);

      // Update games state so dropdown shows it immediately
      setGames((prev) => [...prev, newGame]);

      // Step 4: Redirect to the game
      navigate(`/game/${newGame.id}`);
    } catch (err) {
      console.error("Error creating game:", err);
      alert("Failed to create game");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome, {user?.name || "Player"}
        </h1>
        <p className="text-gray-600 mb-6">
          Continue a previous game or start a new one.
        </p>

        <div className="space-y-4">
          {/* Start Game */}
          <button
            onClick={handleStartGame}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Start New Game
          </button>

          {/* Previous Games */}
          <div className="relative">
            <button
              onClick={() => setShowGames(!showGames)}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Previous Games {showGames ? "▴" : "▾"}
            </button>
            {showGames && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {games.length > 0 ? (
                  games.map((g) => (
                    <button
                      key={g.id}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                      onClick={() => navigate(`/game/${g.id}`)}
                    >
                      Game #{g.id} – {g.status || "in progress"}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">
                    No saved games
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
