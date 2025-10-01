async function SendToJail(gameId, playerId) {
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
export default SendToJail