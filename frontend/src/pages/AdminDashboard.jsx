import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PodcastCard from '../components/TaskList';
import PodcastForm from '../components/TaskForm';

const AdminDashboard = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('podcasts');

  // Category form state
  const [newCategory, setNewCategory] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [categorySuccess, setCategorySuccess] = useState('');

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

  const handleEdit = (podcast) => {
    setSelectedPodcast(podcast);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this episode?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/podcasts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPodcasts();
    } catch (err) {
      alert('Failed to delete podcast');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedPodcast(null);
    fetchPodcasts();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedPodcast(null);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setCategoryError('');
    setCategorySuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/categories',
        {
          categoryName: newCategory,
          description: categoryDescription,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCategorySuccess('Category added successfully!');
      setNewCategory('');
      setCategoryDescription('');
      fetchCategories();
    } catch (err) {
      setCategoryError(err.response?.data?.message || 'Failed to add category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
    } catch (err) {
      alert('Failed to delete category');
    }
  };

  if (loading) return <p style={styles.message}>Loading...</p>;
  if (error) return <p style={styles.error}>{error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🎙️ Admin Dashboard</h1>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('podcasts')}
          style={activeTab === 'podcasts' ? styles.activeTab : styles.tab}
        >
          Podcast Episodes
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          style={activeTab === 'categories' ? styles.activeTab : styles.tab}
        >
          Categories
        </button>
      </div>

      {/* Podcasts Tab */}
      {activeTab === 'podcasts' && (
        <div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              style={styles.addBtn}
            >
              + Add New Episode
            </button>
          )}

          {showForm && (
            <div style={styles.formWrapper}>
              <PodcastForm
                podcast={selectedPodcast}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </div>
          )}

          {podcasts.length === 0 ? (
            <p style={styles.message}>No episodes yet. Add one above!</p>
          ) : (
            <div style={styles.grid}>
              {podcasts.map((podcast) => (
                <PodcastCard
                  key={podcast._id}
                  podcast={podcast}
                  isAdmin={true}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div>
          <div style={styles.categoryForm}>
            <h2 style={styles.subHeading}>Add New Category</h2>
            {categoryError && <p style={styles.error}>{categoryError}</p>}
            {categorySuccess && <p style={styles.success}>{categorySuccess}</p>}
            <form onSubmit={handleAddCategory} style={styles.catForm}>
              <input
                type="text"
                placeholder="Category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                required
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                style={styles.input}
              />
              <button type="submit" style={styles.addBtn}>
                Add Category
              </button>
            </form>
          </div>

          <h2 style={styles.subHeading}>Existing Categories</h2>
          {categories.length === 0 ? (
            <p style={styles.message}>No categories yet.</p>
          ) : (
            <div style={styles.categoryList}>
              {categories.map((cat) => (
                <div key={cat._id} style={styles.categoryItem}>
                  <div>
                    <p style={styles.categoryName}>{cat.categoryName}</p>
                    <p style={styles.categoryDesc}>{cat.description}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(cat._id)}
                    style={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
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
  subHeading: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#444',
    marginBottom: '16px',
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '28px',
  },
  tab: {
    padding: '10px 24px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    background: '#fff',
    fontSize: '14px',
    cursor: 'pointer',
    color: '#666',
  },
  activeTab: {
    padding: '10px 24px',
    borderRadius: '8px',
    border: '1px solid #6c63ff',
    background: '#6c63ff',
    fontSize: '14px',
    cursor: 'pointer',
    color: '#fff',
    fontWeight: '600',
  },
  addBtn: {
    padding: '10px 24px',
    background: '#6c63ff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    marginBottom: '24px',
  },
  formWrapper: {
    marginBottom: '28px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px',
  },
  categoryForm: {
    background: '#fff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    marginBottom: '28px',
  },
  catForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none',
  },
  categoryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  categoryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#fff',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
  },
  categoryName: {
    fontWeight: '600',
    color: '#333',
    margin: '0 0 4px 0',
  },
  categoryDesc: {
    fontSize: '13px',
    color: '#888',
    margin: '0',
  },
  deleteBtn: {
    padding: '6px 16px',
    background: '#ff4d4d',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  message: {
    textAlign: 'center',
    color: '#888',
    fontSize: '16px',
    marginTop: '40px',
  },
  error: {
    color: 'red',
    fontSize: '14px',
    marginBottom: '10px',
  },
  success: {
    color: 'green',
    fontSize: '14px',
    marginBottom: '10px',
  },
};

export default AdminDashboard;