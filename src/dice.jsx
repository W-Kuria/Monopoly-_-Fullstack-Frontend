import React, { useEffect, useState } from "react";
import supabase from "../SUpabaseclient";
import SendToJail from "./Jail";


function Game({playerId}){
    const [number1, setNumber1] = useState(null);
    const [number2, setNumber2] = useState(null);
    const[rolling,setRolling]=useState(false);

  const randomNumber = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };


    const rollDice = async() => {
    const newNumber1=randomNumber(1,6)
    const newNumber2=randomNumber(1,6)
    setNumber1(newNumber1);
    setNumber2(newNumber2)
    const sum=newNumber1+newNumber2;

    const{data,error}=await supabase
    .from("players")
    .select("position")
    .eq("id",playerId)
    .single();
    
    if (error || !data) {
      console.error("Failed to fetch player position", error);
      return;
    }
    const currentPosition = data.position || 0;
    const newPosition = (currentPosition + sum) % 40;
    // jail time
    if (newPosition === 30 ){
      await SendToJai(playerId) 
    }
    else{
      const { error: updateError } = await supabase
      .from("players")
      .update({ position: newPosition })
      .eq("id", playerId);
      if (updateError) {
      console.error("Failed to update position", updateError);
    } else {
      // shows the position of player not sum when successfull
      alert(`You rolled ${newNumber1} and ${newNumber2}. New position: ${newPosition}`);
    }
  }
    
   
   if(newNumber1===newNumber2){
    alert(`You have rolled the same number on both dices!Please roll again!`);
    setTimeout(()=>{
      rollDice();
    },2000);
   }
   else{
    alert(`move your piece+ ${sum}`)
    setRolling(false)
   }
   
  };
  const handleRolling=()=>{
    if(!rolling){
      setRolling(true);
      rollDice()
    }
   }
  
  return(
    <div>
        <button onClick={handleRolling}>Roll dice</button>
    </div>
  )
  
}
