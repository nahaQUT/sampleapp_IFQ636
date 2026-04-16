import { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import api from '../axiosConfig';

const dayKeys = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDate = (dateString) => {
  if (!dateString) return '-';

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleDateString();
};

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const now = new Date();
  const todayDate = getLocalDateString(now);
  const todayKey = dayKeys[now.getDay()];

  useEffect(() => {
    const fetchAdminDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        const [usersResponse, habitsResponse] = await Promise.all([
          api.get('/admin/users'),
          api.get('/admin/habits'),
        ]);

        setUsers(Array.isArray(usersResponse.data) ? usersResponse.data : []);
        setHabits(Array.isArray(habitsResponse.data) ? habitsResponse.data : []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load admin dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDashboardData();
  }, []);

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const totalHabits = habits.length;

    const activeToday = habits.filter((habit) => {
      const startDate = habit.startDate ? getLocalDateString(new Date(habit.startDate)) : null;

      if (startDate && startDate > todayDate) {
        return false;
      }

      if (habit.frequency === 'daily') {
        return true;
      }

      if (habit.frequency === 'weekly') {
        return Array.isArray(habit.daysOfWeek) && habit.daysOfWeek.includes(todayKey);
      }

      return false;
    }).length;

    const completedToday = habits.filter(
      (habit) =>
        Array.isArray(habit.completionHistory) &&
        habit.completionHistory.some((item) => item.date === todayDate)
    ).length;

    return {
      totalUsers,
      totalHabits,
      activeToday,
      completedToday,
    };
  }, [users, habits, todayDate, todayKey]);

  const recentUsers = useMemo(() => users.slice(0, 5), [users]);
  const recentHabits = useMemo(() => habits.slice(0, 5), [habits]);

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader
          title="Admin Dashboard"
          subtitle="Monitor users, habits, and overall system activity."
        />

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Total Users</p>
                <h2 className="mt-3 text-3xl font-bold text-indigo-700">
                  {loading ? '...' : stats.totalUsers}
                </h2>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-2xl">
                👤
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Total Habits</p>
                <h2 className="mt-3 text-3xl font-bold text-emerald-700">
                  {loading ? '...' : stats.totalHabits}
                </h2>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
                📋
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Active Today</p>
                <h2 className="mt-3 text-3xl font-bold text-amber-600">
                  {loading ? '...' : stats.activeToday}
                </h2>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-2xl">
                🔥
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Completed Today</p>
                <h2 className="mt-3 text-3xl font-bold text-violet-600">
                  {loading ? '...' : stats.completedToday}
                </h2>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-2xl">
                ✅
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-2xl font-semibold text-slate-900">Recent Users</h3>
            <div className="mt-6 space-y-4">
              {loading ? (
                <p className="text-slate-500">Loading users...</p>
              ) : recentUsers.length === 0 ? (
                <p className="text-slate-500">No users found.</p>
              ) : (
                recentUsers.map((user) => (
                  <div key={user._id} className="rounded-2xl bg-slate-50 px-5 py-4">
                    <p className="text-lg font-semibold text-slate-900">{user.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{user.email}</p>
                    <p className="mt-2 text-sm text-slate-500">
                      Role: <span className="font-medium text-slate-700">{user.role}</span>
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Joined {formatDate(user.createdAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-2xl font-semibold text-slate-900">Recent Habits</h3>
            <div className="mt-6 space-y-4">
              {loading ? (
                <p className="text-slate-500">Loading habits...</p>
              ) : recentHabits.length === 0 ? (
                <p className="text-slate-500">No habits found.</p>
              ) : (
                recentHabits.map((habit) => (
                  <div key={habit._id} className="rounded-2xl bg-slate-50 px-5 py-4">
                    <p className="text-lg font-semibold text-slate-900">{habit.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{habit.user?.name || '-'}</p>
                    <p className="mt-1 text-sm text-slate-500">{habit.category?.name || '-'}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;