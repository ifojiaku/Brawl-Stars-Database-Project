import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  fetch_playerInfo,
  fetchPlayer_wins,
  fetchSPlayerTBs,
  fetchSPlayerBLG
} from '../supabase/sb_playerInfo';
import { Link } from 'react-router-dom';

const PlayerPage = () => {
  const { playerTag } = useParams();
  const [playerInfo, setPlayerInfo] = useState(null);
  const [playerWins, setPlayerWins] = useState(null);
  const [topBrawlers, setTopBrawlers] = useState([]);
  const [battleLog, setBattleLog] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const info = await fetch_playerInfo(playerTag);
      setPlayerInfo(info);

      const wins = await fetchPlayer_wins(playerTag);
      setPlayerWins(wins?.[0]); 

      const brawlers = await fetchSPlayerTBs(playerTag, 5);
      setTopBrawlers(brawlers);

      const battles = await fetchSPlayerBLG(playerTag, 5);
      setBattleLog(battles);
    };

    fetchData();
  }, [playerTag]);

  if (!playerInfo) return <div>Loading player data...</div>;

  return (
    <div>
      <h1>{playerInfo[0]?.name}</h1>
      <img
        src={`https://cdn.brawlify.com/profile-icons/regular/${playerInfo[0]?.icon}.png`}
        width={100}
        height={100}
        alt="Profile Icon"
      />
      <p>Tag: {playerInfo[0]?.tag}</p>
      <p>Trophies: {playerInfo[0]?.trophies}</p>
      <p>Highest Trophies: {playerInfo[0]?.highest_trophies}</p>

      {playerWins && (
        <div>
          <h2>Victories</h2>
          <p>Solo: {playerWins.solo_victories}</p>
          <p>Duo: {playerWins.duo_victories}</p>
          <p>3v3: {playerWins['3v3_victories']}</p>
        </div>
      )}

      <div>
        <h2>Top Brawlers</h2>
        <table>
          <thead>
            <tr>
                <th></th>
              <th>Brawler</th>
              <th>Total Battles</th>
              <th>Win Rate (%)</th>
            </tr>
          </thead>
          <tbody>
            {topBrawlers.map((brawler, i) => (
              <tr key={i}>
                <td>
                    <Link to={`/brawler/${brawler.brawler_id}`}>
                        <img src={`https://cdn.brawlify.com/brawlers/borders/${brawler.brawler_id}.png`} width={50} height={50} alt="BrawlerIcon" />
                    </Link>
                    </td>
                    <td>
                        <Link to={`/brawler/${brawler.brawler_id}`}>
                        {brawler.brawler_name}
                        </Link>
                    </td>
                <td>{brawler.total_battles}</td>
                <td>{brawler.win_rate.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2>Recent Battles</h2>
        <table>
          <thead>
            <tr>
              <th>Brawler</th>
              <th>Result</th>
              <th>Trophy Change</th>
              <th>Mode</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {battleLog.map((battle, i) => (
              <tr key={i}>
                <td>{battle.brawler_name}</td>
                <td>{battle.result}</td>
                <td>{battle.trophy_change}</td>
                <td>{battle.mode}</td>
                <td>{new Date(battle.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayerPage;
