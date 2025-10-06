import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import { buyProperty } from "../services/api";

export default function buyProperty({ playerId, onClose, onPurchase }) {
  const [property, setProperty] = useState(null);
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!playerId) return;

    const fetchData = async () => {
      setLoading(true);

      const { data: playerData, error: playerError } = await supabase
        .from("players")
        .select("*")
        .eq("id", playerId)
        .single();

      if (playerError) {
        console.error("Failed to fetch player:", playerError);
        setLoading(false);
        return;
      }
      setPlayer(playerData);

      const position = playerData.position;

      const { data: propertyData, error: propertyError } = await supabase
        .from("properties")
        .select("*")
        .eq("id", position)
        .single();

      if (propertyError) {
        console.error("Failed to fetch property:", propertyError);
        setLoading(false);
        return;
      }
      setProperty(propertyData);
      setLoading(false);
    };

    fetchData();
  }, [playerId]);

  const canAfford = player && property && player.money >= property.price;

  const handleBuy = async () => {
  if (!property || !player) return;
  if (!canAfford) return alert("You don't have enough money!");

  const confirmBuy = window.confirm(
    `Do you want to buy this property for $${property.price}?`
  );
  if (!confirmBuy) return;

  setLoading(true);

  try {
    const response = await buyProperty(gameId, player.id, property.position);

    alert(response.data.message);

    if (onPurchase) onPurchase();
    setPlayer((prev) => ({ ...prev, money: response.data.player_money }));
    setProperty((prev) => ({ ...prev, owner_id: player.id }));
  } catch (error) {
    console.error("Purchase failed:", error);
    alert(error.response?.data?.error || "Purchase failed.");
  } finally {
    setLoading(false);
    if (onClose) onClose();
  }
};


  if (!property || !player) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-gradient-to-br from-yellow-50 to-amber-100 border border-amber-400 rounded-2xl p-6 w-96 shadow-2xl text-center">
        <h2 className="text-2xl font-bold text-amber-800 mb-3">🏠 {property.name}</h2>
        <p className="text-gray-700 mb-2">Price: ${property.price}</p>
        {property.rent && <p className="text-sm text-gray-600">Rent: ${property.rent}</p>}
        <p className="mb-4">
          {property.owner_id
            ? property.owner_id === player.id
              ? "You own this property."
              : `Owned by Player ${property.owner_id}`
            : "Unowned"}
        </p>
        <hr className="my-3 border-amber-400" />

        {property.owner_id && property.owner_id !== player.id ? (
          <p className="text-red-600 font-semibold">Owned by another player!</p>
        ) : (
          <div className="space-y-3">
            <p>
              {canAfford
                ? "Would you like to purchase this property?"
                : "You don't have enough money to buy this property."}
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
                  canAfford ? "bg-amber-600 hover:bg-amber-700" : "bg-gray-400 cursor-not-allowed"
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
