import { supabase_connection } from "./supabase";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

// supabase connection from supabase
// Getting ALL players from player table
export const fetchAllPlayers = async () => {
    const { data, error } = await supabase_connection.from("player").select("*");
    if (error) {
      console.error("Error fetching data:", error);
      return null;
    }
    // console.log("Fetched Data:", data);
    return data;
  };

  // Gets top X
  // Returns Json
export const fetchBrawlerPlayers = async (brawler, limit=10) =>{
  const {data, error} = await supabase_connection.rpc('get_top_players_per_brawler',{brawler:brawler,num:limit});

  if(error){
    console.error("Error using function'get_top_players_per_brawler'", error);
    return null
  }
  // console.log(data);
  return data;
};


//-------------------player specific / indiviudal ----- (given a tag)-----

// Fetching all wins from a specific player
// in the three diff modes: 3v3, solo, victories
// returning 3 nums
export const fetchPlayer_wins = async (playerTag) =>{
  const {data,error} = supabase_connection.from("player_victories").select('solo_victories','duo_victories','3v3_victories').eq('tag',playerTag);

  if (error){
    console.log("Error getting player wins:",error);
  }

  console.log(data);
  return data;

}


// Fetching a player's most played brawler (1 return)
// or instead
// Fetching players most played brawlers (limited defaultly 10)


// Fetching a player's played brawlers(at least one entry in brawlers_player) along with their winrates


// Fetching a player's recent battle log (pulling from battles_player and battles (for the timestamp) )
// organized by timestamp 



