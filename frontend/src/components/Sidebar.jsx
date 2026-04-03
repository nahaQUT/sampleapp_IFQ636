import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BrandLogo from './BrandLogo';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isAdmin = user?.role === 'admin';

  const userLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Habits', path: '/habits' },
    { name: 'Profile', path: '/profile' },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Users', path: '/admin/users' },
    { name: 'Habits', path: '/admin/habits' },
    { name: 'Categories', path: '/admin/categories' },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <aside className="w-full border-r border-slate-200 bg-white md:w-72">
      <div className="border-b border-slate-200 p-6">
        <BrandLogo admin={isAdmin} />
      </div>

      <nav className="space-y-2 p-4">
        {links.map((link) => {
          const isActive = location.pathname === link.path;

          return (
            <Link
              key={link.path}
              to={link.path}
              className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? isAdmin
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;