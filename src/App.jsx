import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage"
import Login from "./pages/Login";
import Register from "./pages/Register";
import WelcomePage from "./pages/WelcomePage";
import GamePage from "./pages/GamePage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/game/:gameId" element={<GamePage />} />
      </Routes>
    </Router>
  );
}

export default App;



