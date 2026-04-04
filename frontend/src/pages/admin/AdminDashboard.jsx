import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axiosConfig';
import Navbar from '../../components/Navbar';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ titles: 0 });
  const [recentContent, setRecentContent] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

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
        <h1 style={{ color: '#110E24', marginBottom: '30px' }}>Admin Dashboard</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h3 style={{ color: '#5C5580', margin: '0 0 10px' }}>Total Titles</h3>
            <h2 style={{ color: '#7C5CFC', margin: 0, fontSize: '36px' }}>{stats.titles}</h2>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#110E24', margin: 0 }}>Recent Titles</h2>
          <button onClick={() => navigate('/admin/content')} style={{
            backgroundColor: '#7C5CFC', color: 'white', border: 'none',
            padding: '10px 20px', borderRadius: '8px', cursor: 'pointer'
          }}>Manage Content</button>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          {recentContent.length === 0 ? (
            <p style={{ color: '#5C5580', textAlign: 'center' }}>No content yet</p>
          ) : (
            recentContent.map(c => (
              <div key={c._id} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '12px 0', borderBottom: '1px solid #E8E4FF'
              }}>
                <span style={{ color: '#110E24' }}>{c.title}</span>
                <span style={{ color: '#5C5580' }}>{c.type}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;