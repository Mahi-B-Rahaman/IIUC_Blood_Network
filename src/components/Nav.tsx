import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Nav = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Modern NavLink Styling
  const linkClass = ({ isActive }: { isActive: boolean }) => 
    `text-sm font-black uppercase tracking-widest transition-all hover:text-red-600 ${
      isActive ? 'text-red-600' : 'text-slate-400'
    }`;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 ">
      <div className="max-w-5xl mx-auto h-20 flex items-center justify-between px-8">
        
        {/* Logo Section */}
        <div className="flex items-center gap-8">
          <NavLink to="/" className="text-2xl font-black tracking-tighter text-slate-900 group">
            IIUC<span className="text-red-600 group-hover:animate-pulse">.</span>Blood
          </NavLink>

          {/* Main Links */}
          <div className="hidden md:flex items-center gap-8 border-l border-slate-100 pl-8">
            <NavLink to="/about" className={linkClass}>About</NavLink>
            <NavLink to="/blooddashboard" className={linkClass}>Donate</NavLink>
            <NavLink to="/bloodrequest" className={linkClass}>Request</NavLink>
          </div>
        </div>

        {/* Action Section */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <button 
              onClick={handleLogout} 
              className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-slate-100 active:scale-95"
            >
              Logout
            </button>
          ) : (
            <NavLink 
              to="/login" 
              className="bg-red-600 text-white px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-red-100"
            >
              Sign In
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};