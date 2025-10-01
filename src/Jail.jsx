import supabase from "../SUpabaseclient"; 

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