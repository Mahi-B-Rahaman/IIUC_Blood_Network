import { NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export const Nav = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const val = localStorage.getItem('IsLoggedIn') === 'true' || !!localStorage.getItem('userId');
    setIsLoggedIn(val);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('IsLoggedIn');
    // remove any other auth keys if present
    try { localStorage.removeItem('token'); } catch {}
    setIsLoggedIn(false);
    navigate('/');
  }

  return (
    <div className='bg-red-600 w-full h-16 flex items-center text-white text-2xl font-bold px-6'>
      <div className='flex items-center gap-4'>
        <NavLink to="/" className="hover:text-black mr-4">IIUC_Blood.net</NavLink>
        <NavLink to="/about">AboutUs</NavLink>
        <NavLink to="/blooddashboard" className="ml-4">DonateBlood</NavLink>
        <NavLink to="/bloodrequest" className="ml-4">RequestBlood</NavLink>
      </div>

      <div className='ml-auto flex items-center gap-4 text-base'>
        {!isLoggedIn ? (
          <NavLink to="/register" className='text-white/90 hover:underline'>Register</NavLink>
        ) : (
          <button onClick={handleLogout} className='bg-white text-red-600 px-3 py-1 rounded-md font-medium hover:bg-white/90'>Logout</button>
        )}
      </div>
    </div>
  )
}
