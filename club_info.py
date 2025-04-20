from brawlstars_api import BrawlStarsClient

def process_club_info(club_data):
    if not club_data:
        return None
    
    club_info = {
        'tag': club_data.get('tag'),
        'name': club_data.get('name'),
        'description': club_data.get('description'),
        'type': club_data.get('type'),
        'required_trophies': club_data.get('requiredTrophies'),
        'trophies': club_data.get('trophies'),
        'members_count': club_data.get('members', []).__len__(),
        'president': next((member.get('name') for member in club_data.get('members', []) 
                         if member.get('role') == 'president'), 'Unknown'),
    }
    
    return club_info

def display_club_info(club_tag):
    client = BrawlStarsClient()
    club_data = client.get_club(club_tag)
    
    if not club_data:
        print("No club data available")
        return
    
    club = process_club_info(club_data)
    
    print("\n=== Club Information ===")
    print(f"Tag: {club['tag']}")
    print(f"Name: {club['name']}")
    print(f"Description: {club['description']}")
    print(f"Type: {club['type']}")
    print(f"Required Trophies: {club['required_trophies']}")
    print(f"Total Trophies: {club['trophies']}")
    print(f"Members: {club['members_count']}/30")
    print(f"President: {club['president']}")
    print("-" * 30)

if __name__ == "__main__":
    club_tag = "#2QUVJ0C9Q"
    display_club_info(club_tag) 