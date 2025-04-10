import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BrawlerPage from './components/brawler'
import AllBrawlersPage from './pages/AllBrawlersPage.jsx';
import ClubPage from './pages/clubPage.jsx';
import AllClubsPage from './pages/AllClubsPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/brawler/:brawlerId" element={<BrawlerPage />} />
        <Route path="/brawler" element={<AllBrawlersPage/>}/>
        <Route path="/clubs/:clubTag" element={<ClubPage/>}/>
        <Route path="/clubs" element={<AllClubsPage/>}/>
      </Routes>
    </Router>
  </StrictMode>,
)
