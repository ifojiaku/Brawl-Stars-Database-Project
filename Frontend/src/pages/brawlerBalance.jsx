import React, { useState, useEffect } from 'react';
import { supabase_connection } from '../supabase/supabase';
import { evaluateBrawlerBalance } from '../components/balance';

export default function BrawlerBalancePage() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBalance() {
      try {
        setLoading(true);
        const recs = await evaluateBrawlerBalance(30);
        setSuggestions(recs);
      } catch (err) {
        console.error(err);
        setError('Failed to load balance suggestions');
      } finally {
        setLoading(false);
      }
    }
    fetchBalance();
  }, []);

  const badgeStyles = {
    nerf: { backgroundColor: '#fee2e2', color: '#991b1b', padding: '2px 6px', borderRadius: '9999px', fontSize: '12px', fontWeight: '600' },
    buff: { backgroundColor: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '9999px', fontSize: '12px', fontWeight: '600' },
    stable: { backgroundColor: '#f3f4f6', color: '#374151', padding: '2px 6px', borderRadius: '9999px', fontSize: '12px', fontWeight: '600' },
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '32px' }}>
      <h1 style={{ color:'#34405c', fontSize: '2rem', fontWeight: '700', marginBottom: '24px' }}>Brawler Balance Dashboard</h1>
      {error && <p style={{ color: '#b91c1c', marginBottom: '16px' }}>{error}</p>}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <span style={{ color: '#6b7280' }}>Loading...</span>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                {['Brawler','Usage','Win Rate','Z‑Score','Suggestion','Reason'].map((heading) => (
                  <th key={heading} style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {suggestions.map((s) => {
                const key = s.suggestion.toLowerCase();
                const style = badgeStyles[key] || badgeStyles.stable;
                return (
                  <tr key={s.brawler_id} style={{ borderTop: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>{s.name}</td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#4b5563' }}>{s.usage_count}</td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#4b5563' }}>{s.win_rate.toFixed(1)}%</td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#4b5563' }}>{s.z_score.toFixed(2)}</td>
                    <td style={{ padding: '12px' }}><span style={style}>{s.suggestion.toUpperCase()}</span></td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#6b7280' }}>{s.reason}</td>
                  </tr>
                );
              })}
              {suggestions.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '16px', textAlign: 'center', color: '#6b7280' }}>No brawler data to display.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
