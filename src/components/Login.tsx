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

  // Main Login function
  function handleLogin() {
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

    fetch(`${BaseURL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone: phoneToSend,
        password: Password
      })
    })
      .then(async (response) => {
        const data = await response.json();

        if (data.message === 'Wrong password') {
          alert('Wrong Password');
        } else if (data.message === 'User not found') {
          alert('User not found');
        } else if (data.message === 'Login success!') {
          console.log('Login successful:', data);

          setUserID(data.id);
          setIsLoggedIn(true);
          localStorage.setItem('userId', data.id);
          localStorage.setItem('IsLoggedIn', 'true');

          // Navigate immediately on success
          navigate('/mainpage');
        } else {
          alert(data.error || data.message || 'Login failed');
        }
      })
      .catch((err) => {
        console.error('Login error:', err);
        alert('Network error. Please try again.');
      });
  }

  return (
    <>
      <UserContext.Provider value={UserID}>
        { /*Add child from where You want to get UserID from*/ }
      </UserContext.Provider>

      <>
        <div className='bg-blue-300 w-[400px] h-[300px] flex flex-col items-center justify-center gap-4 rounded-lg shadow-xl text-center'>
          <input
            className='p-2 border border-gray-300 rounded-md'
            type="text"
            placeholder='0188XXXXXXX'
            value={Phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            className='p-2 border border-gray-300 rounded-md'
            type="password"
            placeholder='Password'
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className='bg-blue-500 text-white px-4 py-2 rounded-md'
            onClick={handleLogin}
          >
            Login
          </button>
          <p>Don't have an account? <span><Link to="/register" className='text-sm text-blue-700 hover:underline'> Register</Link></span> </p>
        </div>

        <div>
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
        </div>
      </>
    </>
  );
}
