import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BrawlerPage from './components/brawler'
import AllBrawlersPage from './pages/AllBrawlersPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/brawler/:brawlerId" element={<BrawlerPage />} />
        <Route path="/brawler" element={<AllBrawlersPage/>}/>
      </Routes>
    </Router>
  </StrictMode>,
)
