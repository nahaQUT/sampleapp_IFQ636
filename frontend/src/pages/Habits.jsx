import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import HabitForm from '../components/HabitForm';
import HabitList from '../components/HabitList';

const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingHabits, setLoadingHabits] = useState(true);
  const [loadingForm, setLoadingForm] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingHabit, setEditingHabit] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const todayDate = getLocalDateString();

  const fetchHabits = async () => {
    setLoadingHabits(true);

    try {
      const response = await axiosInstance.get('/api/habits');
      setHabits(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch habits.');
    } finally {
      setLoadingHabits(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/api/categories');
      setCategories(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch categories.');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setError('');
      await Promise.all([fetchHabits(), fetchCategories()]);
    };

    loadData();
  }, []);

  const handleCreateClick = () => {
    setEditingHabit(null);
    setShowForm(true);
    setError('');
    setSuccessMessage('');
  };

  const handleEdit = (habit) => {
    const isCompletedToday = habit.completionHistory?.some((item) => item.date === todayDate);

    if (isCompletedToday) {
      setError('Completed habits cannot be edited today.');
      setSuccessMessage('');
      return;
    }

    setEditingHabit(habit);
    setShowForm(true);
    setError('');
    setSuccessMessage('');
  };

  const handleDelete = async (habit) => {
    const isCompletedToday = habit.completionHistory?.some((item) => item.date === todayDate);

    if (isCompletedToday) {
      setError('Completed habits cannot be deleted today.');
      setSuccessMessage('');
      return;
    }

    const confirmed = window.confirm(`Delete "${habit.title}"?`);
    if (!confirmed) return;

    setError('');
    setSuccessMessage('');

    try {
      await axiosInstance.delete(`/api/habits/${habit._id}`);
      setHabits((prev) => prev.filter((item) => item._id !== habit._id));
      setSuccessMessage('Habit deleted successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete habit.');
    }
  };

  const handleComplete = async (habit) => {
    setError('');
    setSuccessMessage('');

    try {
      const response = await axiosInstance.put(`/api/habits/${habit._id}/complete`, {
        date: todayDate,
      });

      setHabits((prev) =>
        prev.map((item) => (item._id === habit._id ? response.data.habit : item))
      );
      setSuccessMessage('Habit marked as complete.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete habit.');
    }
  };

  const handleSubmit = async (formData) => {
    setLoadingForm(true);
    setError('');
    setSuccessMessage('');

    try {
      if (editingHabit) {
        const response = await axiosInstance.put(`/api/habits/${editingHabit._id}`, formData);
        setHabits((prev) =>
          prev.map((item) => (item._id === editingHabit._id ? response.data : item))
        );
        setSuccessMessage('Habit updated successfully.');
      } else {
        const response = await axiosInstance.post('/api/habits', formData);
        setHabits((prev) => [response.data, ...prev]);
        setSuccessMessage('Habit created successfully.');
      }

      setEditingHabit(null);
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save habit.');
    } finally {
      setLoadingForm(false);
    }
  };

  const handleCancel = () => {
    setEditingHabit(null);
    setShowForm(false);
    setError('');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader
          title="Habit Management"
          subtitle="Create, edit, complete, and manage your habits."
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
            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            Create Habit
          </button>

          {categories.length === 0 ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              No categories available yet. Ask admin to create categories first.
            </div>
          ) : null}
        </div>

        <div className="grid gap-6 xl:grid-cols-[380px,1fr]">
          {showForm ? (
            <HabitForm
              categories={categories}
              initialData={editingHabit}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={loadingForm}
            />
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">Manage Habits</h3>
              <p className="mt-2 text-slate-500">
                Create a new habit, update an existing one, or mark today&apos;s progress from the
                list.
              </p>
            </div>
          )}

          <HabitList
            habits={habits}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onComplete={handleComplete}
            loading={loadingHabits}
            todayDate={todayDate}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Habits;