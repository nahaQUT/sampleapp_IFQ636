import { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import api from '../axiosConfig';

const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.padStart(2, '0');
  const day = `${today.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDate = (dateString) => {
  if (!dateString) return '-';

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleDateString();
};

const AdminHabits = () => {
  const [habits, setHabits] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await api.get('/admin/habits');
        setHabits(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load habits');
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, []);

  const filteredHabits = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return habits;

    return habits.filter((habit) => {
      const title = habit.title?.toLowerCase() || '';
      const owner = habit.user?.name?.toLowerCase() || '';
      const ownerEmail = habit.user?.email?.toLowerCase() || '';
      const category = habit.category?.name?.toLowerCase() || '';
      const frequency = habit.frequency?.toLowerCase() || '';

      return (
        title.includes(keyword) ||
        owner.includes(keyword) ||
        ownerEmail.includes(keyword) ||
        category.includes(keyword) ||
        frequency.includes(keyword)
      );
    });
  }, [habits, search]);

  const todayDateString = getTodayDateString();

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader
          title="Habit Monitoring"
          subtitle="View all habits created by users across the system."
        />

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">All Habits</h3>
              <p className="mt-1 text-sm text-slate-500">
                Total habits: {loading ? '...' : filteredHabits.length}
              </p>
            </div>

            <input
              type="text"
              placeholder="Search by title, owner, category, or frequency"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 md:max-w-sm"
            />
          </div>

          <div className="mt-6 overflow-x-auto">
            {loading ? (
              <p className="text-slate-500">Loading habits...</p>
            ) : filteredHabits.length === 0 ? (
              <p className="text-slate-500">No habits found.</p>
            ) : (
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Owner</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Frequency</th>
                    <th className="px-4 py-3 font-medium">Completion Count</th>
                    <th className="px-4 py-3 font-medium">Completed Today</th>
                    <th className="px-4 py-3 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHabits.map((habit) => {
                    const completionCount = habit.completionHistory?.length || 0;
                    const completedToday = Array.isArray(habit.completionHistory)
                      ? habit.completionHistory.some((item) => item.date === todayDateString)
                      : false;

                    return (
                      <tr
                        key={habit._id}
                        className="border-b border-slate-100 last:border-b-0"
                      >
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-medium text-slate-900">{habit.title}</p>
                            <p className="mt-1 text-slate-500">
                              {habit.description || '-'}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-slate-600">
                          <p>{habit.user?.name || '-'}</p>
                          <p className="mt-1 text-xs text-slate-400">
                            {habit.user?.email || '-'}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-slate-600">
                          {habit.category?.name || '-'}
                        </td>
                        <td className="px-4 py-4 text-slate-600">
                          {habit.frequency || '-'}
                        </td>
                        <td className="px-4 py-4 text-slate-600">{completionCount}</td>
                        <td className="px-4 py-4 text-slate-600">
                          {completedToday ? 'Yes' : 'No'}
                        </td>
                        <td className="px-4 py-4 text-slate-600">
                          {formatDate(habit.createdAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminHabits;