// On this page we will put the brawlers table that has their icons and that will reroute to their individual pages
import React, { useEffect, useState } from 'react';
// import { get_AllBwlrPerformance } from '../supabase/sb_brawler';
import { Link } from 'react-router-dom';
import { get_TopClubs_totalTrophies } from '../supabase/sb_club';


// Changes to db
// Add badgeNum ( ex. "badgeId": 8000023)

const AllClubsPage = () =>{
    const [clubs,setClubs] = useState([]);
    
    useEffect(() => {
        const fetch_TopClubs = async () =>{
        try{
            const result = await get_TopClubs_totalTrophies(); 
            if (result){
              setClubs(result);
              console.log(result);
            }
          } catch(err){
            console.error('Error fetching data:', err);
        }
        
    };
    fetch_TopClubs();
    },[]);
    return(
        <>
        <div>
            <h1>Top Clubs</h1>
            <table>
                <thead>
                <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Required Trophies</th>
                    <th>Total Trophies</th>
                    <th># of Members</th>
                </tr>
                </thead>
                <tbody>
                {clubs.map((item, index) => (
                    <tr key={index}>
                    <td>
                    <Link to={`/clubs/${encodeURIComponent(item.club_tag)}`}>
                    <img src={`https://cdn.brawlify.com/club-badges/regular/${item.badgeNum}.png`} width={100} height={100} alt="Club Badge" />
                    </Link>
                    </td>
                    <td>
                        <Link to={`/clubs/${encodeURIComponent(item.club_tag)}`}>
                        {item.name}
                        </Link>
                    </td>
                    <td>{item.type}</td>
                    <td>{item.required_trophies}</td>
                    <td>{item.total_trophies}</td>
                    <td>{item.member_count}</td>
                    </tr>
                ))}
                </tbody>
            </table>
    </div>
        </>
    );
};

export default AllClubsPage;