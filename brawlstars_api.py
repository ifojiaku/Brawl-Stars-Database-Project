import os
from dotenv import load_dotenv
import requests

class BrawlStarsClient:
    def __init__(self):
        # Load environment variables
        load_dotenv()
        
        # receives token from env file ###DO NOT PUBLICLY SHARE .ENV FILE
        self.token = os.getenv('BRAWLSTARS_API_TOKEN')
        if not self.token:
            raise ValueError("BRAWLSTARS_API_TOKEN not found in environment variables")
            
        self.base_url = "https://api.brawlstars.com/v1"
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Accept": "application/json"
        }

    def get_player(self, player_tag):
        url = f"{self.base_url}/players/%23{player_tag[1:]}"  # %23 is the URL encoding for #
        try:
            response = requests.get(url, headers=self.headers)
            if response.status_code == 200:
                return response.json()
            else:
                print(f"Error: {response.status_code}")
                print(response.text)
        except Exception as e:
            print(f"Error: {e}")
        return None