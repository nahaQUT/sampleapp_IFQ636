import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = (path) =>
    `px-3 py-1 text-sm ${location.pathname === path ? 'text-gray-900 font-semibold' : 'text-gray-600 hover:text-gray-900'}`;

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
      <div className="flex items-center space-x-8">
        <Link to={user?.isAdmin ? '/admin/dashboard' : '/shipment-history'} className="flex items-center space-x-2">
          <span className="text-xl font-bold text-gray-700">CMS</span>
        </Link>
        {user && (
          <div className="flex items-center space-x-6">
            <Link to="/create-shipment" className={linkClass('/create-shipment')}>Create Shipment</Link>
            <Link to="/track-package" className={linkClass('/track-package')}>Track Package</Link>
            <Link to="/shipment-history" className={linkClass('/shipment-history')}>Shipment History</Link>
            {user.isAdmin && (
              <Link to="/admin/packages" className={linkClass('/admin/packages')}>Manage Packages</Link>
            )}
          </div>
        )}
      </div>
      <div>
        {user && (
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
