import React, { useState, useEffect } from 'react';
import { supabase_connection } from "../supabase/supabase";

export default function AdminPage() {

  const ADMIN_USER = 'admin';
  const ADMIN_PASS = 'password';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

//   login hardcoded but shows it anyway
  const handleLogin = (e) => {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setIsLoggedIn(true);
      setError(null);
    } else {
      setError('Invalid credentials');
    }
  };

  // Fetch all players from Supabase
  const fetchPlayers = async () => {
    setLoading(true);
    const { data, error } = await supabase_connection
      .from('player')
      .select('tag, name')
      .order('tag', { ascending: true });

    if (error) {
      setError('Error fetching players: ' + error.message);
    } else {
      setPlayers(data);
      setError(null);
    }
    setLoading(false);
  };

  // Delete a player by given tag (from clicking on them)
  const handleDelete = async (tag) => {
    if (!window.confirm(`Delete player ${tag}? This cannot be undone.`)) return;
    setLoading(true);
    setError(null);

    //deletes and returns the deleted rows to double check
    const { data, error } = await supabase_connection
      .from('player')
      .delete()
      .eq('tag', tag)
      .select('tag');

    if (error) {
      setError('Delete failed: ' + error.message);
    } else {
      console.log('Deleted rows:', data);
      setPlayers(prev => prev.filter(p => p.tag !== tag));
    }
    setLoading(false);
  };

  
  useEffect(() => {
    if (isLoggedIn) fetchPlayers();
  }, [isLoggedIn]);

  
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form
          onSubmit={handleLogin}
          className="bg-white p-6 rounded shadow-md w-full max-w-sm"
        >
          <h2 className="text-xl mb-4">Admin Login</h2>
          {error && <p className="text-red-600 mb-2">{error}</p>}
          <label className="block mb-2">
            <span className="block text-sm">Username</span>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
            />
          </label>
          <label className="block mb-4">
            <span className="block text-sm">Password</span>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
            />
          </label>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  // the panel that is shown
  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl">Admin Panel</h1>
        <button
          onClick={() => setIsLoggedIn(false)}
          className="text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full bg-white rounded shadow-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Player Tag</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.map(player => (
              <tr key={player.player_tag} className="border-t">
                <td className="p-2">{player.tag}</td>
                <td className="p-2">{player.name}</td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => handleDelete(player.tag)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {players.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
                  No players found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
