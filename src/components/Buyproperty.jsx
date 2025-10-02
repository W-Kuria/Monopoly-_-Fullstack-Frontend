import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";

function Property({ playerId}) {
  const [property, setProperty] = useState(null);
  const [ setPlayer] = useState(null);

  useEffect(() => {
    if (!playerId) return;

    const fetchData = async () => {
     
      const { data: playerData, error: playerError } = await supabase
        .from("players")
        .select("*")
        .eq("id", playerId)
        .single();

      if (playerError) {
        console.error("Failed to fetch player:", playerError);
        return;
      }
      setPlayer(playerData);
      const position = playerData.position;


      
      const { data: propertyData, error: propertyError } = await supabase
        .from("properties")
        .select("*")
        .eq("id", position)
        .single();

      if (propertyError) {
        console.error("Failed to fetch property:", propertyError);
        return;
      }
      setProperty(propertyData);

      if (propertyData) {
        if (!propertyData.owner_id) {
        
          if (playerData.laps >= 1 && playerData.money >= propertyData.price) {
            const confirmBuy = window.confirm(
              `Do you want to buy this property for $${propertyData.price}?`
            );
            if (confirmBuy) {
              await supabase
                .from("players")
                .update({money: playerData.money - propertyData.price,})
                .eq("id", playerId);

              await supabase
                .from("properties")
                .update({owner_id: playerId,})
                .eq("id", propertyData.id);

              alert(
                `You bought property ${propertyData.id} for $${propertyData.price}`
              );
            }
          }
        } else if (propertyData.owner_id !== playerId) {
      
          const rent = propertyData.rent;
          if (playerData.money >= rent) {
     
            await supabase
              .from("players")
              .update({money: playerData.money - rent,})
              .eq("id", playerId);
            const { data: owner } = await supabase
              .from("players")
              .select("money")
              .eq("id", propertyData.owner_id)
              .single();

            if (owner) {
              await supabase
                .from("players")
                .update({money: owner.money + rent,})
                .eq("id", propertyData.owner_id);}

            alert(`You paid $${rent} rent to Player ${propertyData.owner_id}`);
          } else {
            await supabase
              .from("players")
              .update({ is_active: false })
              .eq("id", playerId);

            alert(`${playerData.name} is bankrupt and out of the game!`);
            const { data: activePlayers } = await supabase
              .from("players")
              .select("*")
              .eq("is_active", true);

            if (activePlayers && activePlayers.length === 1) {
              alert(`${activePlayers[0].name} wins the game!`);
            }
          }
        }
      }
    };

    fetchData();
  }, [playerId]);

  if (!property) return null;

  return (
    <div>
      <h3>Property: {property.name}</h3>
      <p>Price: ${property.price}</p>
      <p>Rent: ${property.rent}</p>
      <p>
        {property.owner_id
          ? `Owned by Player ${property.owner_id}`
          : "Unowned"}
      </p>
    </div>
  );
}

export default Property;
