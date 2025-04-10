import { supabase_connection } from "./supabase";

// Buttons are going to be added to the club page to call these and change the clubs[]

// Have not been tested yet!

// Getting the top clubs sorted by the total amount of trophies
export async function get_TopClubs_totalTrophies() {
    const { data, error } = await supabase_connection
      .from('club_leaderboard')
      .select('*')
      .order('total_trophies', { ascending: false });
    
    if (error) {
      console.error('Error:', error);
      return null;
    }
    
    return data;
  }

//   Getting the top clubs sorted by the number of members in the club
  export async function get_TopClubs_members() {
    const { data, error } = await supabase_connection
      .from('club_leaderboard')
      .select('*')
      .order('member_count', { ascending: false });
    
    if (error) {
      console.error('Error:', error);
      return null;
    }
    
    
    return data;
  }

// Functions that have to deal with each individual club

// Getting more information on a club ( reusing top club view)
export async function get_clubInfo(clubTag) {
    const { data, error } = await supabase_connection
      .from('club_leaderboard')
      .select('*')
      .eq('club_tag',clubTag);
    
    if (error) {
      console.error('Error:', error);
      return null;
    }
    
    return data;
  }

// Getting all club members
// of a specific club tag
export async function get_allclubmembers(clubTag) {
    const {data, error} = await supabase_connection.rpc('get_clubmembers',{club_tag:clubTag});
    
    if (error) {
      console.error('Error:', error);
      return null;
    }
    
    return data;
  }
