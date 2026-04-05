import { useEffect, useState } from 'react';
import api from '../axiosConfig';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import CategoryForm from '../components/CategoryForm';
import CategoryList from '../components/CategoryList';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingForm, setLoadingForm] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchCategories = async () => {
    setLoadingCategories(true);

    try {
      const response = await api.get('/categories');
      setCategories(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch categories.');
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    setError('');
    fetchCategories();
  }, []);

  const handleCreateClick = () => {
    setEditingCategory(null);
    setShowForm(true);
    setError('');
    setSuccessMessage('');
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
    setError('');
    setSuccessMessage('');
  };

  const handleDelete = async (category) => {
    const confirmed = window.confirm(`Delete "${category.name}"?`);
    if (!confirmed) return;

    setError('');
    setSuccessMessage('');

    try {
      await api.delete(`/categories/${category._id}`);
      setCategories((prev) => prev.filter((item) => item._id !== category._id));
      setSuccessMessage('Category deleted successfully.');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Cannot delete this category because it is being used by habits.'
      );
    }
  };

  const handleSubmit = async (formData) => {
    setLoadingForm(true);
    setError('');
    setSuccessMessage('');

    try {
      if (editingCategory) {
        const response = await api.put(`/categories/${editingCategory._id}`, formData);
        setCategories((prev) =>
          prev.map((item) => (item._id === editingCategory._id ? response.data : item))
        );
        setSuccessMessage('Category updated successfully.');
      } else {
        const response = await api.post('/categories', formData);
        setCategories((prev) => [response.data, ...prev]);
        setSuccessMessage('Category created successfully.');
      }

      setEditingCategory(null);
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category.');
    } finally {
      setLoadingForm(false);
    }
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setShowForm(false);
    setError('');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader
          title="Category Management"
          subtitle="Create, edit, and manage habit categories."
        />

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        ) : null}

        {successMessage ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCreateClick}
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Create Category
          </button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[380px,1fr]">
          {showForm ? (
            <CategoryForm
              initialData={editingCategory}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={loadingForm}
            />
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">Manage Categories</h3>
              <p className="mt-2 text-slate-500">
                Create a new category, update an existing one, or remove categories that are no longer needed.
              </p>
            </div>
          )}

          <CategoryList
            categories={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loadingCategories}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Categories;