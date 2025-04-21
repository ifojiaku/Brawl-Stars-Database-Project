from brawlstars_api import BrawlStarsClient
from supabase_connection import SupabaseConnection
# inserting players 

def main():
    # change to have parameter of player_list
    try:
        client = BrawlStarsClient()
        sb_connection = SupabaseConnection()

        club_list = {'#Q8J09VPQ'}
        
        

        # for club in club_list:
        #     # call bs api,
        #     club_data =  client.get_club(club)
        #     if club_data:
        #         print("Found club data, insterting")
        #         sb_connection.upsert_club_and_members(club_data)
        #         print("Finished 1 club")
        #     # then call supabase and insert that
        # club_list=client.get_club_members(club_list)
        print(club_list)
        for club in club_list:
            club_members = client.get_club_members(club)
            if club_members:
                # print("club_members: ",club_members)
                for member in club_members["items"]:
                    player_tag = member.get("tag")
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
                        print("Finished Battlelog insertion")
                # little bit of a mess.
                # i should clean this up but on crunch might not

                # after inserting each player in club
            # then inserting that club and club as members
            club_data =  client.get_club(club)
            if club_data:
                print("Found club data, insterting")
                sb_connection.upsert_club_and_members(club_data)
                print("Finished 1 club")
           


            


    except ValueError as e:
        print(f"Error: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    main() 
