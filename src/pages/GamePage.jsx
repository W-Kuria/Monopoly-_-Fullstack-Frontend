import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { getGameById, rollDice } from "../services/api";

export default function GamePage() {
  const { gameId } = useParams(); // from /game/:id
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadGame = async () => {
    try {
      const res = await getGameById(gameId);
      setGame(res.data);
    } catch (err) {
      console.error("Failed to load game:", err);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("user"); 
    navigate("/login");
  };

  const handleRoll = async (playerId) => {
  setLoading(true);
  try {
    await rollDice(playerId);     
    const res = await getGameById(gameId);  
    setGame(res.data);
  } catch (err) {
    console.error("Roll failed:", err);
    alert("Could not roll dice.");
  } finally {
    setLoading(false);
  }
};

 
  if (!game) return <p>Loading game...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6">🎲 Monopoly Game #{game.id}</h2>
      <header>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </header>
      <div className="bg-white p-6 rounded-2xl shadow-md max-w-2xl mx-auto">
        <p className="mb-4">
          Current Player:{" "}
          <span className="font-semibold text-purple-600">
            {game.current_player?.name || "Waiting..."}
          </span>
        </p>
        <p className="mb-4">
          Dice: {game.dice ? game.dice.join(", ") : "Not rolled yet"}
        </p>

        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">Players</h3>
          {game.players.map((p) => (
            <div
              key={p.id}
              className="flex justify-between items-center px-4 py-2 border-b text-gray-700"
            >
              <span>{p.name}</span>
              <span>
                Position: {p.position} | 💵 {p.money}
              </span>
              <button
                onClick={() => handleRoll(p.id)}
                disabled={loading}
                className={`ml-4 px-3 py-1 rounded text-white ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Roll
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
