import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { get_SBwlrPerformance, fetchBrawlerItems } from '../supabase/sb_brawler';
import { fetchBrawlerPlayers } from '../supabase/sb_playerInfo';
import { Link } from 'react-router-dom';
import '../assets/sam_style.css'

const BrawlerPage = () => {
  const [performance, setPerformance] = useState([]);
  const [topPlayers, setTopPlayers] = useState([]);
  const [brawlerItems, setBrawlerItems] = useState([]);
  const { brawlerId } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const perf = await get_SBwlrPerformance(parseInt(brawlerId));
        setPerformance(perf);
      } catch (err) {
        console.error('Error fetching brawler performance:', err);
      }

      try {
        const players = await fetchBrawlerPlayers(parseInt(brawlerId));
        setTopPlayers(players);
      } catch (err) {
        console.error('Error fetching top players:', err);
      }

      try {
        const items = await fetchBrawlerItems(parseInt(brawlerId));
        setBrawlerItems(items);
      } catch (err) {
        console.error('Error fetching brawler items:', err);
      }
    }
    fetchData();
  }, [brawlerId]);

  return (
    <div className="dark-container">
      {/* Header */}
      <div className="player-card">
        <img
          src={`https://cdn.brawlify.com/brawlers/borders/${brawlerId}.png`}
          width={200}
          height={200}
          alt="Brawler Icon"
        />
        <div>
          <h1>Brawler: {performance[0]?.name || 'Loading...'}</h1>
        </div>
      </div>

      {/* Best Modes */}
      <section className="section">
        <h2>Best Modes</h2>
        <ul className="mode-list">
          {performance.map((mode, idx) => (
            <li key={idx} className="mode-item">
              <div><strong>Mode:</strong> {mode.mode}</div>
              <div><strong>Win Rate:</strong> {mode.mode_win_rate}%</div>
            </li>
          ))}
        </ul>
      </section>

      {/* Star Powers / Gadgets */}
      {brawlerItems.length > 0 && (
        <section className="section">
          <h2>Star Powers & Gadgets</h2>
          <ul className="item-grid">
            {brawlerItems.map((item, idx) => (
              <li key={idx} className="item-card">
                <h3>{item.name}</h3>
                <p><em>Type:</em> {item.item_type}</p>
                <p>{item.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Top Players */}
      {topPlayers.length > 0 && (
        <section className="section">
          <h2>Top Players</h2>
          <table className="dark-table">
            <thead>
              <tr>
                <th>Icon</th>
                <th>Name</th>
                <th>Trophies</th>
                <th>Win Rate</th>
                <th>Battles</th>
              </tr>
            </thead>
            <tbody>
              {topPlayers.map((p, idx) => (
                <tr key={idx}>
                  <td>
                    <Link to={`/players/${encodeURIComponent(p.tag)}`} className="dark-link">
                      <img
                        src={`https://cdn.brawlify.com/profile-icons/regular/${p.icon}.png`}
                        width={48}
                        height={48}
                        alt="Player Icon"
                        className="dark-icon"
                      />
                    </Link>
                  </td>
                  <td>
                    <Link to={`/players/${encodeURIComponent(p.tag)}`} className="dark-link">
                      {p.name}
                    </Link>
                  </td>
                  <td>{p.brawler_trophies}</td>
                  <td>{p.brawler_win_rate}%</td>
                  <td>{p.battles_played}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
};

export default BrawlerPage;
