import { useState, useEffect } from 'react';
import React, { useEffect, useState } from "react";
import supabase from "./Supabaseclient";

function Chance({ triggered }) {
  const [showCard, setShowCard] = useState(false);
  const [cardText, setCardText] = useState('');

  const chanceCards = [
    'Advance to GO (Collect $200)',
    'Bank pays you dividend of $50',
    'Go back 3 spaces',
    'Go to Jail',
    'Pay poor tax of $15',
    'Take a trip to Reading Railroad'
  ];

  useEffect(() => {
    if (triggered) {
      const randomCard = chanceCards[Math.floor(Math.random() * chanceCards.length)];
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
      background: 'orange',
      padding: '20px',
      border: '2px solid black',
      borderRadius: '10px',
      zIndex: 1000
    }}>
      <h3>Chance</h3>
      <p>{cardText}</p>
    </div>
  );
}

export default Chance;