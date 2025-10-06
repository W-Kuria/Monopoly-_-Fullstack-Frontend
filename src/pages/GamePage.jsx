import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getGameById,
  rollDice,
  buyProperty,
  drawChance,
  drawCommunity,
  handleJail,
} from "../services/api";
import bgImage from "../assets/pexels-suzyhazelwood-1329644.jpg";

export default function GamePage() {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState([]);
  const logRef = useRef(null);
  const navigate = useNavigate();

  const PLAYER_COLORS = ["#6A5ACD", "#0096C7", "#06D6A0", "#FFB703"];

  const normalizeGame = (data) => {
    if (!data) return null;
    const id = data.id ?? data.game_id ?? data.game?.id ?? null;
    const players = data.players ?? data.game?.players ?? [];
    const dice = data.dice ?? data.game?.dice ?? null;
    const current_player =
      data.current_player ??
      data.next_player ??
      data.game?.current_player ??
      players[0] ??
      null;

    const normalizedPlayers = players.map((p, i) => ({
      id: p.id,
      name: p.name,
      position: p.position ?? 0,
      money: p.money ?? 0,
      laps: p.laps ?? 0,
      color: PLAYER_COLORS[i % PLAYER_COLORS.length],
    }));

    return { id, players: normalizedPlayers, dice, current_player };
  };

  useEffect(() => {
    loadGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  const loadGame = async () => {
    try {
      const res = await getGameById(gameId);
      setGame(normalizeGame(res.data));
    } catch (err) {
      console.error("Failed to load game:", err);
      alert("Could not load game.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const addToLog = (message) => {
    setLog((prev) => [...prev, message]);
  };

  const handleRoll = async (playerId) => {
    const activeId = game?.current_player?.id ?? game?.players?.[0]?.id;
    const player = game.players.find((p) => p.id === playerId);
    if (!activeId) return alert("No active player available.");
    if (playerId !== activeId) return alert("It's not your turn.");

    setLoading(true);
    try {
      // Roll dice via backend
      const res = await rollDice(gameId, playerId);
      const newGame = normalizeGame(res.data.game || res.data);
      const diceValues = res.data.dice ?? [];
      const total = diceValues.reduce((a, b) => a + b, 0);

      addToLog(`🎲 ${player.name} rolled ${diceValues.join(" + ")} = ${total}`);

      // Get updated position and tile info
      const newPos = newGame.players.find((p) => p.id === playerId)?.position ?? 0;
      const landedTile = BOARD_TILES[newPos]?.name ?? `Tile #${newPos}`;
      addToLog(`📍 ${player.name} landed on ${landedTile}`);

      //  Handle special tiles
      if (landedTile.includes("Chance")) {
        const resChance = await drawChance(gameId, playerId);
        addToLog(` Chance: ${resChance.data.message || "You drew a card!"}`);
        setGame(normalizeGame(resChance.data.game || newGame));
      } 
      else if (landedTile.includes("Community")) {
        const resComm = await drawCommunity(gameId, playerId);
        addToLog(` Community Chest: ${resComm.data.message || "You drew a card!"}`);
        setGame(normalizeGame(resComm.data.game || newGame));
      } 
      else if (landedTile === "Go To Jail") {
        const resJail = await handleJail(gameId, playerId, "go_to_jail");
        addToLog(` ${player.name} was sent directly to Jail!`);
        setGame(normalizeGame(resJail.data.game || newGame));
      } 
      else if (landedTile === "Jail") {
        addToLog(` ${player.name} is just visiting Jail.`);
      } 
      else if (BOARD_TILES[newPos]?.price) {
        //  Property tile — prompt to buy
        const buy = window.confirm(
          `${player.name} landed on ${landedTile}.\nWould you like to buy it for $${BOARD_TILES[newPos].price}?`
        );
        if (buy) {
          const resBuy = await buyProperty(gameId, playerId, newPos);
          addToLog(` ${player.name} bought ${landedTile} for $${BOARD_TILES[newPos].price}!`);
          setGame(normalizeGame(resBuy.data.game || newGame));
        } else {
          addToLog(` ${player.name} skipped buying ${landedTile}.`);
        }
      }

      // Update game state even if no special tile
      setGame(newGame);
    } catch (err) {
      console.error("Roll failed:", err);
      alert("Could not roll dice.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  if (!game) return <p className="text-center mt-10">Loading game...</p>;
  const activePlayerId = game.current_player?.id ?? game.players[0]?.id;

  const playerPositions = Object.fromEntries(game.players.map((p) => [p.id, p.position]));

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center p-6"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundColor: "rgba(20,20,20,0.7)",
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-7xl mb-4 text-white drop-shadow-lg">
        <h2 className="text-3xl font-bold">🎲 Monopoly Game #{game.id}</h2>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow hover:opacity-90"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-6 w-full max-w-7xl">
        {/* Player Panel */}
        <div className="w-1/4 bg-gray-900/70 text-white rounded-2xl shadow-lg p-4 border border-gray-700">
          <h3 className="text-lg font-bold mb-3 text-purple-300">Players</h3>
          <div className="space-y-2">
            {game.players.map((p) => {
              const isCurrent = p.id === activePlayerId;
              return (
                <div
                  key={p.id}
                  className={`p-2 rounded-md flex justify-between items-center ${
                    isCurrent
                      ? "bg-purple-600/40 border-l-4 border-purple-400"
                      : "bg-gray-800/70"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: p.color }}
                    ></span>
                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-xs text-gray-300">
                        💰 ${p.money} | 📍 {p.position}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRoll(p.id)}
                    disabled={loading || !isCurrent}
                    className={`px-3 py-1 text-xs rounded ${
                      loading || !isCurrent
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-indigo-500 hover:bg-indigo-600"
                    }`}
                  >
                    {loading && isCurrent ? "Rolling..." : "Roll"}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-4 text-sm text-gray-300">
            🎯 Dice:{" "}
            {game.dice ? (
              <span className="font-semibold text-white">
                {game.dice.join(" + ")} = {game.dice.reduce((a, b) => a + b, 0)}
              </span>
            ) : (
              "Not rolled yet"
            )}
          </div>
        </div>

        {/* Board + Feed */}
        <div className="flex-1 relative bg-gray-100/70 rounded-2xl border-4 border-gray-400 shadow-xl aspect-square overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-6xl font-bold text-gray-700 opacity-10 select-none">
            MONOPOLY
          </div>

          {BOARD_TILES.map((tile, i) => {
            const occupants = Object.entries(playerPositions).filter(
              ([, pos]) => pos === i
            );
            const pos = getTilePosition(i);

            return (
              <div
                key={i}
                className="absolute flex flex-col items-center justify-center text-[10px] text-center border border-gray-400 bg-white/90 hover:bg-purple-100 transition rounded-sm shadow-sm"
                style={pos}
              >
                {tile.color && (
                  <div
                    className="w-full h-2 rounded-t"
                    style={{ backgroundColor: tile.color }}
                  ></div>
                )}
                <div className="px-1 font-semibold text-gray-800">{tile.name}</div>
                {tile.price && (
                  <div className="text-[9px] text-gray-500">${tile.price}</div>
                )}
                <div className="flex space-x-1 mt-1">
                  {occupants.map(([pid]) => {
                    const player = game.players.find((p) => p.id == pid);
                    return (
                      <div
                        key={pid}
                        className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white font-bold shadow"
                        style={{ backgroundColor: player?.color }}
                        title={player?.name}
                      >
                        {getInitials(player?.name)}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Game Log */}
          <div
            ref={logRef}
            className="absolute inset-1/4 bg-gray-900/80 text-gray-200 rounded-xl shadow-inner flex flex-col p-2 overflow-y-auto text-xs border border-gray-600"
          >
            <div className="font-bold text-center text-purple-400 mb-1">📜 Game Feed</div>
            {log.length === 0 ? (
              <p className="text-center text-gray-500 italic">No moves yet...</p>
            ) : (
              log.map((msg, i) => (
                <div key={i} className="animate-fadeIn mb-1">
                  {msg}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Helpers ---------- */
function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getTilePosition(i) {
  const size = "10%";
  if (i <= 10)
    return { bottom: 0, right: `${i * 9}%`, width: size, height: "10%" };
  if (i <= 20)
    return { left: 0, bottom: `${(i - 10) * 9}%`, width: "10%", height: size };
  if (i <= 30)
    return { top: 0, left: `${(i - 20) * 9}%`, width: size, height: "10%" };
  return { right: 0, top: `${(i - 30) * 9}%`, width: "10%", height: size };
}

const BOARD_TILES = [
  { name: "GO" },
  { name: "Mediterranean Ave", price: 60, color: "#7E3F1B" },
  { name: "Community Chest" },
  { name: "Baltic Ave", price: 60, color: "#7E3F1B" },
  { name: "Income Tax" },
  { name: "Reading Railroad", price: 200, color: "#5A5A5A" },
  { name: "Oriental Ave", price: 100, color: "#6CB4EE" },
  { name: "Chance" },
  { name: "Vermont Ave", price: 100, color: "#6CB4EE" },
  { name: "Connecticut Ave", price: 120, color: "#6CB4EE" },
  { name: "Jail" },
  { name: "St. Charles Place", price: 140, color: "#C084FC" },
  { name: "Electric Company", price: 150, color: "#EAB308" },
  { name: "States Ave", price: 140, color: "#C084FC" },
  { name: "Virginia Ave", price: 160, color: "#C084FC" },
  { name: "Pennsylvania Railroad", price: 200, color: "#5A5A5A" },
  { name: "St. James Place", price: 180, color: "#F59E0B" },
  { name: "Community Chest" },
  { name: "Tennessee Ave", price: 180, color: "#F59E0B" },
  { name: "New York Ave", price: 200, color: "#F59E0B" },
  { name: "Free Parking" },
  { name: "Kentucky Ave", price: 220, color: "#DC2626" },
  { name: "Chance" },
  { name: "Indiana Ave", price: 220, color: "#DC2626" },
  { name: "Illinois Ave", price: 240, color: "#DC2626" },
  { name: "B&O Railroad", price: 200, color: "#5A5A5A" },
  { name: "Atlantic Ave", price: 260, color: "#FACC15" },
  { name: "Ventnor Ave", price: 260, color: "#FACC15" },
  { name: "Water Works", price: 150, color: "#EAB308" },
  { name: "Marvin Gardens", price: 280, color: "#FACC15" },
  { name: "Go To Jail" },
  { name: "Pacific Ave", price: 300, color: "#16A34A" },
  { name: "North Carolina Ave", price: 300, color: "#16A34A" },
  { name: "Community Chest" },
  { name: "Pennsylvania Ave", price: 320, color: "#16A34A" },
  { name: "Short Line Railroad", price: 200, color: "#5A5A5A" },
  { name: "Chance" },
  { name: "Park Place", price: 350, color: "#1E3A8A" },
  { name: "Luxury Tax" },
  { name: "Boardwalk", price: 400, color: "#1E3A8A" },
];
