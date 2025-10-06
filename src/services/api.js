import axios from "axios";

// Base URLs
const API_URL = "http://127.0.0.1:5500";
const API_URL_AUTH = `${API_URL}/auth`;
const API_URL_GAME = `${API_URL}/game`;

// Ensure JSON headers and CORS support
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;

// =============================
// 🔑 AUTH ROUTES
// =============================

// Login user
export async function loginUser(credentials) {
  // expects { email, password }
  return await axios.post(`${API_URL_AUTH}/login`, credentials);
}

// Register new user
export async function registerUser(userData) {
  // expects { name, email, password }
  return await axios.post(`${API_URL_AUTH}/register`, userData);
}

// Logout user
export async function logoutUser() {
  return await axios.post(`${API_URL_AUTH}/logout`);
}

// =============================
// 🎮 GAME ROUTES
// =============================

// 🎲 Roll dice for a specific player in a specific game
export async function rollDice(gameId, playerId) {
  // matches backend: /game/<int:game_id>/roll
  return await axios.post(`${API_URL_GAME}/${gameId}/roll`, { player_id: playerId });
}

// Fetch full game by ID
export async function getGameById(gameId) {
  return await axios.get(`${API_URL_GAME}/${gameId}`);
}

// Create a new game
export async function createGame(data) {
  // expects { num_players, players: ["Alice", "Bob", ...], userId }
  return await axios.post(`${API_URL_GAME}/create`, data);
}

// Fetch all games for a specific user
export async function fetchUserGames(userId) {
  return await axios.get(`${API_URL_GAME}/user/${userId}`);
}

// Fetch the game board for a specific game
export async function getBoard(gameId) {
  return await axios.get(`${API_URL_GAME}/game/${gameId}/board`);
}

// 🏠 Buy property
export async function buyProperty(gameId, playerId, tile_position) {
  return await axios.post(`${API_URL_GAME}/${gameId}/buy`, { player_id: playerId, tile_position });
}

// 🎲 Draw chance
export async function drawChance(gameId, playerId) {
  return await axios.post(`${API_URL_GAME}/${gameId}/chance`, { player_id: playerId });
}

// 💳 Draw community chest
export async function drawCommunity(gameId, playerId) {
  return await axios.post(`${API_URL_GAME}/${gameId}/community`, { player_id: playerId });
}

// 🚨 Jail
export async function handleJail(gameId, playerId, action) {
  return await axios.post(`${API_URL_GAME}/${gameId}/jail`, { player_id: playerId, action });
}

// 💀 Bankruptcy
export async function bankruptPlayer(gameId, playerId) {
  return await axios.post(`${API_URL_GAME}/${gameId}/bankrupt`, { player_id: playerId });
}

// 💰 Pay rent to property owner
export async function handleRentPayment(gameId, playerId, propertyId) {
  return await axios.post(`${API_URL_GAME}/${gameId}/rent`, {
    player_id: playerId,
    property_id: propertyId,
  });
}



