import { useState } from "react";
import { buyProperty } from "../../services/api";

export default function BuyProperty({ gameId, player, tile, onClose, onPurchase }) {
  const [loading, setLoading] = useState(false);
  const canAfford = player.money >= tile.price;

  const handleBuy = async () => {
    if (!canAfford) return alert("You don't have enough money!");
    setLoading(true);
    try {
      const res = await buyProperty(gameId, player.id, tile.position);
      onPurchase(res.data);
      onClose();
    } catch (err) {
      console.error("Failed to buy property:", err);
      alert(err.response?.data?.error || "Purchase failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-gradient-to-br from-yellow-50 to-amber-100 border border-amber-400 rounded-2xl p-6 w-96 shadow-2xl text-center">
        <h2 className="text-2xl font-bold text-amber-800 mb-3">
          🏠 {tile.name}
        </h2>
        <p className="text-gray-700 mb-2">Type: {tile.type}</p>
        <p className="text-lg font-semibold text-amber-700">
          Price: ${tile.price}
        </p>
        {tile.rent && (
          <p className="text-sm text-gray-600">Rent: ${tile.rent}</p>
        )}
        <hr className="my-3 border-amber-400" />

        {tile.owner_id ? (
          <p className="text-red-600 font-semibold">
            Owned by another player!
          </p>
        ) : (
          <div className="space-y-3">
            <p>
              {canAfford
                ? "Would you like to purchase this property?"
                : "You don’t have enough money to buy this property."}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleBuy}
                disabled={loading || !canAfford}
                className={`px-4 py-2 rounded-lg text-white transition ${
                  canAfford
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {loading ? "Buying..." : "Buy"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
