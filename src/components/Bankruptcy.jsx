export default function Bankruptcy({ player, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-gradient-to-br from-red-100 via-white to-red-200 border border-red-400 rounded-2xl p-6 w-96 shadow-2xl text-center">
        <h2 className="text-2xl font-bold text-red-700 mb-3">💀 Bankruptcy!</h2>
        <p className="text-gray-800 mb-4">
          {player.name} is bankrupt and has been removed from the game.
        </p>
        <button
          onClick={onClose}
          className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
