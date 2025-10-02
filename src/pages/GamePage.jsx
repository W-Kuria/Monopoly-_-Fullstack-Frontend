import { useEffect, useState } from "react";
import { rollDice, getGameState } from "../services/api";

export default function GamePage() {
  const [gameState, setGameState] = useState(null);
  const playerId = 1; // temporary hardcoded player until login system plugs in

  // ✅ Fetch initial game state
  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await getGameState(playerId);
        setGameState(res.data);
      } catch (err) {
        console.error("Error fetching game state:", err);
      }
    };
    fetchState();
  }, []);

  // ✅ Handle dice roll
  const handleRoll = async () => {
    try {
      const res = await rollDice(playerId);
      setGameState(res.data);
    } catch (err) {
      console.error("Error rolling dice:", err);
      alert("Failed to roll dice. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">🎲 Monopoly Game</h2>

      {gameState ? (
        <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-2xl">
          <p className="mb-4 text-lg">
            Current Player:{" "}
            <span className="font-semibold text-purple-600">
              {gameState.currentPlayer?.name || "Unknown"}
            </span>
          </p>
          <p className="mb-4">
            Dice Roll: {gameState.dice?.join(", ") || "Not rolled yet"}
          </p>
          <button
            onClick={handleRoll}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Roll Dice
          </button>
        </div>
      ) : (
        <p>Loading game...</p>
      )}
    </div>
  );
}
