import Locate from "./position";
import "../components/MonopolyBoard.css"
import Logout from "./Logout";

function MonopolyBoard({ players, position1, position2 }) {
  const board = Locate();

  return (
    <div className="board-container">
      {board.map((tile) => {
        const isPlayer1 = tile.position === position1;
        const isPlayer2 = tile.position === position2;

        return (
          <div
            key={tile.position}
            className={`tile tile-${tile.position} tile-${tile.type}`}
          >
            <div className="tile-name">{tile.name}</div>
            <div className="player-markers">
              {isPlayer1 && (
                <div className="player-piece" style={{ background: "red" }} />
              )}
              {isPlayer2 && (
                <div className="player-piece" style={{ background: "blue" }} />
              )}
            </div>
            <div>
              <button onClick={Logout}>Logout</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MonopolyBoard;
