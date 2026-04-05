import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axiosConfig';
import Navbar from '../../components/Navbar';

const ContentCatalog = () => {
  const [contents, setContents] = useState([]);
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await axios.get('/api/content');
      setContents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteContent = async (id) => {
    if (!window.confirm('Delete this title?')) return;
    try {
      await axios.delete(`/api/content/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchContent();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = filter === 'All' ? contents : contents.filter(c => c.type === filter);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F6F4FF' }}>
      <Navbar />
      <div style={{ padding: '30px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '25px'
        }}>
          <div>
            <h1 style={{ color: '#110E24', margin: 0 }}>🎬 Content Catalog</h1>
            <p style={{ color: '#5C5580', margin: '5px 0 0' }}>{filtered.length} titles</p>
          </div>
          <button onClick={() => navigate('/admin/content/new')} style={{
            background: 'linear-gradient(135deg, #7C5CFC, #5B3FD4)',
            color: 'white', border: 'none',
            padding: '12px 24px', borderRadius: '10px', cursor: 'pointer',
            fontSize: '16px', fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(124, 92, 252, 0.4)'
          }}>+ Add Title</button>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {['All', 'Movie', 'Series'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 20px', borderRadius: '20px', cursor: 'pointer',
              background: filter === f ? 'linear-gradient(135deg, #7C5CFC, #5B3FD4)' : 'white',
              color: filter === f ? 'white' : '#5C5580',
              border: '2px solid #E8E4FF', fontWeight: 'bold',
              boxShadow: filter === f ? '0 4px 15px rgba(124, 92, 252, 0.3)' : 'none'
            }}>{f}</button>
          ))}
        </div>

        <div style={{
          backgroundColor: 'white', borderRadius: '16px',
          overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #7C5CFC, #5B3FD4)', color: 'white' }}>
                <th style={{ padding: '15px 20px', textAlign: 'left' }}>Title</th>
                <th style={{ padding: '15px 20px', textAlign: 'left' }}>Type</th>
                <th style={{ padding: '15px 20px', textAlign: 'left' }}>Genre</th>
                <th style={{ padding: '15px 20px', textAlign: 'left' }}>Year</th>
                <th style={{ padding: '15px 20px', textAlign: 'left' }}>Platform</th>
                <th style={{ padding: '15px 20px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#5C5580' }}>
                    No content found. Add some titles!
                  </td>
                </tr>
              ) : (
                filtered.map((c, i) => (
                  <tr key={c._id} style={{
                    backgroundColor: i % 2 === 0 ? 'white' : '#F9F8FF',
                    borderTop: '1px solid #E8E4FF'
                  }}>
                    <td style={{ padding: '15px 20px', color: '#110E24', fontWeight: 'bold' }}>{c.title}</td>
                    <td style={{ padding: '15px 20px' }}>
                      <span style={{
                        backgroundColor: c.type === 'Movie' ? '#E8E4FF' : '#D1FAE5',
                        color: c.type === 'Movie' ? '#7C5CFC' : '#22C55E',
                        padding: '4px 12px', borderRadius: '20px', fontSize: '13px'
                      }}>{c.type}</span>
                    </td>
                    <td style={{ padding: '15px 20px', color: '#5C5580' }}>{c.genre?.join(', ')}</td>
                    <td style={{ padding: '15px 20px', color: '#5C5580' }}>{c.releaseYear}</td>
                    <td style={{ padding: '15px 20px', color: '#5C5580' }}>{c.platform}</td>
                    <td style={{ padding: '15px 20px' }}>
                      <button onClick={() => navigate(`/admin/content/${c._id}`)} style={{
                        background: 'linear-gradient(135deg, #7C5CFC, #5B3FD4)',
                        color: 'white', border: 'none',
                        padding: '6px 14px', borderRadius: '6px',
                        cursor: 'pointer', marginRight: '8px', fontWeight: 'bold'
                      }}>Edit</button>
                      <button onClick={() => deleteContent(c._id)} style={{
                        backgroundColor: '#FEE2E2', color: '#EF4444',
                        border: 'none', padding: '6px 14px',
                        borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
                      }}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContentCatalog;