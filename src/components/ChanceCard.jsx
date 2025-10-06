import { useState, useEffect } from "react";
import { drawChanceCard } from "../../services/api";

export default function ChanceCard({ gameId, player, onClose, onResolve }) {
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCard() {
      try {
        const res = await drawChanceCard(gameId, player.id);
        setCard(res.data.card);
      } catch (err) {
        console.error("Failed to draw Chance card:", err);
        setCard({ text: "Error drawing card." });
      } finally {
        setLoading(false);
      }
    }
    fetchCard();
  }, [gameId, player.id]);

  const handleConfirm = async () => {
    try {
      await onResolve(card); // Apply logic (update money, position, etc.)
      onClose();
    } catch (err) {
      console.error("Error resolving Chance card:", err);
      alert("Something went wrong applying card effect.");
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 text-white text-lg">
        Drawing a card...
      </div>
    );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-gradient-to-br from-orange-50 to-yellow-100 border border-orange-400 rounded-2xl p-6 w-96 shadow-2xl text-center animate-fade-in">
        <h2 className="text-2xl font-bold text-orange-800 mb-3">🎴 Chance</h2>

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
              ? `You gain $${card.amount}`
              : `You lose $${Math.abs(card.amount)}`}
          </p>
        )}

        {card.move && (
          <p className="text-gray-700 mt-2">
            🚶 Move to position {card.move}
          </p>
        )}

        {card.goToJail && (
          <p className="text-red-700 mt-2 font-semibold">
            🚨 Go directly to Jail!
          </p>
        )}

        <div className="mt-6">
          <button
            onClick={handleConfirm}
            className="px-6 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
