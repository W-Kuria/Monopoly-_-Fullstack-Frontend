# Monopoly Game - Frontend

A React-based frontend for a multiplayer Monopoly game. This is the frontend component of a fullstack Monopoly application.

## Features

- **Game Lobby**: Create or join games with other players
- **Interactive Board**: Visual representation of the Monopoly board
- **Real-time Communication**: Connects to Flask backend for game state management
- **Dice Rolling**: Animated dice with backend synchronization
- **Property Management**: Buy properties and track ownership
- **Demo Mode**: Play offline without backend connection

## Project Structure

```
src/
├── components/
│   ├── GameLobby.jsx     # Game creation and joining
│   ├── GamePage.jsx      # Main game interface
│   └── *.css            # Component styles
├── services/
│   └── gameService.js    # Backend API communication
└── App.jsx              # Main app component
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:5173`

## Backend Integration

This frontend expects a Flask backend running on `http://localhost:5000` with the following endpoints:

- `POST /game/create` - Create new game
- `POST /game/{id}/join` - Join existing game
- `GET /game/{id}` - Get game state
- `POST /game/{id}/roll-dice` - Roll dice
- `POST /game/{id}/buy-property` - Buy property

## Demo Mode

If the backend is not available, you can use Demo Mode to test the frontend functionality offline.

## Team Integration

This frontend is designed to work with:
- **Backend Team**: Flask API for game logic
- **Database Team**: Supabase integration through backend
- **Authentication Team**: JWT token handling

## Built With

- React 19
- Vite
- CSS3 (Grid & Flexbox)
- Fetch API for HTTP requests
