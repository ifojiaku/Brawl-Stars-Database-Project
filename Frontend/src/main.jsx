import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BrawlerPage from './components/brawler'
import AllBrawlersPage from './pages/AllBrawlersPage.jsx';
import ClubPage from './pages/clubPage.jsx';
import AllClubsPage from './pages/AllClubsPage.jsx';
import TopPlayersPage from './pages/TopPlayersPage.jsx';
import PlayerPage from './pages/PlayerPage.jsx';
import Header from './components/header'
import SearchPage from './pages/searchPage.jsx';
import SupabaseTest from './pages/SupabaseTest.jsx';
import AdminPage from './pages/adminPage.jsx';
import BrawlerBalancePage from './pages/brawlerBalance.jsx';

// When generating links/navigation:
// const encodedTag = encodeURIComponent(playerTag); // converts # to %23
// <Link to={`/player/${encodedTag}`}>View Player</Link>

// // In your router:
// <Route path="/player/:tag" component={PlayerProfile} />

// // In your component:
// const PlayerProfile = ({ match }) => {
//   const playerTag = decodeURIComponent(match.params.tag); // converts %23 back to #
//   // use playerTag to fetch data
// }
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/brawler/:brawlerId" element={<BrawlerPage />} />
        <Route path="/brawler" element={<AllBrawlersPage/>}/>
        <Route path="/clubs/:clubTag" element={<ClubPage/>}/>
        <Route path="/clubs" element={<AllClubsPage/>}/>
        <Route path="/players" element={<TopPlayersPage/>}/> 
        <Route path="/players/:playerTag" element={<PlayerPage />} />
        <Route path="/search" element={<SearchPage/>}/>
        <Route path="/supabasetest" element={<SupabaseTest/>}/>
        <Route path="/admin" element={<AdminPage/>}/>
        <Route path="/balance" element={<BrawlerBalancePage/>}/>
      </Routes>
    </Router>
  </StrictMode>,
)
