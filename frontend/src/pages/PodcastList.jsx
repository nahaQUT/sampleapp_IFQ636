import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PodcastCard from '../components/TaskList';

const PodcastList = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPodcasts();
    fetchCategories();
  }, []);

  const fetchPodcasts = async () => {
    try {
      const res = await axios.get('/api/podcasts');
      setPodcasts(res.data);
    } catch (err) {
      setError('Failed to load podcasts');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  // Filter by search and category
  const filteredPodcasts = podcasts.filter((podcast) => {
    const matchesSearch = podcast.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === '' ||
      podcast.category?._id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <p style={styles.message}>Loading podcasts...</p>;
  if (error) return <p style={styles.error}>{error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🎙️ Podcast Episodes</h1>

      {/* Search and Filter */}
      <div style={styles.controls}>
        <input
          type="text"
          placeholder="Search episodes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={styles.select}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.categoryName}
            </option>
          ))}
        </select>
      </div>

      {/* Podcast Grid */}
      {filteredPodcasts.length === 0 ? (
        <p style={styles.message}>No episodes found.</p>
      ) : (
        <div style={styles.grid}>
          {filteredPodcasts.map((podcast) => (
            <PodcastCard
              key={podcast._id}
              podcast={podcast}
              isAdmin={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '32px 20px',
  },
  heading: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '24px',
  },
  controls: {
    display: 'flex',
    gap: '12px',
    marginBottom: '28px',
    flexWrap: 'wrap',
  },
  searchInput: {
    flex: '1',
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    minWidth: '200px',
    outline: 'none',
  },
  select: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none',
    background: '#fff',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px',
  },
  message: {
    textAlign: 'center',
    color: '#888',
    fontSize: '16px',
    marginTop: '40px',
  },
  error: {
    textAlign: 'center',
    color: 'red',
    fontSize: '16px',
    marginTop: '40px',
  },
};

export default PodcastList;