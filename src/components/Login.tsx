import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Backend API base URL
const BaseURL = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [Phone, setPhone] = useState('');
  const [Password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');

    if (!Phone || !Password) {
      setError('Phone and password are required');
      return;
    }

    setIsLoading(true);

    try {
      const phoneNormalized = String(Phone).replace(/\s|-/g, '');
      let phoneToSend = phoneNormalized;
      if (phoneNormalized.startsWith('+88')) {
        phoneToSend = phoneNormalized.slice(3);
      } else if (phoneNormalized.startsWith('88')) {
        phoneToSend = phoneNormalized.slice(2);
      }

      setPhone(phoneToSend);

      const res = await fetch(`${BaseURL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneToSend, password: Password })
      });

      const data = await res.json();

      if (data.message === 'Login success!') {
        setIsLoggedIn(true);
        login(data.id);
        // Small delay to let the user see the success animation
        setTimeout(() => navigate('/'), 1500);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-100 overflow-hidden font-sans mt-20">
      
      {/* Abstract Geometric Shapes */}
      <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      
      <div className="relative w-full max-w-md px-6">
        {/* Branding */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-red-600 to-rose-500 rounded-2xl rotate-12 mb-4 shadow-xl shadow-red-200">
            <span className="text-white text-2xl font-black -rotate-12">B+</span>
          </div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">IIUC Blood Network</h1>
          <p className="text-gray-500 mt-2 font-medium">Connecting donors, saving lives.</p>
        </div>

        {/* Login Glass Card */}
        <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl shadow-2xl p-8">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold rounded-r-lg animate-bounce-in">
              {error.toUpperCase()}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="group">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1 group-focus-within:text-red-500 transition-colors">Phone Number</label>
              <input
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-red-400 focus:bg-white outline-none transition-all placeholder:text-gray-300"
                type="text"
                placeholder="0188XXXXXXX"
                value={Phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="group relative">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1 group-focus-within:text-red-500 transition-colors">Password</label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-red-400 focus:bg-white outline-none transition-all placeholder:text-gray-300 pr-12"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={Password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {/* Show/Hide Password Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-600 to-rose-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-100 hover:shadow-red-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            <p className="text-gray-500 text-sm font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-red-600 font-bold hover:text-red-700 underline-offset-4 hover:underline transition-all">
                Join the Network
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Login Success Overlay */}
      {isLoggedIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-900/10 backdrop-blur-md transition-all duration-500">
          <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-sm mx-4 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">Login Successful</h2>
            <p className="text-gray-500 font-medium">Welcome back to the family.</p>
          </div>
        </div>
      )}
    </div>
  );
};