from brawlstars_api import BrawlStarsClient

def process_battle_log(battle_log_data):
    if not battle_log_data or 'items' not in battle_log_data:
        return None
    
    battles = battle_log_data['items']
    processed_battles = []
    
    for battle in battles:
        battle_info = {
            'battle_time': battle.get('battleTime'),
            'mode': battle.get('battle', {}).get('mode'),
            'type': battle.get('battle', {}).get('type'),
            'map': battle.get('event', {}).get('map'),
            'result': battle.get('battle', {}).get('result'),
            'duration': battle.get('battle', {}).get('duration'),
            'trophyChange': battle.get('battle', {}).get('trophyChange'),
        }
        processed_battles.append(battle_info)
    
    return processed_battles

def display_battle_log(player_tag):
    client = BrawlStarsClient()
    battle_log_data = client.get_battle_log(player_tag)
    
    if not battle_log_data:
        print("No battle log data available")
        return
    
    battles = process_battle_log(battle_log_data)
    
    print("\n=== Recent Battles ===")
    for battle in battles:
        print(f"\nBattle Time: {battle['battle_time']}")
        print(f"Mode: {battle['mode']}")
        print(f"Type: {battle['type']}")
        print(f"Map: {battle['map']}")
        print(f"Result: {battle['result']}")
        print(f"Trophy Change: {battle['trophyChange']}")
        if battle['duration']:
            print(f"Duration: {battle['duration']} seconds")
        print("-" * 30)

if __name__ == "__main__":
    # Example usage
    player_tag = "#82YPUUL8"  # Replace with desired player tag
    display_battle_log(player_tag) 