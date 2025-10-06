import { sendToJail,getOutOfJail,payToGetOut } from "./Jail";

const handlePayToGetOut = async () => {
  const success = await payToGetOut(gameId, playerId);
  if (success) {
    alert("Paid $50 to get out of jail!");
    setRolling(false);
  } else {
    alert("Not enough money to pay bail!");
  }
};

const handleChanceCardRelease = async () => {
  const success = await getOutOfJail(gameId, playerId, "chance_card");
  if (success) {
    alert("Used Chance Card to get out of jail!");
    setRolling(false);
  }
};