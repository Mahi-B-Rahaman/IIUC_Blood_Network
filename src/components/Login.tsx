import { createContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Backend API base URL (env on Vercel, localhost fallback for dev)
const BaseURL = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
export const UserContext = createContext("");

export const Login = () => {
  const navigate = useNavigate();

  const [Phone, setPhone] = useState('');
  const [Password, setPassword] = useState('');
  const [UserID, setUserID] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Main Login function
  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');

    // Basic client-side validation
    if (!Phone || !Password) {
      setError('Phone and password are required');
      return;
    }

    setIsLoading(true);

    try {
      // Normalize phone: remove spaces/dashes and send national format (e.g., 0188...)
      const phoneNormalized = String(Phone).replace(/\s|-/g, '');
      let phoneToSend = phoneNormalized;
      if (phoneNormalized.startsWith('+88')) {
        phoneToSend = phoneNormalized.slice(3);
      } else if (phoneNormalized.startsWith('88')) {
        phoneToSend = phoneNormalized.slice(2);
      }

      // Update displayed phone to the national format
      setPhone(phoneToSend);

      const res = await fetch(`${BaseURL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneToSend, password: Password })
      });

      const data = await res.json();

      if (data.message === 'Wrong password') {
        setError('Wrong password');
      } else if (data.message === 'User not found') {
        setError('User not found');
      } else if (data.message === 'Login success!') {
        setUserID(data.id);
        setIsLoggedIn(true);
        localStorage.setItem('userId', data.id);
        localStorage.setItem('IsLoggedIn', 'true');
        navigate('/mainpage');
      } else {
        setError(data.error || data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <UserContext.Provider value={UserID}>
        { /*Add child from where You want to get UserID from*/ }
      </UserContext.Provider>

      <>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-semibold text-red-600 text-center mb-6">IIUC Blood Network — Login</h1>

            {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  className="w-full p-2 border border-gray-300 rounded-md"
                  type="text"
                  placeholder="0188XXXXXXX"
                  value={Phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  className="w-full p-2 border border-gray-300 rounded-md"
                  type="password"
                  placeholder="Password"
                  value={Password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Link to="/register" className="text-sm text-blue-600 hover:underline">Create account</Link>
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded-md disabled:opacity-60"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Login'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {isLoggedIn && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-2xl text-center">
              <h2 className="text-2xl font-bold mb-4 text-green-600">Login Successful!</h2>
              <p className="mb-6 text-gray-600">Welcome back to IIUC Blood Network.</p>
              <Link to="/mainpage">
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition-colors">
                  Go to Dashboard
                </button>
              </Link>
            </div>
          </div>
        )}
      </>
    </>
  );
}
