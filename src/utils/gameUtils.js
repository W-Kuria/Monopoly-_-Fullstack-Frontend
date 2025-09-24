// Utility functions for game logic and state management

// Property groups for Monopoly
export const PROPERTY_GROUPS = {
  brown: ['Mediterranean Ave', 'Baltic Ave'],
  lightblue: ['Oriental Ave', 'Vermont Ave', 'Connecticut Ave'],
  pink: ['St. Charles Place', 'States Ave', 'Virginia Ave'],
  orange: ['St. James Place', 'Tennessee Ave', 'New York Ave'],
  red: ['Kentucky Ave', 'Indiana Ave', 'Illinois Ave'],
  yellow: ['Atlantic Ave', 'Ventnor Ave', 'Marvin Gardens'],
  green: ['Pacific Ave', 'North Carolina Ave', 'Pennsylvania Ave'],
  darkblue: ['Park Place', 'Boardwalk']
};

// Railroad properties
export const RAILROADS = [
  'Reading Railroad',
  'Pennsylvania Railroad', 
  'B&O Railroad',
  'Short Line Railroad'
];

// Utility properties
export const UTILITIES = [
  'Electric Company',
  'Water Works'
];

// Calculate rent for a property
export const calculateRent = (property, owner, gameState) => {
  if (!property || !owner) return 0;
  
  // Basic rent calculation - can be enhanced
  let rent = property.baseRent || Math.floor(property.price * 0.1);
  
  // Check if owner has monopoly (owns all properties in color group)
  if (property.color && PROPERTY_GROUPS[property.color]) {
    const groupProperties = PROPERTY_GROUPS[property.color];
    const ownerProperties = gameState.properties
      .filter(p => p.owner === owner.id)
      .map(p => p.name);
    
    const hasMonopoly = groupProperties.every(prop => ownerProperties.includes(prop));
    
    if (hasMonopoly) {
      rent *= 2; // Double rent for monopoly
    }
  }
  
  // Railroad rent calculation
  if (RAILROADS.includes(property.name)) {
    const ownedRailroads = gameState.properties
      .filter(p => RAILROADS.includes(p.name) && p.owner === owner.id)
      .length;
    
    rent = 25 * Math.pow(2, ownedRailroads - 1); // $25, $50, $100, $200
  }
  
  // Utility rent calculation
  if (UTILITIES.includes(property.name)) {
    const ownedUtilities = gameState.properties
      .filter(p => UTILITIES.includes(p.name) && p.owner === owner.id)
      .length;
    
    // Rent is 4x or 10x dice roll (simplified to average)
    rent = ownedUtilities === 1 ? 28 : 70; // 4x average roll (7) or 10x average roll
  }
  
  return rent;
};

// Check if player can afford a purchase
export const canAfford = (player, amount) => {
  return player && player.money >= amount;
};

// Get player by ID
export const getPlayerById = (gameState, playerId) => {
  return gameState.players.find(p => p.id === playerId);
};

// Get property by ID or name
export const getProperty = (gameState, identifier) => {
  return gameState.properties.find(p => 
    p.id === identifier || p.name === identifier
  );
};

// Check if property is owned
export const isPropertyOwned = (gameState, propertyId) => {
  const property = getProperty(gameState, propertyId);
  return property && property.owner;
};

// Get properties owned by player
export const getPlayerProperties = (gameState, playerId) => {
  return gameState.properties.filter(p => p.owner === playerId);
};

// Calculate player's total worth (money + property values)
export const calculatePlayerWorth = (gameState, playerId) => {
  const player = getPlayerById(gameState, playerId);
  if (!player) return 0;
  
  const properties = getPlayerProperties(gameState, playerId);
  const propertyValue = properties.reduce((total, prop) => total + prop.price, 0);
  
  return player.money + propertyValue;
};

// Format currency
export const formatCurrency = (amount) => {
  return `$${amount.toLocaleString()}`;
};

// Get next player in turn order
export const getNextPlayer = (gameState) => {
  const nextIndex = (gameState.currentPlayer + 1) % gameState.players.length;
  return gameState.players[nextIndex];
};

// Check if game is over (only one player not bankrupt)
export const isGameOver = (gameState) => {
  if (!gameState.players || gameState.players.length === 0) return false;
  const activePlayers = gameState.players.filter(p => p.money > 0);
  return activePlayers.length <= 1;
};

// Get winner of the game
export const getWinner = (gameState) => {
  if (!isGameOver(gameState) || !gameState.players || gameState.players.length === 0) return null;
  
  const activePlayers = gameState.players.filter(p => p.money > 0);
  if (activePlayers.length === 1) {
    return activePlayers[0];
  }
  
  // If no active players, return richest player
  if (gameState.players.length === 0) return null;
  
  return gameState.players.reduce((richest, player) => 
    calculatePlayerWorth(gameState, player.id) > calculatePlayerWorth(gameState, richest.id) 
      ? player : richest
  );
};

// Validate move (basic validation)
export const isValidMove = (currentPosition, diceRoll) => {
  return diceRoll >= 2 && diceRoll <= 12; // Valid dice roll range
};

// Calculate new position after move
export const calculateNewPosition = (currentPosition, diceRoll) => {
  return (currentPosition + diceRoll) % 40;
};

// Check if player passed GO
export const passedGO = (oldPosition, newPosition) => {
  return newPosition < oldPosition;
};

// Default starting money
export const STARTING_MONEY = 1500;

// GO money reward
export const GO_MONEY = 200;