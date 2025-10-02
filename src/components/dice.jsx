import React, { useState } from "react";
import supabase from "../supabaseClient";
import Draw_card from "./Card";
import Property from "./Buyproperty";

function Game({ playerId }) {
  const [number1, setNumber1] = useState(null);
  const [number2, setNumber2] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [triggerCard, setTriggerCard] = useState(false);

  // 🎲 Utility: random number for dice
  const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const rollDice = async () => {
    const newNumber1 = randomNumber(1, 6);
    const newNumber2 = randomNumber(1, 6);
    setNumber1(newNumber1);
    setNumber2(newNumber2);

    const sum = newNumber1 + newNumber2;

    // ✅ Fetch player position
    const { data, error } = await supabase
      .from("players")
      .select("position")
      .eq("id", playerId)
      .single();

    if (error || !data) {
      console.error("Failed to fetch player position", error);
      setRolling(false);
      return;
    }

    const currentPosition = data.position || 0;
    const newPosition = (currentPosition + sum) % 40;

    // ✅ Update player position
    const { error: updateError } = await supabase
      .from("players")
      .update({ position: newPosition })
      .eq("id", playerId);

    if (updateError) {
      console.error("Failed to update position", updateError);
    } else {
      alert(
        `You rolled ${newNumber1} and ${newNumber2}. New position: ${newPosition}`
      );
    }

    // ✅ Trigger card/property check briefly
    setTriggerCard(true);
    setTimeout(() => setTriggerCard(false), 500);

    if (newNumber1 === newNumber2) {
      alert("🎉 You rolled doubles! Roll again in 2 seconds...");
      setTimeout(() => {
        rollDice();
      }, 2000);
    } else {
      alert(`Move your piece ${sum} spaces`);
      setRolling(false);
    }
  };

  const handleRolling = () => {
    if (!rolling) {
      setRolling(true);
      rollDice();
    }
  };

  return (
    <div>
      <button onClick={handleRolling} disabled={rolling}>
        {rolling ? "Rolling..." : "Roll Dice"}
      </button>

      {/* 🎴 Triggered events */}
      <Draw_card triggered={triggerCard} playerId={playerId} />
      <Property triggered={triggerCard} playerId={playerId} />

      {/* 📝 Show dice results */}
      {number1 && number2 && (
        <p>
          You rolled: 🎲 {number1} + {number2} = {number1 + number2}
        </p>
      )}
    </div>
  );
}

export default Game;
