import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [watchlists, setWatchlists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchWatchlists();
  }, []);

  const fetchWatchlists = async () => {
    try {
      const res = await axios.get('/api/watchlists', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWatchlists(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createWatchlist = async () => {
    if (!name) return alert('Name is required');
    try {
      await axios.post('/api/watchlists', { name, description }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      setName('');
      setDescription('');
      fetchWatchlists();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteWatchlist = async (id) => {
    if (!window.confirm('Delete this watchlist?')) return;
    try {
      await axios.delete(`/api/watchlists/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchWatchlists();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F6F4FF' }}>
      <Navbar />
      <div style={{ padding: '30px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '30px'
        }}>
          <div>
            <h1 style={{ color: '#110E24', margin: 0 }}>My Watchlists</h1>
            <p style={{ color: '#5C5580', margin: '5px 0 0' }}>
              {watchlists.length} watchlist{watchlists.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button onClick={() => setShowModal(true)} style={{
            backgroundColor: '#7C5CFC', color: 'white', border: 'none',
            padding: '12px 24px', borderRadius: '8px', cursor: 'pointer',
            fontSize: '16px', fontWeight: 'bold'
          }}>+ New List</button>
        </div>

        {watchlists.length === 0 ? (
          <div style={{
            textAlign: 'center', marginTop: '80px', color: '#5C5580'
          }}>
            <h3>No watchlists yet!</h3>
            <p>Click "+ New List" to create your first watchlist</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {watchlists.map(w => (
              <div key={w._id} style={{
                backgroundColor: 'white', borderRadius: '12px',
                padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                <h3 style={{ color: '#110E24', marginBottom: '8px' }}>{w.name}</h3>
                <p style={{ color: '#5C5580', fontSize: '14px', marginBottom: '20px' }}>
                  {w.description || 'No description'}
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => navigate(`/watchlist/${w._id}`)} style={{
                    flex: 1, backgroundColor: '#7C5CFC', color: 'white',
                    border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer'
                  }}>View</button>
                  <button onClick={() => deleteWatchlist(w._id)} style={{
                    flex: 1, backgroundColor: '#EF4444', color: 'white',
                    border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer'
                  }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '16px',
            padding: '30px', width: '420px'
          }}>
            <h2 style={{ color: '#110E24', marginBottom: '20px' }}>
              Create New Watchlist
            </h2>
            <input
              placeholder="Watchlist Name *"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{
                width: '100%', padding: '12px', marginBottom: '15px',
                border: '1px solid #E8E4FF', borderRadius: '8px',
                fontSize: '14px', boxSizing: 'border-box'
              }}
            />
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{
                width: '100%', padding: '12px', marginBottom: '20px',
                border: '1px solid #E8E4FF', borderRadius: '8px',
                fontSize: '14px', boxSizing: 'border-box', height: '100px'
              }}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} style={{
                padding: '10px 20px', border: '1px solid #E8E4FF',
                borderRadius: '8px', cursor: 'pointer', backgroundColor: 'white'
              }}>Cancel</button>
              <button onClick={createWatchlist} style={{
                padding: '10px 20px', backgroundColor: '#7C5CFC',
                color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'
              }}>Create Watchlist</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;