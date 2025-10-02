import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/welcomePage.css';

const WelcomePage = ({ onStart, onResume, showResume, instructionsViewed, setInstructionsViewed }) => {
  const [showInstructions, setShowInstructions] = useState(false);

  const handleToggleInstructions = () => {
    if (!instructionsViewed) setInstructionsViewed(true);
    setShowInstructions(!showInstructions);
  };

  return (
    <div className="welcome-bg d-flex flex-column justify-content-center align-items-center vh-100 text-center px-4">
      <div className="welcome-content">
        <h1 className="display-4 fw-bold mb-3">Welcome to React Monopoly</h1>
        <p className="lead mb-4">Buy properties, collect rent, and bankrupt your friends!</p>

        {/* Horizontal Button Row */}
        <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">
          <button className="btn btn-light btn-lg px-4 py-2" onClick={onStart}>
            Start Game
          </button>
          <button
            className="btn btn-outline-light btn-lg px-4 py-2"
            onClick={handleToggleInstructions}
          >
            {showInstructions ? 'Hide Instructions' : 'How to Play'}
          </button>
          {showResume && instructionsViewed && (
            <button className="btn btn-success btn-lg px-4 py-2" onClick={onResume}>
              Resume Game
            </button>
          )}
        </div>

        {/* Instructions */}
        {showInstructions && (
          <div className="mt-4 text-start bg-white text-dark p-4 rounded shadow-sm" style={{ maxWidth: '600px' }}>
            <h5>How to Play:</h5>
            <ul className="mb-0">
              <li>Roll the dice to move your token around the board.</li>
              <li>Land on unowned properties to buy them.</li>
              <li>Pay rent if you land on a property owned by another player.</li>
              <li>Passing GO earns you $200.</li>
              <li>Bankrupt your opponents to win the game.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomePage;
