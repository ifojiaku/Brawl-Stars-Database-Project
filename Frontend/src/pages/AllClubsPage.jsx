// On this page we will put the brawlers table that has their icons and that will reroute to their individual pages
import React, { useEffect, useState } from 'react';
// import { get_AllBwlrPerformance } from '../supabase/sb_brawler';
import { Link } from 'react-router-dom';
import { get_TopClubs_totalTrophies } from '../supabase/sb_club';
import '../assets/sam_style.css';


// Changes to db
// Add badgeNum ( ex. "badgeId": 8000023)


const AllClubsPage = () => {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    async function fetchTopClubs() {
      try {
        const result = await get_TopClubs_totalTrophies();
        if (result) setClubs(result);
      } catch (err) {
        console.error('Error fetching top clubs:', err);
      }
    }
    fetchTopClubs();
  }, []);

  return (
    <div className="dark-container">
      <section className="section">
        <h1>Top Clubs</h1>
        <table className="dark-table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Type</th>
              <th>Required Trophies</th>
              <th>Total Trophies</th>
              <th>Members</th>
            </tr>
          </thead>
          <tbody>
            {clubs.map((club, idx) => (
              <tr key={idx}>
                <td>
                  <Link to={`/clubs/${encodeURIComponent(club.club_tag)}`} className="dark-link">
                    <img
                      src={`https://cdn.brawlify.com/club-badges/regular/${club.badgeNum}.png`}
                      width={50}
                      height={50}
                      alt="Club Badge"
                      className="dark-icon"
                    />
                  </Link>
                </td>
                <td>
                  <Link to={`/clubs/${encodeURIComponent(club.club_tag)}`} className="dark-link">
                    {club.name}
                  </Link>
                </td>
                <td>{club.type}</td>
                <td>{club.required_trophies}</td>
                <td>{club.total_trophies}</td>
                <td>{club.member_count}</td>
              </tr>
            ))}
            {clubs.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
                  No clubs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AllClubsPage;
