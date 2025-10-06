// src/pages/GamePage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createGame, rollDice, getGameById, getBoard } from "../services/api";

export default function GamePage({ userId: propUserId = null }) {
  const { gameId: routeGameId } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [board, setBoard] = useState([]);
  const [dice, setDice] = useState([]);
  const [currentPlayerId, setCurrentPlayerId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // initialize or load game
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError(null);
      try {
        if (routeGameId) {
          // load existing game
          const res = await getGameById(routeGameId);
          const gameData = res.data;
          setGame(gameData);
          setCurrentPlayerId(gameData.current_turn || gameData.players?.[0]?.id);

          const boardRes = await getBoard(routeGameId);
          setBoard(Array.isArray(boardRes.data) ? boardRes.data : []);
        } else {
          // create new game
          const storedUser = JSON.parse(localStorage.getItem("user") || "null");
          const uid = propUserId || storedUser?.id;
          if (!uid) throw new Error("No logged-in user found.");

          const playerNames = ["Alice", "Bob"];
          const res = await createGame({
            num_players: playerNames.length,
            players: playerNames,
            userId: uid,
          });

          const newGame = res.data;
          setGame(newGame);
          setCurrentPlayerId(newGame.players?.[0]?.id);

          const boardRes = await getBoard(newGame.id);
          setBoard(Array.isArray(boardRes.data) ? boardRes.data : []);

          navigate(`/game/${newGame.id}`, { replace: true });
        }
      } catch (err) {
        console.error("Init error:", err);
        setError(err?.response?.data?.error || err.message || "Failed to load game");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [routeGameId, propUserId, navigate]);

  const handleRoll = async () => {
    if (!game || !currentPlayerId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await rollDice(game.id, currentPlayerId);
      const data = res.data;
      setDice(data.dice || []);
      setGame((prev) => ({ ...prev, players: data.players || prev.players }));
      setCurrentPlayerId(data.next_player?.id || null);
    } catch (err) {
      console.error("Roll failed:", err);
      setError(err?.response?.data?.error || err.message || "Roll failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !game) return <div className="p-6 text-gray-700">Loading game...</div>;
  if (error && !game) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!game) return <div className="p-6 text-gray-700">No game loaded</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-2 text-indigo-700">
        Game ID: {game.id}
      </h2>
      <h3 className="mb-4 text-lg font-medium text-gray-800">
        Current Player:{" "}
        {game.players?.find((p) => p.id === currentPlayerId)?.name || "—"}
      </h3>

      <div className="mb-6 flex items-center space-x-4">
        <button
          onClick={handleRoll}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition"
        >
          {loading ? "Rolling..." : "Roll Dice"}
        </button>
        <span className="text-lg font-medium text-gray-700">
          🎲 Dice: {dice.length ? dice.join(" & ") : "—"}
        </span>
      </div>

      <div className="mb-10">
        <h4 className="font-semibold text-lg text-gray-800 mb-2">Board</h4>
        {board.length ? (
          <div className="grid grid-cols-4 md:grid-cols-6 gap-3 mt-2">
            {board.map((tile) => (
              <div
                key={tile.id}
                className="p-3 border rounded-lg shadow-sm bg-white hover:shadow-md transition"
              >
                <div className="font-medium text-indigo-700">{tile.name}</div>
                <div className="text-sm text-gray-600">Pos: {tile.position}</div>
                <div className="text-sm text-gray-600">Type: {tile.type}</div>
                <div className="text-sm text-gray-600">
                  Price:{" "}
                  {tile.price !== null && tile.price !== undefined
                    ? `$${tile.price}`
                    : "—"}
                </div>
                <div className="text-sm text-gray-600">
                  Owner: {tile.owner_id ?? "None"}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-600 italic">
            Board not available
          </div>
        )}
      </div>

      <div>
        <h4 className="font-semibold text-lg text-gray-800 mb-2">Players</h4>
        <ul className="space-y-1">
          {game.players?.map((p) => (
            <li key={p.id} className="text-gray-700">
              <strong className="text-indigo-700">{p.name}</strong> — Position:{" "}
              {p.position} — Money: ${p.money}{" "}
              {p.in_jail ? "(In Jail)" : ""}
            </li>
          ))}
        </ul>
      </div>

      {error && (
        <div className="mt-4 text-red-600 font-medium">Error: {error}</div>
      )}
    </div>
  );
}
