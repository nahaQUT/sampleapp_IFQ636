import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import Navbar from '../components/Navbar';

const WatchlistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [watchlist, setWatchlist] = useState(null);
  const [items, setItems] = useState([]);
  const [contents, setContents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState('');
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    fetchWatchlist();
    fetchItems();
    fetchContents();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const res = await axios.get('/api/watchlists', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const found = res.data.find(w => w._id === id);
      setWatchlist(found);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchItems = async () => {
    try {
      const res = await axios.get(`/api/watchlists/${id}/items`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(res.data);
    } catch (err) {
      setItems([]);
    }
  };

  const fetchContents = async () => {
    try {
      const res = await axios.get('/api/content');
      setContents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addItem = async () => {
    if (!selectedContent) return alert('Please select a title');
    try {
      await axios.post(`/api/watchlists/${id}/items`,
        { contentId: selectedContent, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowAddModal(false);
      setSelectedContent('');
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (itemId, newStatus) => {
    try {
      await axios.put(`/api/watchlists/${id}/items/${itemId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (itemId) => {
    if (!window.confirm('Remove this item?')) return;
    try {
      await axios.delete(`/api/watchlists/${id}/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const statusColor = (s) => {
    if (s === 'watched') return { bg: '#D1FAE5', color: '#22C55E' };
    if (s === 'watching') return { bg: '#DBEAFE', color: '#3B82F6' };
    return { bg: '#FEF3C7', color: '#F59E0B' };
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F6F4FF' }}>
      <Navbar />
      <div style={{ padding: '30px' }}>
        <button onClick={() => navigate('/dashboard')} style={{
          background: 'none', border: '2px solid #7C5CFC',
          color: '#7C5CFC', padding: '8px 18px', borderRadius: '8px',
          cursor: 'pointer', marginBottom: '25px', fontWeight: 'bold'
        }}>← Back</button>

        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '30px'
        }}>
          <div>
            <h1 style={{ color: '#110E24', margin: 0 }}>
              🎬 {watchlist?.name || 'Watchlist'}
            </h1>
            <p style={{ color: '#5C5580', margin: '5px 0 0' }}>
              {items.length} item{items.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button onClick={() => setShowAddModal(true)} style={{
            background: 'linear-gradient(135deg, #7C5CFC, #5B3FD4)',
            color: 'white', border: 'none',
            padding: '12px 24px', borderRadius: '10px', cursor: 'pointer',
            fontSize: '16px', fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(124, 92, 252, 0.4)'
          }}>+ Add Title</button>
        </div>

        {items.length === 0 ? (
          <div style={{
            textAlign: 'center', marginTop: '60px',
            backgroundColor: 'white', borderRadius: '20px',
            padding: '60px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🍿</div>
            <h3 style={{ color: '#110E24', marginBottom: '10px' }}>No titles yet!</h3>
            <p style={{ color: '#5C5580' }}>Click "+ Add Title" to add content</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {items.map(item => {
              const content = contents.find(c => c._id === item.contentId);
              const sc = statusColor(item.status);
              return (
                <div key={item._id} style={{
                  backgroundColor: 'white', borderRadius: '14px',
                  padding: '20px', display: 'flex',
                  justifyContent: 'space-between', alignItems: 'center',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
                }}>
                  <div>
                    <h3 style={{ color: '#110E24', margin: '0 0 5px', fontSize: '18px' }}>
                      {content?.title || 'Unknown Title'}
                    </h3>
                    <p style={{ color: '#5C5580', fontSize: '13px', margin: 0 }}>
                      {content?.type} • {content?.platform} • {content?.releaseYear}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      backgroundColor: sc.bg, color: sc.color,
                      padding: '5px 14px', borderRadius: '20px',
                      fontSize: '13px', fontWeight: 'bold'
                    }}>{item.status}</span>
                    <select
                      value={item.status}
                      onChange={e => updateStatus(item._id, e.target.value)}
                      style={{
                        padding: '8px 12px', borderRadius: '8px',
                        border: '2px solid #E8E4FF', cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="watching">Watching</option>
                      <option value="watched">Watched</option>
                    </select>
                    <button onClick={() => removeItem(item._id)} style={{
                      backgroundColor: '#FEE2E2', color: '#EF4444',
                      border: 'none', padding: '8px 14px',
                      borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
                    }}>Remove</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showAddModal && (
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
            <h2 style={{ color: '#110E24', marginBottom: '25px' }}>🎬 Add Title</h2>
            <select
              value={selectedContent}
              onChange={e => setSelectedContent(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px', marginBottom: '15px',
                border: '2px solid #E8E4FF', borderRadius: '10px',
                fontSize: '14px', boxSizing: 'border-box'
              }}
            >
              <option value="">Select a title...</option>
              {contents.map(c => (
                <option key={c._id} value={c._id}>
                  {c.title} ({c.type})
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px', marginBottom: '25px',
                border: '2px solid #E8E4FF', borderRadius: '10px',
                fontSize: '14px', boxSizing: 'border-box'
              }}
            >
              <option value="pending">Pending</option>
              <option value="watching">Watching</option>
              <option value="watched">Watched</option>
            </select>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowAddModal(false)} style={{
                padding: '12px 24px', border: '2px solid #E8E4FF',
                borderRadius: '10px', cursor: 'pointer',
                backgroundColor: 'white', color: '#5C5580', fontWeight: 'bold'
              }}>Cancel</button>
              <button onClick={addItem} style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #7C5CFC, #5B3FD4)',
                color: 'white', border: 'none', borderRadius: '10px',
                cursor: 'pointer', fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(124, 92, 252, 0.4)'
              }}>Add to Watchlist</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchlistDetail;