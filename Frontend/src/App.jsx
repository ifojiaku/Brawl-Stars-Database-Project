import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { fetchAllPlayers,fetchPlayerSpecific,fetchPlayer_wins } from './supabase/sb_playerInfo'

function App() {
  const [count, setCount] = useState(0)
  const [data, setData] = useState([]);

  const handleFetch = async () => {
    const result = await fetchAllPlayers();
    if (result){
      setData(result);
      // console.log(result);
    }
  };

  const handleFetchSpecific = async () => {
    const result = await fetchPlayerSpecific(16000000); //hard coded for shelly rn
    if (result){
      setData(result);
      // console.log(result);
    }
  };
  const handleSinPlayerWins = async () =>{
    const result = await fetchPlayer_wins('#L2CQPQ2U8'); //hard coded for one player rn
    if (result){
      setData(result);
      console.log(result);
    }
  };

  return (
    <>
      <div>
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
      </div>
      <h1>Supabase Test</h1>
      <button onClick={handleFetch}>Fetch Data</button>
      <button onClick={handleFetchSpecific}> Fetch Specific</button>
      <button onClick={handleSinPlayerWins}> Fetch Player's Different Game wins</button>
      <button onClick={handle_SPlayerTopBS}>Fetch Player's top Brawlers</button>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{JSON.stringify(item)}</li> // Show full data structure
        ))}
      </ul>
      
    </>
  )
}

export default App
