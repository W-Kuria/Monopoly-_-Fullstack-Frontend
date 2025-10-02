import supabase from "./SUpabaseclient"; 

export async function sendToJail(gameId, playerId) {
  const { error } = await supabase
    .from("players")
    .update({ 
      position: 10, 
      in_jail: true 
    })
    .eq("id", playerId);
  
  if (error) {
    console.error("Failed to send to jail:", error);
  } else {
    console.log("Player sent to jail");
  }
}

export async function getOutOfJail(gameId, playerId, method) {
  const { error } = await supabase
    .from("players")
    .update({ 
      in_jail: false,
      jail_turns: 0
    })
    .eq("id", playerId);
  
  if (error) {
    console.error("Failed to release from jail:", error);
    return false;
  } else {
    console.log(`Player released from jail via ${method}`);
    return true;
  }
}

export async function payToGetOut(gameId, playerId) {
  // First deduct money
  const { error: moneyError } = await supabase
    .from("players")
    .update({ 
      money: supabase.sql`money - 50` 
    })
    .eq("id", playerId);
  
  if (moneyError) {
    console.error("Failed to deduct money:", moneyError);
    return false;
  }
  
  //release from jail
  return await getOutOfJail(gameId, playerId, "payment");
}