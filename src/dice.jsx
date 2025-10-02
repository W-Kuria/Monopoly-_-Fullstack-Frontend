import React from "react";
import { useEffect,useState } from "react";
import supabase from "./Supabaseclient";
import Draw_card from "./Card";
import Property from "./Buyproperty";
import { sendToJail, getOutOfJail, payToGetOut } from "./Jail";


function Game({ playerId }) {
  const [number1, setNumber1] = useState(null);
  const [number2, setNumber2] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [triggerCard, setTriggerCard] = useState(false);
  const [inJail, setInJail] = useState(false);


  useEffect(() => {
    const fetchJailStatus = async () => {
      const { data, error } = await supabase
        .from("players")
        .select("in_jail")
        .eq("id", playerId)
        .single();

      if (error) {
        console.error("Failed to fetch player jail status", error);
      } else {
        setInJail(data.in_jail);
      }
    };

    if (playerId) {
      fetchJailStatus();
    }
  }, [playerId]);

  

  const randomNumber = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const rollDice = async () => {
    const newNumber1 = randomNumber(1, 6);
    const newNumber2 = randomNumber(1, 6);
    setNumber1(newNumber1);
    setNumber2(newNumber2);
    const sum = newNumber1 + newNumber2;

    const { data, error } = await supabase
      .from("players")
      .select("position")
      .eq("id", playerId)
      .single();

    if (error || !data) {
      console.error("Failed to fetch player position", error);
      return;
    }

    const currentPosition = data.position || 0;
    const newPosition = (currentPosition + sum) % 40;

    const { error: updateError } = await supabase
      .from("players")
      .update({ position: newPosition })
      .eq("id", playerId);

    if (updateError) {
      console.error("Failed to update position", updateError);
    } else {
      alert(`You rolled ${newNumber1} and ${newNumber2}. New position: ${sum}`);
    }

   
    setTriggerCard(true);
    

    if (newNumber1 === newNumber2) {
      alert(`You rolled doubles! Roll again in 2 seconds...`);
      setTimeout(() => {
        rollDice();
      }, 2000);
    } else {
      alert(`Move your piece ${sum} spaces`);
      setRolling(false);
    }
  };
  
  const handleChanceCard = async () => {
    await sendToJail(null, playerId);
    setInJail(true);
    alert("Go to Jail. Do not pass GO. Do not collect $200.");
  };

  const handlePayToGetOut = async () => {
  const success = await payToGetOut(null, playerId); 
    if (success) {
      alert("You paid $50 to get out of jail.");
      setInJail(false); 
    } else {
      alert("Not enough money to pay the fine.");
    }
  };
  const handleUseChanceCard = async () => {
  const success = await getOutOfJail(null, playerId, "chance_card");
  if (success) {
    alert("You used a Get Out of Jail Free card.");
    setInJail(false); 
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
      <button onClick={handleRolling} disabled={rolling ||inJail}>Roll dice</button>

      
      <Draw_card triggered={triggerCard} playerId={playerId} />

     
      <Property triggered={triggerCard} playerId={playerId} />
      {inJail && (
        <div>
          <button onClick={handlePayToGetOut}>Pay $50 to get out of jail</button>
          <button onClick={handleUseChanceCard}>Use Get Out of Jail Free card</button>
        </div>      )}

    </div>
  );
}

export default Game;