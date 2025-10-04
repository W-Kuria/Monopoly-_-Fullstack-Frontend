import axios from "axios";

// Base URLs
const API_URL_AUTH = "http://127.0.0.1:5500/auth"; // for auth routes
const API_URL_GAME = "http://127.0.0.1:5500/game"; // for game routes

// Ensure JSON headers
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.withCredentials = true; 

// 🔑 Login
export async function loginUser(credentials) {
  return await axios.post(`${API_URL_AUTH}/login`, credentials);
}

// 📝 Register
export async function registerUser(userData) {
  // expects { name, email, password }
  return await axios.post(`${API_URL_AUTH}/register`, userData);
}
//Logout
export async function logoutUser() {
  return await axios.post("http://127.0.0.1:5500/auth/logout");
}

// 🎲 Roll dice (expects { player_id })
export async function rollDice(playerId) {
  return await axios.post(`${API_URL_GAME}/roll`, { player_id: playerId });
}

// 🎮 Fetch game by ID
export async function getGameById(gameId) {
  return await axios.get(`${API_URL_GAME}/${gameId}`);
}

// ➕ Create a new game
export async function createGame(data) {
  // expects { num_players, players: ["Alice", "Bob", ...], userId }
  return await axios.post(`${API_URL_GAME}/create`, data);
}

// 📜 Fetch games for a specific user
export async function fetchUserGames(userId) {
  return await axios.get(`${API_URL_GAME}/user/${userId}`);
}
