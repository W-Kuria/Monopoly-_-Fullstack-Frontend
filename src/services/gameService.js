// This file handles all communication with the Flask backend
// It's like a messenger between your React app and the server

const API_BASE_URL = 'http://localhost:5500'; // Your Flask server URL

class GameService {
  
  // Helper method to make API calls
  async makeRequest(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          // Add JWT token if we have one stored
          ...(localStorage.getItem('token') && {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          })
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get current game state from backend
  async getGameState(gameId) {
    return this.makeRequest(`/game/${gameId}`);
  }

  // Send dice roll to backend
  async rollDice(gameId, playerId) {
    return this.makeRequest(`/game/${gameId}/roll-dice`, {
      method: 'POST',
      body: JSON.stringify({ player_id: playerId })
    });
  }

  // Move player on the board
  async movePlayer(gameId, playerId, newPosition) {
    return this.makeRequest(`/game/${gameId}/move-player`, {
      method: 'POST',
      body: JSON.stringify({ 
        player_id: playerId, 
        new_position: newPosition 
      })
    });
  }

  // Buy property
  async buyProperty(gameId, playerId, propertyId) {
    return this.makeRequest(`/game/${gameId}/buy-property`, {
      method: 'POST',
      body: JSON.stringify({ 
        player_id: playerId, 
        property_id: propertyId 
      })
    });
  }

  // Join a game
  async joinGame(gameId, playerName) {
    return this.makeRequest(`/game/${gameId}/join`, {
      method: 'POST',
      body: JSON.stringify({ player_name: playerName })
    });
  }

  // Create a new game
  async createGame(hostName) {
    return this.makeRequest('/game/create', {
      method: 'POST',
      body: JSON.stringify({ host_name: hostName })
    });
  }

  // End turn
  async endTurn(gameId, playerId) {
    return this.makeRequest(`/game/${gameId}/end-turn`, {
      method: 'POST',
      body: JSON.stringify({ player_id: playerId })
    });
  }
}

// Export a single instance that we can use throughout the app
export default new GameService();