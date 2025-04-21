from supabase import create_client, Client
from dotenv import load_dotenv
import os
from datetime import datetime
from brawlstars_api import BrawlStarsClient

class SupabaseConnection:
    def __init__(self):
        load_dotenv()

        self.url = os.getenv('SUPABASE_URL')
        if not self.url:
            raise ValueError("SUPABASE_URL not found in environment variables")

        self.key = os.getenv('SUPABASE_KEY')
        if not self.key:
            raise ValueError("SUPABASE_KEY not found in environment variables")

        # creating the client
        self.supabase: Client = create_client(self.url, self.key)

        self.bsClient = BrawlStarsClient()

    def insert_data(self, table_name: str, data: dict):
        """
        Insert data into a specified table.
        """
        # response = self.supabase.table(table_name).insert(data).execute()
        # return response
        pass
    

    def insert_player(self, player_data):
        if not player_data:
            print("No player data provided.")
            return

        player_tag = player_data.get("tag")
        filtered_player_data = {
            "tag": player_tag,
            "name": player_data.get("name"),
            "trophies": player_data.get("trophies"),
            "highest_trophies": player_data.get("highestTrophies"),
            "icon": player_data.get("icon", {}).get("id")
        }

        player_victories = {
            "tag": player_tag,
            "solo_victories": player_data.get("soloVictories"),
            "duo_victories": player_data.get("duoVictories"),
            "3v3_victories": player_data.get("3vs3Victories")
        }

        # Checking if player already exists and if they already exist, update their tables
        existing = self.supabase.table("player").select("tag").eq("tag", player_tag).execute()
        if existing.data:
            print(f"Player {player_tag} already exists, updating...")
            # Update existing player
            self.supabase.table("player").update(filtered_player_data).eq("tag", player_tag).execute()
            self.supabase.table("player_victories").update(player_victories).eq("tag", player_tag).execute()
        else:
            print(f"Inserting new player {player_tag}...")
            self.supabase.table("player").insert(filtered_player_data).execute()
            self.supabase.table("player_victories").insert(player_victories).execute()

        # Update or insert player brawlers into the table
        brawlers = player_data.get("brawlers", [])
        print(f"\nOwned Brawlers: {len(brawlers)}")
        for brawler in brawlers:
            # print(f"- {brawler['name']}: Power {brawler['power']}, Trophies: {brawler['trophies']}")
            # dont need to print all of them
            brawler_entry = {
                "player_tag": player_tag,
                "brawler_id": brawler["id"],
                "trophies": brawler["trophies"],
                "highest_trophies": brawler["highestTrophies"],
                "rank": brawler["rank"],
                "power": brawler["power"]
            }


            # deleting to get rid of conflict
            self.supabase.table("players_brawler") \
            .delete().eq("player_tag", player_tag).eq("brawler_id", brawler["id"]).execute()

            # Insert new/updated entry
            self.supabase.table("players_brawler").insert(brawler_entry).execute()


    def get_battle_id_for_player(self,battle_data, player_tag):
        for team in battle_data.get("teams", []):
            for player in team:
                if player.get("tag") == player_tag:
                    print("Found battle id")
                    return player["brawler"]["id"]
        print("Did not find battle id")
        return None


    def insert_player_battles(self, player_tag: str, battle_log: dict):
        if "items" not in battle_log:
            print("Invalid battle log format.")
            return

        # f = open("playerTags.txt", "a")

        for battle_entry in battle_log["items"]:
            battle_time_str = battle_entry.get("battleTime")
            event = battle_entry.get("event", {})
            battle = battle_entry.get("battle", {})

            if not battle_time_str:
                continue

            # Convert to datetime and ISO format for the supabase formatting
            parsed_time = datetime.strptime(battle_time_str, "%Y%m%dT%H%M%S.000Z")
            iso_time = parsed_time.isoformat() + "Z"

            # Check if battle already exists, if so we just continue
            existing = self.supabase.table("battles") \
                .select("battle_id") \
                .eq("date", iso_time) \
                .eq("map", event.get("map")) \
                .eq("mode", event.get("mode")) \
                .eq("type", battle.get("type")) \
                .execute()

            if existing.data:
                print("Duplicate battle detected. Skipping.")
                continue

            # data that will be inserted into the table
            base_battle_data = {
                "date": iso_time,
                "map": event.get("map"),
                "mode": battle.get("mode"),
                "type": battle.get("type"),
                "duration": battle.get("duration")
            }

            insert_response = self.supabase.table("battles") \
                .insert(base_battle_data) \
                .execute()
            # if insert_response.error:
            #     print("Insert error:", insert_response.error)
            #     return

            battle_id = insert_response.data[0]["battle_id"]


            # extracting brawler id for the player to input into player's personal battles_player
            brawler_id = self.get_battle_id_for_player(battle, player_tag)

            # inserting into battles_player
            player_battle_data = {
                "player_tag": player_tag, 
                "battle_id": battle_id,
                "brawler_id": brawler_id,
                "result": battle.get("result"),
                "trophy_change": battle.get("trophyChange", None)  # Optional might not be included for unranked
            }

            resp = self.supabase.table("battles_player").insert(player_battle_data).execute()
            # if resp.error:
            #     print("Error inserting player battle:", resp.error)
            # else:
            #     print(f"Inserted player battle for {player_tag} in battle {battle_id}")

            # could maayyybe do for each player from here but might add their names to a queue to at call some point
            # as it stands might be an issue due to foreign key in our table 
            
            with open("playerTags.txt", "a") as f:
                for team_num,team in enumerate(battle.get("teams",[]),start=1):
                    for player in team:
                        if (player.get("tag") != player_tag):
                            f.write(player.get("tag")+"\n")
                # "result": battle.get("result"),

            # for team_num, team in enumerate(battle.get("teams", []), start=1):
            #     for player in team:
            #         battle_data = {
            #             "battle_time": battle_time,
            #             "player_tag": player.get("tag"),
            #             "player_name": player.get("name"),
            #             "brawler_id": player["brawler"]["id"],
            #             "brawler_name": player["brawler"]["name"],
            #             "brawler_power": player["brawler"]["power"],
            #             "brawler_trophies": player["brawler"]["trophies"],
            #             "team": team_num
            #         }
            #         self.supabase.table("battle_players").insert(player_data).execute()


            # and input into battles player 
    def attempt_two(self, player_tag: str, battle_log: dict):
        if "items" not in battle_log:
            print("Invalid battle log format.")
            return

        for battle_entry in battle_log["items"]:
            battle_time_str = battle_entry.get("battleTime")
            event = battle_entry.get("event", {})
            battle = battle_entry.get("battle", {})

            if not battle_time_str:
                continue

            # Convert to datetime and ISO format for PostgreSQL
            parsed_time = datetime.strptime(battle_time_str, "%Y%m%dT%H%M%S.000Z")
            iso_time = parsed_time.isoformat() + "Z"

            # Skip if we’ve already logged this battle
            exists = (
                self.supabase
                    .table("battles")
                    .select("battle_id")
                    .eq("date", iso_time)
                    .eq("map", event.get("map"))
                    .eq("mode", event.get("mode"))
                    .eq("type", battle.get("type"))
                    .execute()
            )
            if exists.data:
                print("Duplicate battle detected. Skipping.")
                continue

            # figure out which brawler the player used
            brawler_id = self.get_battle_id_for_player(battle, player_tag)

            # prepare all params for the RPC
            rpc_params = {
                "p_date":          iso_time,
                "p_map":           event.get("map"),
                "p_mode":          battle.get("mode"),
                "p_type":          battle.get("type"),
                "p_duration":      battle.get("duration"),
                "p_player_tag":    player_tag,
                "p_brawler_id":    brawler_id,
                "p_result":        battle.get("result"),
                "p_trophy_change": battle.get("trophyChange", 0),
            }

            # call the atomic function
            rpc_resp = (
                self.supabase
                    .rpc("insert_battle_and_player", rpc_params)
                    .execute()
            )

            # if rpc_resp.error:
            #     print("Atomic insert failed:", rpc_resp.error)
            #     continue

            # rpc_resp.data is a list like [<new_battle_id>]
            new_battle_id = rpc_resp.data[0]
            print(f"Inserted battle {new_battle_id} and player {player_tag} in one atomic call.")

    def upsert_club_and_members(self, club_info: dict):
        """
        Upserts club info and processes all members using insert_player
        """
        # Insertin club data into the db with rpc
        resp = self.supabase.rpc(
            "insert_club_and_members",
            { "club_data": club_info }
        ).execute()

        # if resp.error:
        #     print("RPC Error:", resp.error)
        #     return False
       
        return True







