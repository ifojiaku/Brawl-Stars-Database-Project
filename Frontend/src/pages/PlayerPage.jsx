import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  fetch_playerInfo,
  fetchPlayer_wins,
  fetchSPlayerTBs,
  fetchSPlayerBLG
} from '../supabase/sb_playerInfo';
import { Link } from 'react-router-dom';
import "../assets/sam_style.css";


const PlayerPage = () => {
  const { playerTag: encodedTag } = useParams();
  const playerTag = decodeURIComponent(encodedTag);
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

  if (!playerInfo) return <div className="dark-container">Loading player data...</div>;

  const p = playerInfo[0];
  return (
    <div className="dark-container">
      <div className="player-card">
        <img
          src={`https://cdn.brawlify.com/profile-icons/regular/${p.icon}.png`}
          width={100}
          height={100}
          alt="Profile Icon"
        />
        <div>
          <h1>{p.name}</h1>
          <p>Tag: {p.tag}</p>
          <p>Trophies: {p.trophies}</p>
          <p>Highest: {p.highest_trophies}</p>
        </div>
      </div>

      <section className="section">
        <h2>Victories</h2>
        <p>Solo: {p.solo_victories}</p>
        <p>Duo: {p.duo_victories}</p>
        <p>3v3: {p['3v3_victories']}</p>
      </section>

      <section className="section">
        <h2>Top Brawlers</h2>
        <table className="dark-table">
          <thead>
            <tr>
              <th></th>
              <th>Brawler</th>
              <th>Total Battles</th>
              <th>Win Rate (%)</th>
            </tr>
          </thead>
          <tbody>
            {topBrawlers.map((b, i) => (
              <tr key={i}>
                <td>
                  <Link to={`/brawler/${b.brawler_id}`} className="dark-link">
                    <img
                      src={`https://cdn.brawlify.com/brawlers/borders/${b.brawler_id}.png`}
                      width={50}
                      height={50}
                      alt="Icon"
                      className="dark-icon"
                    />
                  </Link>
                </td>
                <td>
                  <Link to={`/brawler/${b.brawler_id}`} className="dark-link">
                    {b.brawler_name}
                  </Link>
                </td>
                <td>{b.total_battles}</td>
                <td>{b.win_rate.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="section">
        <h2>Recent Battles</h2>
        <table className="dark-table">
          <thead>
            <tr>
              <th>Brawler</th>
              <th>Result</th>
              <th>Trophy Δ</th>
              <th>Mode</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {battleLog.map((b, i) => (
              <tr key={i}>
                <td>{b.name}</td>
                <td>{b.result}</td>
                <td>{b.trophy_change}</td>
                <td>{b.mode}</td>
                <td>{new Date(b.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default PlayerPage;