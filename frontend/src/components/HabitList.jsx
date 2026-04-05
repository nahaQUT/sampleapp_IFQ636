const HabitList = ({
  habits = [],
  onEdit,
  onDelete,
  onComplete,
  loading = false,
  todayDate,
}) => {
  const isCompletedToday = (habit) =>
    habit.completionHistory?.some((item) => item.date === todayDate);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-slate-500">Loading habits...</p>
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-slate-500">No habits found. Create your first habit to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {habits.map((habit) => {
        const completedToday = isCompletedToday(habit);

        return (
          <div
            key={habit._id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-semibold text-slate-900">{habit.title}</h3>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {habit.category?.name || 'No category'}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium capitalize text-emerald-700">
                    {habit.frequency}
                  </span>
                  {habit.frequency === 'weekly' && habit.daysOfWeek?.length > 0 ? (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {habit.daysOfWeek.join(', ')}
                    </span>
                  ) : null}
                  {completedToday ? (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                      Completed Today
                    </span>
                  ) : null}
                </div>

                <p className="text-sm text-slate-500">
                  {habit.description || 'No description provided.'}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                  <span>
                    Start Date:{' '}
                    {habit.startDate
                      ? new Date(habit.startDate).toLocaleDateString()
                      : '-'}
                  </span>
                  <span>Total Completions: {habit.completionHistory?.length || 0}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onComplete(habit)}
                  disabled={completedToday}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    completedToday
                      ? 'cursor-not-allowed bg-emerald-100 text-emerald-700'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {completedToday ? 'Completed' : 'Complete'}
                </button>

                <button
                  type="button"
                  onClick={() => onEdit(habit)}
                  disabled={completedToday}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    completedToday
                      ? 'cursor-not-allowed bg-slate-200 text-slate-400'
                      : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(habit)}
                  disabled={completedToday}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    completedToday
                      ? 'cursor-not-allowed bg-slate-200 text-slate-400'
                      : 'border border-red-200 text-red-600 hover:bg-red-50'
                  }`}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HabitList;