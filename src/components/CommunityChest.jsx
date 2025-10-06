import { useState, useEffect } from "react";
import { drawCommunityChest } from "../../services/api";

export default function CommunityChest({ gameId, player, onClose, onResolve }) {
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCard() {
      try {
        const res = await drawCommunityChest(gameId, player.id);
        setCard(res.data.card);
      } catch (err) {
        console.error("Failed to draw Community Chest card:", err);
        setCard({ text: "Error drawing card." });
      } finally {
        setLoading(false);
      }
    }
    fetchCard();
  }, [gameId, player.id]);

  const handleConfirm = async () => {
    try {
      await onResolve(card); // Apply card logic (update balance, move player, etc.)
      onClose();
    } catch (err) {
      console.error("Error resolving Community Chest card:", err);
      alert("Something went wrong applying card effect.");
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 text-white text-lg">
        Drawing a Community Chest card...
      </div>
    );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-gradient-to-br from-teal-50 to-cyan-100 border border-teal-400 rounded-2xl p-6 w-96 shadow-2xl text-center animate-fade-in">
        <h2 className="text-2xl font-bold text-teal-800 mb-3">💳 Community Chest</h2>

        <p className="text-lg font-medium text-gray-800 mb-4 italic">
          “{card.text}”
        </p>

        {card.amount && (
          <p
            className={`text-lg font-semibold ${
              card.amount > 0 ? "text-green-700" : "text-red-600"
            }`}
          >
            {card.amount > 0
              ? `You receive $${card.amount}`
              : `You pay $${Math.abs(card.amount)}`}
          </p>
        )}

        {card.move && (
          <p className="text-gray-700 mt-2">
            🚶 Move to position {card.move}
          </p>
        )}

        {card.goToJail && (
          <p className="text-red-700 mt-2 font-semibold">
            🚔 Go directly to Jail!
          </p>
        )}

        <div className="mt-6">
          <button
            onClick={handleConfirm}
            className="px-6 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
