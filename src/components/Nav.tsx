import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

export const Nav = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when clicking a link or resizing
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth > 768) setIsOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/login');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) => 
    `text-sm font-black uppercase tracking-widest transition-all hover:text-red-600 ${
      isActive ? 'text-red-600' : 'text-slate-400'
    }`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) => 
    `text-2xl font-black uppercase tracking-tighter transition-all ${
      isActive ? 'text-red-600' : 'text-slate-900'
    }`;

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[60] bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-5xl mx-auto h-20 flex items-center justify-between px-6 md:px-8">
          
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <NavLink to="/" onClick={closeMenu} className="text-2xl font-black tracking-tighter text-slate-900 group">
              IIUC<span className="text-red-600 group-hover:animate-pulse">.</span>Blood
            </NavLink>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8 border-l border-slate-100 pl-8">
              <NavLink to="/about" className={linkClass}>About</NavLink>
              <NavLink to="/blooddashboard" className={linkClass}>Donate</NavLink>
              <NavLink to="/bloodrequest" className={linkClass}>Request</NavLink>
            </div>
          </div>

          {/* Right Side: Desktop Buttons + Mobile Toggle */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              {isLoggedIn ? (
                <button onClick={handleLogout} className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-slate-100">
                  Logout
                </button>
              ) : (
                <NavLink to="/login" className="bg-red-600 text-white px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-red-100">
                  Sign In
                </NavLink>
              )}
            </div>

            {/* Hamburger Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-slate-900 transition-transform active:scale-90"
            >
              {isOpen ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
              ) : (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 8h16M4 16h16"/></svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-50 bg-white transition-transform duration-500 ease-in-out md:hidden ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex flex-col items-center justify-center h-full space-y-8 p-6">
          <NavLink to="/about" onClick={closeMenu} className={mobileLinkClass}>About</NavLink>
          <NavLink to="/blooddashboard" onClick={closeMenu} className={mobileLinkClass}>Donate</NavLink>
          <NavLink to="/bloodrequest" onClick={closeMenu} className={mobileLinkClass}>Request</NavLink>
          
          <div className="w-full pt-8 border-t border-slate-100 flex flex-col items-center">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="w-full max-w-xs bg-slate-900 text-white py-4 rounded-3xl font-black uppercase tracking-widest">
                Logout
              </button>
            ) : (
              <NavLink to="/login" onClick={closeMenu} className="w-full max-w-xs bg-red-600 text-white py-4 rounded-3xl font-black uppercase tracking-widest text-center shadow-xl shadow-red-100">
                Sign In
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </>
  );
};