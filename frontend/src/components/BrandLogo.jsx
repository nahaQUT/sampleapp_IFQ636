const BrandLogo = ({ admin = false }) => {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-sm ${
          admin
            ? 'bg-gradient-to-br from-cyan-500 to-indigo-600'
            : 'bg-gradient-to-br from-emerald-500 to-teal-500'
        }`}
      >
        <span className="text-lg font-bold">HM</span>
      </div>

      <div>
        <h1 className="text-xl font-bold text-slate-900">Habit Mate</h1>
        <p className={`text-xs font-medium ${admin ? 'text-indigo-600' : 'text-emerald-600'}`}>
          {admin ? 'System Management' : 'Build Better Habits'}
        </p>
      </div>
    </div>
  );
};

export default BrandLogo;