import { useEffect, useState } from 'react';

const dayOptions = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const HabitForm = ({
  categories = [],
  onSubmit,
  onCancel,
  initialData = null,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    frequency: 'daily',
    daysOfWeek: [],
    startDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category?._id || initialData.category || '',
        frequency: initialData.frequency || 'daily',
        daysOfWeek: initialData.daysOfWeek || [],
        startDate: initialData.startDate
          ? new Date(initialData.startDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
      });
      return;
    }

    setFormData({
      title: '',
      description: '',
      category: categories[0]?._id || '',
      frequency: 'daily',
      daysOfWeek: [],
      startDate: new Date().toISOString().split('T')[0],
    });
  }, [initialData, categories]);

  const handleFrequencyChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      frequency: value,
      daysOfWeek: value === 'weekly' ? prev.daysOfWeek : [],
    }));
  };

  const handleDayToggle = (day) => {
    setFormData((prev) => {
      const exists = prev.daysOfWeek.includes(day);

      return {
        ...prev,
        daysOfWeek: exists
          ? prev.daysOfWeek.filter((item) => item !== day)
          : [...prev.daysOfWeek, day],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      daysOfWeek: formData.frequency === 'weekly' ? formData.daysOfWeek : [],
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h3 className="text-xl font-semibold text-slate-900">
          {initialData ? 'Edit Habit' : 'Create Habit'}
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          {initialData ? 'Update your habit details.' : 'Add a new habit to track every day.'}
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Habit Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
          placeholder="Enter habit title"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Description</label>
        <textarea
          rows="4"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
          placeholder="Enter description"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Category</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
          required
        >
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Frequency</label>
          <select
            value={formData.frequency}
            onChange={(e) => handleFrequencyChange(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Start Date</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {formData.frequency === 'weekly' ? (
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Days of Week</label>
          <div className="flex flex-wrap gap-2">
            {dayOptions.map((day) => {
              const isSelected = formData.daysOfWeek.includes(day);

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    isSelected
                      ? 'bg-emerald-600 text-white'
                      : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={
            isSubmitting ||
            categories.length === 0 ||
            (formData.frequency === 'weekly' && formData.daysOfWeek.length === 0)
          }
          className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Habit' : 'Create Habit'}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default HabitForm;