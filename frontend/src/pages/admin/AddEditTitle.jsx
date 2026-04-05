import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../axiosConfig';
import Navbar from '../../components/Navbar';

const AddEditTitle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: '', type: 'Movie', genre: '',
    releaseYear: '', platform: '', posterUrl: '', description: ''
  });

  useEffect(() => {
    if (isEdit) fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await axios.get('/api/content');
      const found = res.data.find(c => c._id === id);
      if (found) setForm({
        title: found.title || '',
        type: found.type || 'Movie',
        genre: found.genre?.join(', ') || '',
        releaseYear: found.releaseYear || '',
        platform: found.platform || '',
        posterUrl: found.posterUrl || '',
        description: found.description || ''
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.title) return alert('Title is required');
    try {
      const payload = {
        ...form,
        genre: form.genre.split(',').map(g => g.trim()).filter(Boolean),
        releaseYear: parseInt(form.releaseYear) || undefined
      };
      if (isEdit) {
        await axios.put(`/api/content/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('/api/content', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      navigate('/admin/content');
    } catch (err) {
      console.error(err);
      alert('Error saving content');
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', marginBottom: '15px',
    border: '2px solid #E8E4FF', borderRadius: '10px',
    fontSize: '14px', boxSizing: 'border-box'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F6F4FF' }}>
      <Navbar />
      <div style={{ padding: '30px', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ color: '#110E24', marginBottom: '30px' }}>
          {isEdit ? '✏️ Edit Title' : '➕ Add New Title'}
        </h1>
        <div style={{
          backgroundColor: 'white', borderRadius: '20px',
          padding: '35px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <label style={{ display: 'block', marginBottom: '6px', color: '#5C5580', fontSize: '14px' }}>Title *</label>
          <input name="title" placeholder="Movie or Series title" value={form.title} onChange={handleChange} style={inputStyle} />

          <label style={{ display: 'block', marginBottom: '6px', color: '#5C5580', fontSize: '14px' }}>Type</label>
          <select name="type" value={form.type} onChange={handleChange} style={inputStyle}>
            <option value="Movie">Movie</option>
            <option value="Series">Series</option>
          </select>

          <label style={{ display: 'block', marginBottom: '6px', color: '#5C5580', fontSize: '14px' }}>Genre (comma separated)</label>
          <input name="genre" placeholder="Action, Drama, Comedy" value={form.genre} onChange={handleChange} style={inputStyle} />

          <label style={{ display: 'block', marginBottom: '6px', color: '#5C5580', fontSize: '14px' }}>Release Year</label>
          <input name="releaseYear" placeholder="2024" value={form.releaseYear} onChange={handleChange} style={inputStyle} type="number" />

          <label style={{ display: 'block', marginBottom: '6px', color: '#5C5580', fontSize: '14px' }}>Platform</label>
          <input name="platform" placeholder="Netflix, Prime, Disney+" value={form.platform} onChange={handleChange} style={inputStyle} />

          <label style={{ display: 'block', marginBottom: '6px', color: '#5C5580', fontSize: '14px' }}>Poster URL</label>
          <input name="posterUrl" placeholder="https://..." value={form.posterUrl} onChange={handleChange} style={inputStyle} />

          <label style={{ display: 'block', marginBottom: '6px', color: '#5C5580', fontSize: '14px' }}>Description</label>
          <textarea name="description" placeholder="Brief description..." value={form.description} onChange={handleChange} style={{ ...inputStyle, height: '100px', resize: 'none' }} />

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button onClick={() => navigate('/admin/content')} style={{
              padding: '12px 24px', border: '2px solid #E8E4FF',
              borderRadius: '10px', cursor: 'pointer',
              backgroundColor: 'white', color: '#5C5580', fontWeight: 'bold'
            }}>Cancel</button>
            <button onClick={handleSubmit} style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #7C5CFC, #5B3FD4)',
              color: 'white', border: 'none', borderRadius: '10px',
              cursor: 'pointer', fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(124, 92, 252, 0.4)'
            }}>{isEdit ? 'Update Title' : 'Add Title'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditTitle;