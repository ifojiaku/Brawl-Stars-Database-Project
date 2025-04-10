// On this page we will put the brawlers table that has their icons and that will reroute to their individual pages
import React, { useEffect, useState } from 'react';
import { get_AllBwlrPerformance } from '../supabase/sb_brawler';
import { Link } from 'react-router-dom';

const AllBrawlersPage = () =>{
    const [brawlers,setBrawlers] = useState([]);
    
    useEffect(() => {
        const fetch_AllBrawlerPerf = async () =>{
        try{
            const result = await get_AllBwlrPerformance(); 
            if (result){
              setBrawlers(result);
              console.log(result);
            }
          } catch(err){
            console.error('Error fetching data:', err);
        }
        
    };
    fetch_AllBrawlerPerf();
    },[]);
    return(
        <>
        <div>
            <h1>Brawlers</h1>
            <table>
                <thead>
                <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Usage Count</th>
                    <th>Overall Win Rate</th>
                </tr>
                </thead>
                <tbody>
                {brawlers.map((item, index) => (
                    <tr key={index}>
                    <td>
                    <img src={`https://cdn.brawlify.com/brawlers/borders/${item.brawler_id}.png`} width={100} height={100} alt="BrawlerIcon" />
                    </td>
                    <td>
                        <Link to={`/brawler/${item.brawler_id}`}>
                        {item.name}
                        </Link>
                    </td>
                    <td>{item.usage_count}</td>
                    <td>{item.win_rate}%</td>
                    </tr>
                ))}
                </tbody>
            </table>
    </div>
        </>
    );
};

export default AllBrawlersPage;