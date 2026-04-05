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

  useEffect(() => {
    fetchWatchlists();
  }, []);

  const fetchWatchlists = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/watchlists', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWatchlists(res.data);
    } catch (err) {
      console.error('Error fetching watchlists:', err);
    }
  };

  const createWatchlist = async () => {
    if (!name) return alert('Name is required');
    try {
      const token = localStorage.getItem('token');
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
      const token = localStorage.getItem('token');
      await axios.delete(`/api/watchlists/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchWatchlists();
    } catch (err) {
      console.error(err);
    }
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F6F4FF' }}>
      <Navbar />
      <div style={{ padding: '30px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '30px'
        }}>
          <div>
            <h1 style={{ color: '#110E24', margin: 0 }}>👋 Welcome, {user.name}!</h1>
            <p style={{ color: '#5C5580', margin: '5px 0 0' }}>
              You have {watchlists.length} watchlist{watchlists.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button onClick={() => setShowModal(true)} style={{
            background: 'linear-gradient(135deg, #7C5CFC, #5B3FD4)',
            color: 'white', border: 'none',
            padding: '12px 24px', borderRadius: '10px', cursor: 'pointer',
            fontSize: '16px', fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(124, 92, 252, 0.4)'
          }}>+ New List</button>
        </div>

        {watchlists.length === 0 ? (
          <div style={{
            textAlign: 'center', marginTop: '80px',
            backgroundColor: 'white', borderRadius: '20px',
            padding: '60px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎬</div>
            <h3 style={{ color: '#110E24', marginBottom: '10px' }}>No watchlists yet!</h3>
            <p style={{ color: '#5C5580' }}>Click "+ New List" to create your first watchlist</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {watchlists.map((w, index) => {
              const gradients = [
                'linear-gradient(135deg, #7C5CFC, #5B3FD4)',
                'linear-gradient(135deg, #f093fb, #f5576c)',
                'linear-gradient(135deg, #4facfe, #00f2fe)',
                'linear-gradient(135deg, #43e97b, #38f9d7)',
                'linear-gradient(135deg, #fa709a, #fee140)',
              ];
              const gradient = gradients[index % gradients.length];
              return (
                <div key={w._id} style={{
                  backgroundColor: 'white', borderRadius: '16px',
                  padding: '0', overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s', cursor: 'pointer'
                }}>
                  <div style={{
                    background: gradient, padding: '25px',
                    color: 'white'
                  }}>
                    <h3 style={{ margin: '0 0 8px', fontSize: '20px' }}>{w.name}</h3>
                    <p style={{ margin: 0, opacity: 0.85, fontSize: '14px' }}>
                      {w.description || 'No description'}
                    </p>
                  </div>
                  <div style={{ padding: '15px', display: 'flex', gap: '10px' }}>
                    <button onClick={() => navigate(`/watchlist/${w._id}`)} style={{
                      flex: 1, background: gradient,
                      color: 'white', border: 'none',
                      padding: '10px', borderRadius: '8px', cursor: 'pointer',
                      fontWeight: 'bold'
                    }}>View →</button>
                    <button onClick={() => deleteWatchlist(w._id)} style={{
                      flex: 1, backgroundColor: '#FEE2E2', color: '#EF4444',
                      border: 'none', padding: '10px', borderRadius: '8px',
                      cursor: 'pointer', fontWeight: 'bold'
                    }}>Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '20px',
            padding: '40px', width: '440px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{ color: '#110E24', marginBottom: '25px' }}>🎬 Create New Watchlist</h2>
            <input
              placeholder="Watchlist Name *"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px', marginBottom: '15px',
                border: '2px solid #E8E4FF', borderRadius: '10px',
                fontSize: '14px', boxSizing: 'border-box'
              }}
            />
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px', marginBottom: '25px',
                border: '2px solid #E8E4FF', borderRadius: '10px',
                fontSize: '14px', boxSizing: 'border-box', height: '100px',
                resize: 'none'
              }}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} style={{
                padding: '12px 24px', border: '2px solid #E8E4FF',
                borderRadius: '10px', cursor: 'pointer',
                backgroundColor: 'white', color: '#5C5580', fontWeight: 'bold'
              }}>Cancel</button>
              <button onClick={createWatchlist} style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #7C5CFC, #5B3FD4)',
                color: 'white', border: 'none', borderRadius: '10px',
                cursor: 'pointer', fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(124, 92, 252, 0.4)'
              }}>Create Watchlist</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;