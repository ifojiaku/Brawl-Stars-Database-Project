// On this page we will put the brawlers table that has their icons and that will reroute to their individual pages
import React, { useEffect, useState } from 'react';
// import { get_AllBwlrPerformance } from '../supabase/sb_brawler';
import { Link } from 'react-router-dom';
import { fetch_topP_winrate } from '../supabase/sb_playerInfo';


// Changes to db
// Add badgeNum ( ex. "badgeId": 8000023)
// fetch_topP_winrate
const TopPlayersPage = () =>{
    const [players,setPlayers] = useState([]);
    
    useEffect(() => {
        const fetch_TopPlayers = async () =>{
        try{
            const result = await fetch_topP_winrate(); 
            if (result){
              setPlayers(result);
              console.log(result);
            }
          } catch(err){
            console.error('Error fetching data:', err);
        }
        
    };
    fetch_TopPlayers();
    },[]);
    return(
        <>
        <div>
            <h1>Top Players</h1>
            <table>
                <thead>
                <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Required Trophies</th>
                    <th>Total Trophies</th>
                    {/* <th># of Members</th> */}
                </tr>
                </thead>
                <tbody>
                {players.map((item, index) => (
                    <tr key={index}>
                    <td>
                    <Link to={`/players/${encodeURIComponent(item.tag)}`}>
                    <img src={`https://cdn.brawlify.com/profile-icons/regular/${item.icon}.png`} width={100} height={100} alt="Player Icon" />
                    </Link>
                    </td>
                    <td>
                    <Link to={`/players/${encodeURIComponent(item.tag)}`}>{item.name}</Link>
                    </td>
                    <td>{item.trophies}</td>
                    <td>{item.win_rate}</td>
                    <td>{item.battles_played}</td>
                    {/* <td>{item.member_count}</td> */}
                    </tr>
                ))}
                </tbody>
            </table>
    </div>
        </>
    );
};

export default TopPlayersPage;