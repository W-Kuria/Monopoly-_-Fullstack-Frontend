import { useState } from "react";
import { handleJailAction } from "../../services/api";

export default function Jail({ player, gameId, onUpdate, onClose }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAction = async (action) => {
    setLoading(true);
    setMessage("");
    try {
      const res = await handleJailAction(gameId, player.id, action);
      setMessage(res.data.message);
      onUpdate && onUpdate(res.data);
    } catch (err) {
      console.error("Jail action failed:", err);
      setMessage(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 border border-gray-300 rounded-2xl p-6 w-96 shadow-2xl text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🚔 {player.name} is in Jail!
        </h2>

        <p className="text-gray-700 mb-4">
          You can either pay <span className="font-semibold">$50</span>,
          skip this turn, or use a Get Out of Jail card.
        </p>

        {message && (
          <p
            className={`mb-3 text-sm ${
              message.toLowerCase().includes("error")
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleAction("pay")}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold"
          >
            {loading ? "Processing..." : "Pay $50"}
          </button>

          <button
            onClick={() => handleAction("skip")}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold"
          >
            Skip Turn
          </button>

          <button
            onClick={() => handleAction("card")}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            Use Get Out of Jail Card
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-5 text-gray-600 text-sm hover:underline"
        >
          Close
        </button>
      </div>
    </div>
  );
}
