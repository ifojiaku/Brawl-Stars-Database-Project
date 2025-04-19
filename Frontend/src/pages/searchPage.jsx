import { supabase_connection } from '../supabase/supabase';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const SearchPage = () => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');

    const tag = input.trim().toUpperCase().replace(/^#/, '');

    if (!tag) {
      setError('Please enter a valid tag');
      return;
    }

    // might divide it from player or club in one search bar to two maybe.
    try {
      // Check if it's in player table
      const { data: player, error: playerErr } = await supabase_connection
        .from('player')
        .select('tag')
        .eq('tag', tag)
        .single();

      if (player) {
        navigate(`/players/${tag}`);
        return;
      }

      // Check if it's in club table
      const { data: club, error: clubErr } = await supabase_connection
        .from('club')
        .select('tag')
        .eq('tag', tag)
        .single();

      if (club) {
        navigate(`/clubs/${tag}`);
        return;
      }

      // ifnot found... wanting to add a thing that then searches for it using the api. lower priority
      // navigate(`/fetch-tag/${tag}`); 

    } catch (err) {
      console.error('Search error:', err);
      setError('Something went wrong during search.');
    }
  };

  return (
    <div>
      <h1>Search Players or Clubs</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter player or club tag (e.g. #QJGRR)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SearchPage;
