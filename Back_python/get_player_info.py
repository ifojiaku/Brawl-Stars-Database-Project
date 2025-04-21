from brawlstars_api import BrawlStarsClient
from dotenv import load_dotenv

def main():
    try:
        client = BrawlStarsClient()
        # Enter player tag from brawl stars (should be on profile page)
        player_tag = "#82YPUUL8"
        player_data = client.get_player(player_tag)

        # example player tags
        # #82YPUUL8
        # #82PLQGYPV
        # #LLCUY8R
        # #YCPCG9JJG
        # #PL2RJGRCY
        
        if player_data:
            print("\n=== Player Information ===")
            print(f"Name: {player_data.get('name')}")
            print(f"Trophies: {player_data.get('trophies')}")
            print(f"Club: {player_data.get('club', {}).get('name', 'No Club')}")
            print(f"3v3 Victories: {player_data.get('3vs3Victories')}")
            print(f"Solo Victories: {player_data.get('soloVictories')}")
            print(f"Duo Victories: {player_data.get('duoVictories')}")
            
            # This will show all the brawlers (characters), that the player has
            brawlers = player_data.get('brawlers', [])
            print(f"\nOwned Brawlers: {len(brawlers)}")
            for brawler in brawlers:  
                print(f"- {brawler['name']}: Power {brawler['power']}, Trophies: {brawler['trophies']}")
                # put them into the brawler-players table for owned brawlers

    except ValueError as e:
        print(f"Error: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    main() 

# From player:
# {
#   "tag": "#PL2RJGRCY",
#   "name": "Cody",
#   "nameColor": "0xfff05637",
#   "icon": {
#     "id": 28000642
#   },
#   "trophies": 73724,
#   "highestTrophies": 73727,
#   "expLevel": 242,
#   "expPoints": 300878,
#   "isQualifiedFromChampionshipChallenge": false,
#   "3vs3Victories": 13844,
#   "soloVictories": 1795,
#   "duoVictories": 1577,
#   "bestRoboRumbleTime": 5,
#   "bestTimeAsBigBrawler": 0,
#   "club": {
#     "tag": "#2UQ08UPGR",
#     "name": "TheGoats"
#   },
#   "brawlers": [
#     {
#       "id": 16000000,
#       "name": "SHELLY",
#       "power": 11,
#       "rank": 51,
#       "trophies": 1000,
#       "highestTrophies": 1010,
#       "gears": [

# Getting player info from api
# putting info player(tag,name,icon,trophies,highest_trophies)
# putting info into player_victories(tag,solo_victories,duo_victories,'3v3_victories')
# putting player brawler info into players_brawler(player_tag,brawler_id,trophies,highest_trophies,rank,power)

# next:
# if they are in a club, putting that into player_clubs (player_tag,club_tag,role) -> for role need to look up the club on its own for the 
# Need to look up the player's battle log and input that