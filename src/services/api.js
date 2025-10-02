import axios from "axios";

const API_URL = "http://127.0.0.1:5500/auth"; // Flask backend base URL

// 🔑 Login
export async function loginUser(credentials) {
  // expects { email, password }
  return await axios.post(`${API_URL}/login`, credentials);
}

// 📝 Register
export async function registerUser(userData) {
  // expects { name, email, password }
  return await axios.post(`${API_URL}/register`, userData);
}

// 🎲 Roll dice
export async function rollDice(playerId) {
  return await axios.post(`${API_URL}/roll`, { player_id: playerId });
}

// 🎮 Fetch game state
export async function getGameState(playerId) {
  return await axios.get(`${API_URL}/game/${playerId}`);
}
