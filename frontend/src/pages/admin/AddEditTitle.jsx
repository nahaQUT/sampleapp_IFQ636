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
    width: '100%', padding: '12px', marginBottom: '15px',
    border: '1px solid #E8E4FF', borderRadius: '8px',
    fontSize: '14px', boxSizing: 'border-box'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F6F4FF' }}>
      <Navbar />
      <div style={{ padding: '30px', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ color: '#110E24', marginBottom: '30px' }}>
          {isEdit ? 'Edit Title' : 'Add New Title'}
        </h1>
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <input name="title" placeholder="Title *" value={form.title} onChange={handleChange} style={inputStyle} />
          <select name="type" value={form.type} onChange={handleChange} style={inputStyle}>
            <option value="Movie">Movie</option>
            <option value="Series">Series</option>
          </select>
          <input name="genre" placeholder="Genre (comma separated)" value={form.genre} onChange={handleChange} style={inputStyle} />
          <input name="releaseYear" placeholder="Release Year" value={form.releaseYear} onChange={handleChange} style={inputStyle} type="number" />
          <input name="platform" placeholder="Platform (Netflix, Prime...)" value={form.platform} onChange={handleChange} style={inputStyle} />
          <input name="posterUrl" placeholder="Poster URL" value={form.posterUrl} onChange={handleChange} style={inputStyle} />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} style={{ ...inputStyle, height: '100px' }} />

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button onClick={() => navigate('/admin/content')} style={{
              padding: '12px 24px', border: '1px solid #E8E4FF',
              borderRadius: '8px', cursor: 'pointer', backgroundColor: 'white'
            }}>Cancel</button>
            <button onClick={handleSubmit} style={{
              padding: '12px 24px', backgroundColor: '#7C5CFC',
              color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'
            }}>{isEdit ? 'Update Title' : 'Add Title'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditTitle;