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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ color: '#110E24', margin: 0 }}>Content Catalog</h1>
          <button onClick={() => navigate('/admin/content/new')} style={{
            backgroundColor: '#7C5CFC', color: 'white', border: 'none',
            padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px'
          }}>+ Add Title</button>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {['All', 'Movie', 'Series'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 16px', borderRadius: '20px', cursor: 'pointer',
              backgroundColor: filter === f ? '#7C5CFC' : 'white',
              color: filter === f ? 'white' : '#5C5580',
              border: '1px solid #E8E4FF'
            }}>{f}</button>
          ))}
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#F6F4FF' }}>
                <th style={{ padding: '15px', textAlign: 'left', color: '#5C5580' }}>Title</th>
                <th style={{ padding: '15px', textAlign: 'left', color: '#5C5580' }}>Type</th>
                <th style={{ padding: '15px', textAlign: 'left', color: '#5C5580' }}>Genre</th>
                <th style={{ padding: '15px', textAlign: 'left', color: '#5C5580' }}>Year</th>
                <th style={{ padding: '15px', textAlign: 'left', color: '#5C5580' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: '#5C5580' }}>
                    No content found
                  </td>
                </tr>
              ) : (
                filtered.map(c => (
                  <tr key={c._id} style={{ borderTop: '1px solid #E8E4FF' }}>
                    <td style={{ padding: '15px', color: '#110E24' }}>{c.title}</td>
                    <td style={{ padding: '15px', color: '#5C5580' }}>{c.type}</td>
                    <td style={{ padding: '15px', color: '#5C5580' }}>{c.genre?.join(', ')}</td>
                    <td style={{ padding: '15px', color: '#5C5580' }}>{c.releaseYear}</td>
                    <td style={{ padding: '15px' }}>
                      <button onClick={() => navigate(`/admin/content/${c._id}`)} style={{
                        backgroundColor: '#7C5CFC', color: 'white', border: 'none',
                        padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', marginRight: '8px'
                      }}>Edit</button>
                      <button onClick={() => deleteContent(c._id)} style={{
                        backgroundColor: '#EF4444', color: 'white', border: 'none',
                        padding: '6px 12px', borderRadius: '6px', cursor: 'pointer'
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