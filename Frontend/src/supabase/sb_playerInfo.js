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

  // Gets top players per brawlerID!! put in
  // orders it by trophies and not winrate, can change this
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
// Is not working for me yet
export const fetchPlayer_wins = async (playerTag) =>{
  const {data,error} = supabase_connection.from("player_victories").select('solo_victories','duo_victories','3v3_victories').eq('tag',playerTag);

  if (error){
    console.log("Error getting player wins:",error);
  }

  console.log(data);
  return data;

}

// Fetching players most played/top brawlers (limited defaultly 10) <----
// returns (brawler id,brawler name, total battles, winrate)
export const fetchSPlayerTBs = async (tag, limit=10) =>{
  const {data, error} = await supabase_connection.rpc('get_splayertopbrawlers',{player_tag:tag,num:limit});

  if(error){
    console.error("Error using function'get_splayertopbrawlers'", error);
    return null
  }
  // console.log(data);
  return data;
};



// Fetching a player's recent battle log (pulling from battles_player and battles (for the timestamp) and brawler for name )
// returns bp.brawler_id, b.name, bp.trophy_change, bp.result, bt.mode, bt.date
// organized by timestamp/date (most recent first)
export const fetchSPlayerBLG = async (tag, limit=10) =>{
  const {data, error} = await supabase_connection.rpc('get_spbatlog',{player_tag:tag,num:limit});

  if(error){
    console.error("Error using function'get_spbatlog'", error);
    return null
  }
  // console.log(data);
  return data;
};

export const fetch_playerInfo = async(tag) =>{
  const {data, error} = await supabase_connection.rpc('get_splyinfo',{player_tag:tag});

  if(error){
    console.error("Error using function'get_splyinfo'", error);
    return null
  }
  return data;
};


