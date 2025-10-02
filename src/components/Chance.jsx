import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";


function Chance({ triggered }) {
  const [card, setCard] = useState(null);

  useEffect(() => {
    const drawCard = async () => {
      const { data, error } = await supabase
        .from('chance_cards')
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
      <h1>Chance cards</h1>
      {card ? (
        <p>{card.descripton}</p>
      ) : (
        <p>Failed to draw a chance card</p>
      )}
    </div>
  );
}

export default Chance;
