
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {get_clubInfo,get_allclubmembers} from '../supabase/sb_club';
import { Link } from 'react-router-dom';
// import "../assets/sam_style.css";
import '../assets/sam_style.css';

// import { get_SBwlrPerformance } from '../supabase/sb_brawler';
// import { fetchBrawlerPlayers } from '../supabase/sb_playerInfo';


const ClubPage = () => {
  const { clubTag: encodedTag } = useParams();
  const clubTag = decodeURIComponent(encodedTag);
  const [info, setInfo] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    async function fetchClub() {
      const data = await get_clubInfo(clubTag);
      setInfo(data[0]);
      const mems = await get_allclubmembers(clubTag);
      setMembers(mems);
    }
    fetchClub();
  }, [clubTag]);

  if (!info) return <div className="dark-container">Loading...</div>;

  return (
    <div className="dark-container">
      <div className="player-card">
        <img
          src={`https://cdn.brawlify.com/club-badges/regular/${info.badgeNum}.png`}
          width={200}
          height={200}
          alt="Badge"
        />
        <div>
          <h1>Club: {info.name}</h1>
          <p>Tag: {clubTag}</p>
          <p>{info.description}</p>
          <p>Type: {info.type}</p>
          <p>Required Trophies: {info.required_trophies}</p>
          <p>Total Trophies: {info.total_trophies}</p>
          <p>Members: {info.member_count}</p>
        </div>
      </div>

      <section className="section">
        <h2>Top Players</h2>
        <table className="dark-table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m, i) => (
              <tr key={i}>
                <td>
                  <Link to={`/players/${encodeURIComponent(m.player_tag)}`} className="dark-link">
                    <img
                      src={`https://cdn.brawlify.com/profile-icons/regular/${m.icon}.png`}
                      width={48}
                      height={48}
                      alt="Icon"
                      className="dark-icon"
                    />
                  </Link>
                </td>
                <td>
                  <Link to={`/players/${encodeURIComponent(m.player_tag)}`} className="dark-link">
                    {m.name}
                  </Link>
                </td>
                <td>{m.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ClubPage;
