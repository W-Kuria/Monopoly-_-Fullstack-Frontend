import React, { useEffect, useState } from "react";
import supabase from "../SupabaseClient";
import Communitychest from "./Chest";
import Chance from "./Chance";

function Draw_card({ triggered = false, playerId = null }) {
  const [showChancecard, setshowChancecard] = useState(false);
  const [showCommunitychestcard, setshowCommunitychestcard] = useState(false);

  useEffect(() => {
    const Card_type = async () => {
      if (!playerId) {
        console.warn("No playerId provided, skipping fetch.");
        return;
      }

      const { data, error } = await supabase
        .from("players")
        .select("position")
        .eq("id", playerId)
        .single();

      if (error) {
        console.error("Failed to fetch player position:", error);
        return;
      }

      const position = data?.position ?? 0;

      if ([7, 22, 36].includes(position)) {
        setshowChancecard(true);
        setshowCommunitychestcard(false);
      } else if ([2, 17, 33].includes(position)) {
        setshowChancecard(false);
        setshowCommunitychestcard(true);
      } else {
        setshowChancecard(false);
        setshowCommunitychestcard(false);
      }
    };

    if (triggered) {
      Card_type();
    }
  }, [triggered, playerId]);

  return (
    <div>
      {showChancecard && <Chance triggered={true} />}
      {showCommunitychestcard && <Communitychest triggered={true} />}
    </div>
  );
}

export default Draw_card;
