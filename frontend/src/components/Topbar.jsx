import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-slate-200 bg-white px-6 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">{isAdmin ? 'System area' : 'Welcome back'}</p>
          <h2 className="text-2xl font-semibold text-slate-900">
            {isAdmin ? 'Admin Panel' : user?.name || 'User'}
          </h2>
        </div>

        <button
          onClick={handleLogout}
          className={`rounded-xl px-4 py-2 text-sm font-medium text-white transition ${
            isAdmin
              ? 'bg-indigo-600 hover:bg-indigo-700'
              : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;