# Example usage and testing purposes
if __name__ == "__main__":
    db = SupabaseConnection()

    example_player_data = {
    "tag": "#PL2RJGRCY",
    "name": "FAKEPLAYER4",
    "icon": {
    "id": 28000642
    },
    "trophies": 73724,
    "highestTrophies": 73727,
    "expLevel": 242,
    "expPoints": 300878,
    "3vs3Victories": 13844,
    "soloVictories": 1795,
    "duoVictories": 1577,
    "club": {
        "tag": "#2UQ08UPGR",
        "name": "TheGoats"
    },
    "brawlers": [
        {
            "id": 16000000,
            "name": "SHELLY",
            "power": 11,
            "rank": 51,
            "trophies": 1000,
            "highestTrophies": 1010,
            "gears": [
                {"id": 62000000, "name": "SPEED", "level": 3},
                {"id": 62000004, "name": "SHIELD", "level": 3}
            ],
            "starPowers": [
                {"id": 23000135, "name": "BAND-AID"}
            ],
            "gadgets": [
                {"id": 23000255, "name": "FAST FORWARD"},
                {"id": 23000288, "name": "CLAY PIGEONS"}
            ]
        },
        {
            "id": 16000001,
            "name": "COLT",
            "power": 11,
            "rank": 51,
            "trophies": 1000,
            "highestTrophies": 1002,
            "gears": [
                {"id": 62000002, "name": "DAMAGE", "level": 3},
                {"id": 62000003, "name": "HEALTH", "level": 3}
            ],
            "starPowers": [
                {"id": 23000136, "name": "SLICK BOOTS"}
            ],
            "gadgets": [
                {"id": 23000256, "name": "SPEEDLOADER"},
                {"id": 23000289, "name": "SILVER BULLET"}
            ]
        }
    ]
}

    battlelog={
  "items": [
    {
      "battleTime": "20250414T154301.000Z",
      "event": {
        "id": 15000321,
        "mode": "gemGrab",
        "map": "Crystal Arcade"
      },
      "battle": {
        "mode": "gemGrab",
        "type": "ranked",
        "result": "victory",
        "duration": 180,
        "trophyChange": 9,
        "starPlayer": {
          "tag": "#FAKE",
          "name": "Bot Alpha",
          "brawler": {
            "id": 16000020,
            "name": "JESSIE",
            "power": 9,
            "trophies": 402
          }
        },
        "teams": [
          [
            {
              "tag": "#FAKE",
              "name": "Bot Alpha",
              "brawler": {
                "id": 16000020,
                "name": "JESSIE",
                "power": 9,
                "trophies": 402
              }
            },
            {
              "tag": "#B12345678",
              "name": "TruePlayer",
              "brawler": {
                "id": 16000034,
                "name": "MAX",
                "power": 10,
                "trophies": 570
              }
            },
            {
              "tag": "#C87654321",
              "name": "Speedy",
              "brawler": {
                "id": 16000004,
                "name": "BROCK",
                "power": 8,
                "trophies": 490
              }
            }
          ],
          [
            {
              "tag": "#E9A1B2C3",
              "name": "BrawlerFan",
              "brawler": {
                "id": 16000005,
                "name": "DYNAMIKE",
                "power": 7,
                "trophies": 510
              }
            },
            {
              "tag": "#D0E0F0G0",
              "name": "Sneaky",
              "brawler": {
                "id": 16000007,
                "name": "BO",
                "power": 9,
                "trophies": 498
              }
            },
            {
              "tag": "#H1I2J3K4",
              "name": "ZapZap",
              "brawler": {
                "id": 16000030,
                "name": "SURGE",
                "power": 11,
                "trophies": 550
              }
            }
          ]
        ]
      }
    },
    {
      "battleTime": "20250415T112211.000Z",
      "event": {
        "id": 15000088,
        "mode": "duoShowdown",
        "map": "Scorched Stone"
      },
      "battle": {
        "mode": "duoShowdown",
        "type": "ranked",
        "result": "defeat",
        "duration": 146,
        "trophyChange": -6,
        "starPlayer": {
          "tag": "#FAKE",
          "name": "Bot Beta",
          "brawler": {
            "id": 16000024,
            "name": "LEON",
            "power": 10,
            "trophies": 560
          }
        },
        "teams": [
          [
            {
              "tag": "#FAKE",
              "name": "Bot Beta",
              "brawler": {
                "id": 16000024,
                "name": "LEON",
                "power": 10,
                "trophies": 560
              }
            },
            {
              "tag": "#REALTAG99",
              "name": "Shadow",
              "brawler": {
                "id": 16000002,
                "name": "SHELLY",
                "power": 8,
                "trophies": 450
              }
            }
          ],
          [
            {
              "tag": "#TGTGTGTG",
              "name": "Destroyer",
              "brawler": {
                "id": 16000023,
                "name": "CROW",
                "power": 10,
                "trophies": 600
              }
            },
            {
              "tag": "#LOLOL999",
              "name": "NoMercy",
              "brawler": {
                "id": 16000011,
                "name": "CARL",
                "power": 9,
                "trophies": 540
              }
            }
          ]
        ]
      }
    }
  ]
}

    # result = db.insert_player(example_player_data)
    # result2 = db.insert_player_battles("#FAKE",battlelog)
    # print(result)
    # print(result2)
    # result3 = db.attempt_two('#FAKE',battlelog)
    
