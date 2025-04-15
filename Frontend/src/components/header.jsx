import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={styles.header}>
      <nav style={styles.nav}>
        <Link to="/brawler" style={styles.link}>Brawlers</Link>
        <Link to="/clubs" style={styles.link}>Top Clubs</Link>
        <Link to="/players" style={styles.link}>Players</Link>
        {/* <Link to="/items" style={styles.link}>Items</Link> */}
      </nav>
    </header>
  );
};

const styles = {
    header: {
        position: 'fixed',
        top: 0,
        left: 0,              
        width: '100%',
        zIndex: 1000,
        backgroundColor: '#34405c',
        padding: '1rem 0',
        margin: 0,             
      },
  nav: {
    display: 'flex',
    gap: '1.5rem',
    justifyContent: 'center',
  },
  link: {
    color: '#61dafb',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default Header;
