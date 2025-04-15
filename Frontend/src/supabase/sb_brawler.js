// Supabase brawler information calls
import { supabase_connection } from "./supabase";

// Getting information about a specific brawler
// Query the view directly from JavaScript
export async function get_AllBwlrPerformance() {
    const { data, error } = await supabase_connection
      .from('brawler_performance')
      .select('*')
      .order('win_rate', { ascending: false });
    
    if (error) {
      console.error('Error:', error);
      return null;
    }
    
    return data;
  }
  
  // Example usage
//   getBrawlerPerformance().then(brawlers => {
//     console.log('Top performing brawlers:', brawlers);
//   });


// sb_playerinfo has call of getting top players of a specific brawler (by id)

// Getting Brawler's mode performance
export async function get_SBwlrPerformance(brawlerID) {
    const { data, error } = await supabase_connection
      .from('brawler_mode_performance')
      .select('*')
      .eq('brawler_id',brawlerID);
    
    if (error) {
      console.error('Error on SBwlrPerformance:', error);
      return null;
    }
    
    return data;
  }

  // get_brawler_items
  export const fetchBrawlerItems = async (brawler) =>{
    const {data, error} = await supabase_connection.rpc('get_brawler_items',{brawler_id:brawler});
  
    if(error){
      console.error("Error using function'get_brawler_items'", error);
      return null
    }
    // console.log(data);
    return data;
  };