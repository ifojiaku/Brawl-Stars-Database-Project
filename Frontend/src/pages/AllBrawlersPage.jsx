// On this page we will put the brawlers table that has their icons and that will reroute to their individual pages
import React, { useEffect, useState } from 'react';
import { get_AllBwlrPerformance } from '../supabase/sb_brawler';
import { Link } from 'react-router-dom';
import '../assets/sam_style.css';

const AllBrawlersPage = () => {
    const [brawlers, setBrawlers] = useState([]);
  
    useEffect(() => {
      async function fetchAllBrawlers() {
        try {
          const result = await get_AllBwlrPerformance();
          if (result) setBrawlers(result);
        } catch (err) {
          console.error('Error fetching brawlers:', err);
        }
      }
      fetchAllBrawlers();
    }, []);
  
    return (
      <div className="dark-container">
        <section className="section">
          <h1>Brawlers</h1>
          <table className="dark-table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Usage Count</th>
                <th>Overall Win Rate</th>
              </tr>
            </thead>
            <tbody>
              {brawlers.map((b, idx) => (
                <tr key={idx}>
                  <td>
                    <Link to={`/brawler/${b.brawler_id}`} className="dark-link">
                      <img
                        src={`https://cdn.brawlify.com/brawlers/borders/${b.brawler_id}.png`}
                        width={48}
                        height={48}
                        alt="Brawler Icon"
                        className="dark-icon"
                      />
                    </Link>
                  </td>
                  <td>
                    <Link to={`/brawler/${b.brawler_id}`} className="dark-link">
                      {b.name}
                    </Link>
                  </td>
                  <td>{b.usage_count}</td>
                  <td>{b.win_rate}%</td>
                </tr>
              ))}
              {brawlers.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
                    No brawlers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    );
  };
  
  export default AllBrawlersPage;