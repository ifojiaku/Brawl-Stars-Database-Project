from brawlstars_api import BrawlStarsClient
from dotenv import load_dotenv

def main():
    try:
        client = BrawlStarsClient()
        # Enter player tag from brawl stars (should be on profile page)
        player_tag = "#82YPUUL8"
        player_data = client.get_player(player_tag)
        
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
            for brawler in brawlers[:5]:  # Show first 5 brawlers
                print(f"- {brawler['name']}: Power {brawler['power']}, Trophies: {brawler['trophies']}")

    except ValueError as e:
        print(f"Error: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    main() 