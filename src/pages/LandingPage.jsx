import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md text-center">
        {/* Game Title */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Monopoly!
        </h1>
        <p className="text-gray-600 mb-6">
          Test your strategy, outsmart your friends, and dominate the board.
        </p>

        {/* Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => navigate("/login")}
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
