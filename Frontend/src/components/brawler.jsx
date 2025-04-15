
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { get_SBwlrPerformance } from '../supabase/sb_brawler';
import { fetchBrawlerPlayers } from '../supabase/sb_playerInfo';
import { Link } from 'react-router-dom';


const BrawlerPage = ({ initialData }) => {
  const [extraData, setExtraData] = useState([]);
  const [topPlayers, setTopPlayers] = useState([]);

  const { brawlerId } = useParams();


  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const result = await get_SBwlrPerformance(parseInt(brawlerId));
        setExtraData(result);
        console.log(result);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
  
    const fetchTopPlayers = async () => {
      try {
        const result = await fetchBrawlerPlayers(parseInt(brawlerId));
        setTopPlayers(result);
        console.log(result);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
  
    fetchData();
    fetchTopPlayers();
  }, [brawlerId]);
  // dependency array REALLY important so it doesnt keep calling it...over..and over...
  // accidentally made 15,000 calls to the api 

//   if (!extraData) return <div>Loading...</div>;

  return (
    <div>
      <div>
        <img src={`https://cdn.brawlify.com/brawlers/borders/${brawlerId}.png`} width={200} height={200} alt="BrawlerIcon" />
        <h1>Brawler: {extraData[0]?.name}</h1>
      </div>
      <div>
        <h2>Best Modes</h2>
        <ul>
          {extraData.map((item, index) => (
            <li key={index}>Mode: {item.mode} Win Rate:{item.mode_win_rate}% </li> 
          ))}
        </ul>
      </div>
    
      
      {topPlayers?.length > 0 && (
      <div>
        <h2>Top Players</h2>
        <table>
          <thead>
            <tr>
              <th>Icon</th>
              <th>Name</th>
              <th>Brawler Trophies</th>
              <th>Win Rate</th>
              <th>Battles Played</th>
            </tr>
          </thead>
          <tbody>
            {topPlayers.map((item, index) => (
              <tr key={index}>
                <td>
                <Link to={`/players/${item.tag}`}>
                  <img src={`https://cdn.brawlify.com/profile-icons/regular/${item.icon}.png`} width={100} height={100} alt="icon" />
                  </Link>
                </td>
                <Link to={`/players/${item.tag}`}>
                <td>{item.name}</td>
              </Link>
                
                <td>{item.brawler_trophies}</td>
                <td>{item.brawler_win_rate}%</td>
                <td>{item.battles_played}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    </div>
  );
};

export default BrawlerPage;
