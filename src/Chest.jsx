import React, { useEffect, useState } from "react";
import supabase from "./SUpabaseclient";

function Communitychest({ triggered }) {
  const [card, setCard] = useState(null);

  useEffect(() => {
    const drawCard = async () => {
      const { data, error } = await supabase
        .from('community_chest_cards')
        .select('description');
      if (error) {
        console.error('Failed to fetch cards:', error);
        return;
      }
      if (data && data.length > 0) {
        const randomCard = data[Math.floor(Math.random() * data.length)];
        setCard(randomCard);
      }
    };

    if (triggered) {
      drawCard();
    }
  }, [triggered]);

  return (
    <div>
      <h1>Community Chest</h1>
      {card ? (
        <p>{card.description}</p>
      ) : (
        <p>Failed to draw a card</p>
      )}
    </div>
  );
}

export default Communitychest;
