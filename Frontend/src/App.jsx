import './App.css'
import image from './assets/brawlstars_main.png'


function App() {
  return (
    <div>
      <img src = {image}/>
      <h1>BrawlStars Stats</h1>
      <p>Looking for current player stats for BrawlStars? 
        Navigate through the tabs above to search BrawlStars API for stats on players, brawlers, and games!</p>
    </div>
  )
}

export default App;