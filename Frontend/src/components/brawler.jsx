import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { get_SBwlrPerformance, fetchBrawlerItems } from '../supabase/sb_brawler';
import { fetchBrawlerPlayers } from '../supabase/sb_playerInfo';
import { Link } from 'react-router-dom';

const BrawlerPage = ({ initialData }) => {
  const [extraData, setExtraData] = useState([]);
  const [topPlayers, setTopPlayers] = useState([]);
  const [brawlerItems, setBrawlerItems] = useState([]);

  const { brawlerId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await get_SBwlrPerformance(parseInt(brawlerId));
        setExtraData(result);
        console.log(result);
      } catch (err) {
        console.error('Error fetching brawler performance:', err);
      }
    };

    const fetchTopPlayers = async () => {
      try {
        const result = await fetchBrawlerPlayers(parseInt(brawlerId));
        setTopPlayers(result);
        console.log(result);
      } catch (err) {
        console.error('Error fetching top players:', err);
      }
    };

    const fetchItems = async () => {
      try {
        const result = await fetchBrawlerItems(parseInt(brawlerId));
        setBrawlerItems(result);
        console.log('Brawler items:', result);
      } catch (err) {
        console.error('Error fetching brawler items:', err);
      }
    };

    fetchData();
    fetchTopPlayers();
    fetchItems();
  }, [brawlerId]);

  return (
    <div>
      <div>
        <img src={`https://cdn.brawlify.com/brawlers/borders/${brawlerId}.png`} width={200} height={200} alt="BrawlerIcon" />
        <h1>Brawler: {extraData[0]?.name}</h1>
      </div>

      <div>
        <h2>Best Modes</h2>
        <ul>
          {extraData.map((item, index) => (
            <li key={index}>Mode: {item.mode} Win Rate: {item.mode_win_rate}%</li>
          ))}
        </ul>
      </div>

      {brawlerItems?.length > 0 && (
        <div>
          <h2>Star Powers / Gadgets</h2>
          <ul>
            {brawlerItems.map((item, index) => (
              <li key={index}>
                <strong>{item.name}</strong> <em>({item.type})</em>: {item.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {topPlayers?.length > 0 && (
        <div>
          <h2>Top Players</h2>
          <table>
            <thead>
              <tr>
                <th>Icon</th>
                <th>Name</th>
                <th>Brawler Trophies</th>
                <th>Win Rate</th>
                <th>Battles Played</th>
              </tr>
            </thead>
            <tbody>
              {topPlayers.map((item, index) => (
                <tr key={index}>
                  <td>
                    <Link to={`/players/${item.tag}`}>
                      <img src={`https://cdn.brawlify.com/profile-icons/regular/${item.icon}.png`} width={100} height={100} alt="icon" />
                    </Link>
                  </td>
                  <td>
                    <Link to={`/players/${item.tag}`}>{item.name}</Link>
                  </td>
                  <td>{item.brawler_trophies}</td>
                  <td>{item.brawler_win_rate}%</td>
                  <td>{item.battles_played}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BrawlerPage;
