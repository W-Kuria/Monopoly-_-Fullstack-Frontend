import { useState } from "react";
import { handleRentPayment } from "../../services/api";

export default function RentLogic({ player, owner, property, gameId, onUpdate, onClose }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePayRent = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await handleRentPayment(gameId, player.id, property.id);
      setMessage(res.data.message);
      onUpdate && onUpdate(res.data);
    } catch (err) {
      console.error("Rent payment failed:", err);
      setMessage(err.response?.data?.error || "Rent payment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-gradient-to-br from-yellow-50 via-white to-yellow-100 border border-yellow-400 rounded-2xl p-6 w-96 shadow-2xl text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🏠 {property.name}
        </h2>

        <p className="text-gray-700 mb-4">
          This property is owned by{" "}
          <span className="font-semibold text-indigo-700">{owner.name}</span>.
          You owe them <span className="font-bold">${property.rent}</span> rent.
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

        <button
          onClick={handlePayRent}
          disabled={loading}
          className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
        >
          {loading ? "Paying..." : `Pay $${property.rent}`}
        </button>

        <button
          onClick={onClose}
          className="mt-4 text-gray-600 text-sm hover:underline"
        >
          Close
        </button>
      </div>
    </div>
  );
}
