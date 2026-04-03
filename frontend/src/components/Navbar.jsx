import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-black text-white px-8 py-4 flex justify-between items-center shadow-lg">
            <Link to="/" className="text-2xl font-bold tracking-widest uppercase">
                LearnShare
            </Link>
            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        <Link to="/resources" className="text-sm uppercase tracking-wider hover:text-gray-300">
                            Resources
                        </Link>
                        {user.role === 'admin' && (
                            <Link
                                to="/admin"
                                className="text-sm uppercase tracking-wider border border-white px-3 py-1 rounded hover:bg-white hover:text-black transition"
                            >
                                Dashboard
                            </Link>
                        )}
                        <Link to="/profile" className="text-sm uppercase tracking-wider hover:text-gray-300">
                            Profile
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="text-sm uppercase tracking-wider bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/resources" className="text-sm uppercase tracking-wider hover:text-gray-300">
                            Resources
                        </Link>
                        <Link to="/login" className="text-sm uppercase tracking-wider hover:text-gray-300">
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="text-sm uppercase tracking-wider bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition"
                        >
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;