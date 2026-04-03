import { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../axiosConfig';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import SummaryCards from '../components/SummaryCards';

const dayKeys = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const UserDashboard = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const now = new Date();
  const todayDate = getLocalDateString(now);
  const todayKey = dayKeys[now.getDay()];

  useEffect(() => {
    const fetchHabits = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await axiosInstance.get('/api/habits');
        setHabits(response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, []);

  const completedToday = useMemo(() => {
    return habits.filter((habit) =>
      habit.completionHistory?.some((item) => item.date === todayDate)
    ).length;
  }, [habits, todayDate]);

  const currentStreak = useMemo(() => {
    const allDates = habits.flatMap((habit) =>
      (habit.completionHistory || []).map((item) => item.date)
    );

    const uniqueDates = [...new Set(allDates)].sort((a, b) => new Date(b) - new Date(a));

    if (uniqueDates.length === 0) return 0;

    let streak = 0;
    const cursor = new Date();

    while (true) {
      const cursorDate = getLocalDateString(cursor);

      if (uniqueDates.includes(cursorDate)) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }, [habits]);

  const completionRate = habits.length
    ? Math.round((completedToday / habits.length) * 100)
    : 0;

  const recentHabits = habits.slice(0, 5);

  const todayHabits = useMemo(() => {
    return habits.filter((habit) => {
      const startDate = habit.startDate ? getLocalDateString(new Date(habit.startDate)) : null;

      if (startDate && startDate > todayDate) {
        return false;
      }

      if (habit.frequency === 'daily') {
        return true;
      }

      if (habit.frequency === 'weekly') {
        return habit.daysOfWeek?.includes(todayKey);
      }

      return false;
    });
  }, [habits, todayDate, todayKey]);

  const recentCompletionHistory = useMemo(() => {
    return habits
      .flatMap((habit) =>
        (habit.completionHistory || []).map((item) => ({
          habitTitle: habit.title,
          date: item.date,
          completedAt: item.completedAt,
        }))
      )
      .sort((a, b) => new Date(b.completedAt || b.date) - new Date(a.completedAt || a.date))
      .slice(0, 5);
  }, [habits]);

  const cards = [
    { label: 'Total Habits', value: habits.length },
    { label: 'Completed Today', value: completedToday },
    { label: 'Current Streak', value: currentStreak },
    { label: 'Completion Rate', value: `${completionRate}%` },
  ];

  const formatDate = (dateValue) => {
    if (!dateValue) return '-';
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return dateValue;
    return date.toLocaleDateString();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader
          title="User Dashboard"
          subtitle="Track your habits and stay consistent every day."
        />

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        ) : null}

        <SummaryCards cards={cards} />

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Recent Habits</h3>
            <div className="mt-4 space-y-3">
              {loading ? (
                <p className="text-slate-500">Loading habits...</p>
              ) : recentHabits.length > 0 ? (
                recentHabits.map((habit) => (
                  <div
                    key={habit._id}
                    className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <p className="font-medium text-slate-900">{habit.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {habit.category?.name || 'No category'}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500">No habits created yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Today Habits</h3>
            <div className="mt-4 space-y-3">
              {loading ? (
                <p className="text-slate-500">Loading habits...</p>
              ) : todayHabits.length > 0 ? (
                todayHabits.map((habit) => {
                  const completed = habit.completionHistory?.some(
                    (item) => item.date === todayDate
                  );

                  return (
                    <div
                      key={habit._id}
                      className={`rounded-xl border px-4 py-3 ${
                        completed
                          ? 'border-emerald-100 bg-emerald-50'
                          : 'border-slate-100 bg-slate-50'
                      }`}
                    >
                      <p className="font-medium text-slate-900">{habit.title}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {habit.frequency === 'weekly' && habit.daysOfWeek?.length > 0
                          ? `Weekly: ${habit.daysOfWeek.join(', ')}`
                          : 'Daily habit'}
                      </p>
                      <p className={`mt-1 text-sm ${completed ? 'text-emerald-700' : 'text-slate-500'}`}>
                        {completed ? 'Completed today' : 'Pending today'}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-slate-500">No habits scheduled for today.</p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Recent Completion History</h3>
          <div className="mt-4 space-y-3">
            {loading ? (
              <p className="text-slate-500">Loading history...</p>
            ) : recentCompletionHistory.length > 0 ? (
              recentCompletionHistory.map((item, index) => (
                <div
                  key={`${item.habitTitle}-${item.date}-${index}`}
                  className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <p className="font-medium text-slate-900">{item.habitTitle}</p>
                  <p className="mt-1 text-sm text-slate-500">{formatDate(item.date)}</p>
                </div>
              ))
            ) : (
              <p className="text-slate-500">No completion history yet.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;