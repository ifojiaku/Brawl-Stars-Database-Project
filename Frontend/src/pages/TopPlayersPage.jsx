// On this page we will put the brawlers table that has their icons and that will reroute to their individual pages
import React, { useEffect, useState } from 'react';
// import { get_AllBwlrPerformance } from '../supabase/sb_brawler';
import { Link } from 'react-router-dom';
import { fetch_topP_winrate } from '../supabase/sb_playerInfo';
import '../assets/sam_style.css';


// Changes to db
// Add badgeNum ( ex. "badgeId": 8000023)
// fetch_topP_winrate
const TopPlayersPage = () => {
    const [players, setPlayers] = useState([]);
  
    useEffect(() => {
      async function fetchTopPlayers() {
        try {
          const result = await fetch_topP_winrate();
          if (result) setPlayers(result);
        } catch (err) {
          console.error('Error fetching top players:', err);
        }
      }
      fetchTopPlayers();
    }, []);
  
    return (
      <div className="dark-container">
        <section className="section">
          <h1>Top Players</h1>
          <table className="dark-table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Trophies</th>
                <th>Win Rate</th>
                <th>Battles Played</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p, idx) => (
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
                  <td>{p.trophies}</td>
                  <td>{p.win_rate}%</td>
                  <td>{p.battles_played}</td>
                </tr>
              ))}
              {players.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
                    No players found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    );
  };
  
  export default TopPlayersPage;