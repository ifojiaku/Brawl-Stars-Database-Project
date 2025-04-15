
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {get_clubInfo,get_allclubmembers} from '../supabase/sb_club';
import { Link } from 'react-router-dom';

// import { get_SBwlrPerformance } from '../supabase/sb_brawler';
// import { fetchBrawlerPlayers } from '../supabase/sb_playerInfo';


const ClubPage = () => {
  const [extraData, setExtraData] = useState();
  const [members, setMembers] = useState([]);

  const { clubTag } = useParams();


  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const result = await get_clubInfo(parseInt(clubTag));
        setExtraData(result);
        console.log(result);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
  
    const fetchclubMembers = async () => {
      try {
        const result = await get_allclubmembers(parseInt(clubTag));
        setMembers(result);
        console.log(result);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
  
    fetchData();
    fetchclubMembers();
  }, []);

  if (!extraData || !members) return <div>Loading...</div>;

  return (
    <div>
      <div>
        <img src={`https://cdn.brawlify.com/club-badges/regular/${extraData[0]?.badgeNum}.png`} width={200} height={200} alt="BrawlerIcon" />
        <h1>Club: {extraData[0]?.name}</h1>
      </div>
      <div>
        <h2>{extraData[0]?.description}</h2>
        <h3>Type of club: {extraData[0]?.type}</h3>
        <h3>Required Trophies: {extraData[0]?.required_trophies}</h3>
        <h3>Total Trophies: {extraData[0]?.total_trophies}</h3>
        <h3>Number of members: {extraData[0]?.member_count}</h3>
      </div>
    
      
      <div>
        <h2>Top Players</h2>
        <table>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {members.map((item, index) => (
            <tr key={index}>
              <td>
                <Link to={`/players/${item.tag}`}>
                  <img src={`https://cdn.brawlify.com/profile-icons/regular/${item.icon}.png`} width={100} height={100} alt="icon" />
                  </Link>
                </td>
                <td>
                <Link to={`/players/${item.tag}`}>{item.name}
                </Link>
                </td>
              <td>{item.role}</td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClubPage;
