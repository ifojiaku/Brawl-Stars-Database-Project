from brawlstars_api import BrawlStarsClient
from supabase_connection import SupabaseConnection
# inserting players 

def main():
    # change to have parameter of player_list
    try:
        client = BrawlStarsClient()
        sb_connection = SupabaseConnection()

        player_list = { 
            '#RPVU2L29'
        }
        

        for player_tag in player_list:
            # call bs api,
            player_data = client.get_player(player_tag)
            if player_data:
                print("Found Player")
                sb_connection.insert_player(player_data)
                print("Attempted player insert")
            
            # now trying to insert battle log information
            player_battleLog = client.get_battle_log(player_tag)
            if player_battleLog:
                print("Battle log exists")
                # print(player_battleLog)
                sb_connection.insert_player_battles(player_tag,player_battleLog)
                print("Attempted Battlelog insertion")

            


    except ValueError as e:
        print(f"Error: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    main() 
