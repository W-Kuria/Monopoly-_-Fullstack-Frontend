import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your main components
import Login from "./pages/Login";
import Register from "./pages/Register";
import WelcomePage from "./pages/WelcomePage";
import GamePage from "./pages/GamePage";
import Game from "./components/dice"; // formerly dice.jsx → renamed Game.jsx

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/test-game" element={<Game playerId={1} />} />
        {/* 👆 This is optional: direct test route for your Game component */}
      </Routes>
    </Router>
  );
}

export default App;
