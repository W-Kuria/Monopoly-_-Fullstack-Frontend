import { useState, useEffect } from 'react';
import React, { useEffect, useState } from "react";
import supabase from "./Supabaseclient";

function Communitychest({ triggered }) {
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
    if (triggered) {
      const randomCard = chestCards[Math.floor(Math.random() * chestCards.length)];
      setCardText(randomCard);
      setShowCard(true);
      setTimeout(() => setShowCard(false), 3000);
    }
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