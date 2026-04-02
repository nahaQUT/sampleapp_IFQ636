import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PodcastForm = ({ podcast, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    audioUrl: '',
    category: '',
    duration: '',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // fetch categories for dropdown
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();

    // if editing, prefill the form
    if (podcast) {
      setFormData({
        title: podcast.title || '',
        description: podcast.description || '',
        audioUrl: podcast.audioUrl || '',
        category: podcast.category?._id || '',
        duration: podcast.duration || '',
      });
    }
  }, [podcast]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      if (podcast) {
        // UPDATE existing podcast
        await axios.put(`/api/podcasts/${podcast._id}`, formData, config);
      } else {
        // CREATE new podcast
        await axios.post('/api/podcasts', formData, config);
      }

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>
        {podcast ? 'Edit Podcast Episode' : 'Add New Podcast Episode'}
      </h2>

      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Episode title"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={styles.textarea}
            placeholder="Episode description"
            rows={4}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Audio URL</label>
          <input
            type="url"
            name="audioUrl"
            value={formData.audioUrl}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="https://example.com/audio.mp3"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.categoryName}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Duration</label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            style={styles.input}
            placeholder="e.g. 45:30"
          />
        </div>

        <div style={styles.buttons}>
          <button
            type="submit"
            disabled={loading}
            style={styles.submitBtn}
          >
            {loading ? 'Saving...' : podcast ? 'Update Episode' : 'Add Episode'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    background: '#fff',
    borderRadius: '10px',
    padding: '24px',
    maxWidth: '600px',
    margin: '0 auto',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  heading: {
    marginBottom: '20px',
    fontSize: '20px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#555',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none',
  },
  textarea: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
  },
  error: {
    color: 'red',
    fontSize: '14px',
    marginBottom: '10px',
  },
  buttons: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  submitBtn: {
    padding: '10px 24px',
    background: '#6c63ff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  cancelBtn: {
    padding: '10px 24px',
    background: '#eee',
    color: '#333',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
  },
};

export default PodcastForm;