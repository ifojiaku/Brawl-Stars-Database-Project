import { useState } from 'react'
//import reactLogo from 'Frontend/src/assets/react.svg'
//import viteLogo from '../vite.svg'
import '../App.css'
import { fetchAllPlayers,fetchBrawlerPlayers,fetchPlayer_wins,fetchSPlayerTBs,fetchSPlayerBLG,fetch_playerInfo } from '../supabase/sb_playerInfo'
import {get_AllBwlrPerformance,get_SBwlrPerformance} from '../supabase/sb_brawler'
import { Link } from 'react-router-dom';
import BrawlerPage from '../components/brawler'
import Header from '../components/header'

function SupabaseTest() {
  const [count, setCount] = useState(0)
  const [data, setData] = useState([]);
  const [brawlers,setBrawlers] = useState([]);

  const handleFetch = async () => {
    const result = await fetchAllPlayers();
    if (result){
      setData(result);
      // console.log(result);
    }
  };

  const handleFetchSpecific = async () => {
    const result = await fetchBrawlerPlayers(16000000); //hard coded for shelly rn
    if (result){
      setData(result);
      // console.log(result);
    }
  };
  const handleSinPlayerWins = async () =>{
    const result = await fetchPlayer_wins('01'); //hard coded for one player rn
    if (result){
      setData(result);
      console.log(result);
    }
  };
  const handle_SPlayerTopBS = async () =>{
    // const result = await fetch fetchSPlayerTBs
    const result = await fetchSPlayerTBs('01'); //hard coded for one player rn
    if (result){
      setData(result);
      // console.log(result);
    }
  }
  const handle_SPlyBtlLog = async () =>{
    const result = await fetchSPlayerBLG('01'); //hard coded for one player rn
    if (result){
      setData(result);
      // console.log(result);
    }
  }
  const handle_SPlyInfo = async () =>{
    const result = await fetch_playerInfo('01'); //hard coded for one player rn
    if (result){
      setData(result);
      // console.log(result);
    }
  }
  const handle_AllBrawlerPerf = async () =>{
    const result = await get_AllBwlrPerformance(); 
    if (result){
      setData(result);
      setBrawlers(result);
      // console.log(result);
    }
  }
  
  const handle_SBrawlPerf= async () =>{
    const result = await get_SBwlrPerformance(16000000); //hard coded for one brawler rn
    if (result){
      setData(result);
      // console.log(result);
    }
  }

  return (
    <>
    
      {/* <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div> */}
      <h1>Supabase Test</h1>
      <h2>Player Info</h2>
      <button onClick={handleFetch}>Fetch Data</button>
      <button onClick={handleFetchSpecific}> Fetch Top players per brawler</button>
      <button onClick={handleSinPlayerWins}> Fetch Player's Different Game wins</button>
      <button onClick={handle_SPlayerTopBS}>Fetch Player's top Brawlers</button>
      <button onClick={handle_SPlyBtlLog}>Fetch Player's Battle log</button>
      <button onClick={handle_SPlyInfo}>Fetch Player's Info</button>
      <h2>Brawler info</h2>
      <button onClick={handle_AllBrawlerPerf}>Get Brawler Performance</button>
      <button onClick={handle_SBrawlPerf}>Get Single Brawler Mode Performance </button>
      
      <h3>Results</h3>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{JSON.stringify(item)}</li> 
        ))}
      </ul>

      <h3>Brawlers</h3>
      <button onClick={handle_AllBrawlerPerf}>Load Brawlers</button>
      


      
    </>
  )
}

export default SupabaseTest;
