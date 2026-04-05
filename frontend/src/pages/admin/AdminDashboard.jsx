import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axiosConfig';
import Navbar from '../../components/Navbar';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ titles: 0 });
  const [recentContent, setRecentContent] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await axios.get('/api/content');
      setRecentContent(res.data.slice(0, 5));
      setStats({ titles: res.data.length });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F6F4FF' }}>
      <Navbar />
      <div style={{ padding: '30px' }}>
        <h1 style={{ color: '#110E24', marginBottom: '30px' }}>⚙️ Admin Dashboard</h1>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px', marginBottom: '30px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #7C5CFC, #5B3FD4)',
            borderRadius: '16px', padding: '25px', color: 'white',
            boxShadow: '0 4px 20px rgba(124, 92, 252, 0.4)'
          }}>
            <p style={{ margin: '0 0 10px', opacity: 0.85 }}>Total Titles</p>
            <h2 style={{ margin: 0, fontSize: '42px' }}>{stats.titles}</h2>
          </div>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '20px'
        }}>
          <h2 style={{ color: '#110E24', margin: 0 }}>Recent Titles</h2>
          <button onClick={() => navigate('/admin/content')} style={{
            background: 'linear-gradient(135deg, #7C5CFC, #5B3FD4)',
            color: 'white', border: 'none',
            padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
            fontWeight: 'bold'
          }}>Manage Content →</button>
        </div>

        <div style={{
          backgroundColor: 'white', borderRadius: '16px',
          padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          {recentContent.length === 0 ? (
            <p style={{ color: '#5C5580', textAlign: 'center', padding: '20px' }}>
              No content yet. Add some titles!
            </p>
          ) : (
            recentContent.map((c, i) => (
              <div key={c._id} style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', padding: '15px 0',
                borderBottom: i < recentContent.length - 1 ? '1px solid #E8E4FF' : 'none'
              }}>
                <div>
                  <span style={{ color: '#110E24', fontWeight: 'bold' }}>{c.title}</span>
                  <span style={{ color: '#5C5580', fontSize: '13px', marginLeft: '10px' }}>
                    {c.genre?.join(', ')}
                  </span>
                </div>
                <span style={{
                  backgroundColor: c.type === 'Movie' ? '#E8E4FF' : '#D1FAE5',
                  color: c.type === 'Movie' ? '#7C5CFC' : '#22C55E',
                  padding: '4px 12px', borderRadius: '20px', fontSize: '13px'
                }}>{c.type}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;