import React, { useEffect, useState } from "react";
import supabase from "./SUpabaseclient";

function Communitychest({ triggered,playerId }) {
  const [showCard, setShowCard] = useState(false);
  const [cardText, setCardText] = useState('');

  const chestCards = [
    'Advance to GO (Collect $200)',
    'Bank error in your favor. Collect $200',
    'Doctor\'s fee. Pay $50',
    'From sale of stock you get $50',
    'Get out of Jail free',
    'Holiday fund matures. Receive $100'
  ];

  useEffect(() => {
  const handleCard = async () => {  
    if (triggered) {
      const randomCard = chestCards[Math.floor(Math.random() * chestCards.length)];
      setCardText(randomCard);
      setShowCard(true);
      
      // If it's the jail card, update database
      if (randomCard === 'Get out of Jail free' && playerId) {
        await supabase  
          .from('players')
          .update({ has_jail_card: true })
          .eq('id', playerId);
      }
      
      setTimeout(() => setShowCard(false), 3000);
    }
  };

  handleCard(); 
}, [triggered]);
  if (!showCard) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'lightblue',
      padding: '20px',
      border: '2px solid black',
      borderRadius: '10px',
      zIndex: 1000
    }}>
      <h3>Community Chest</h3>
      <p>{cardText}</p>
    </div>
  );
}

export default Communitychest;