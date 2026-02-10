import { createContext, useState } from 'react';
import { MainPage } from './MainPage';
import { BloodDashboard } from './BloodDashboard';
import { Link } from 'react-router-dom';

const BaseURL = import.meta.env.VITE_API_BASE;
export const UserContext= createContext("");

export const Login = () => {

  let [Phone, setPhone] = useState('');
  let [Password, setPassword] = useState('');
  let [UserID,setUserID] = useState('');
  let [isLoggedIn, setIsLoggedIn] = useState(false);

 
//Main Login function

  function handleLogin() {
    fetch(`${BaseURL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone: Phone,
        password: Password
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.message == 'Wrong password') {
        alert('Wrong Password');
      }
        else if (data.message == 'User not found') {
          alert('User not found');
        }
       else if (data.message == 'Login success!') {
        console.log('Login successful:', data);
        
        setUserID(data.id);
        setIsLoggedIn(true);
        localStorage.setItem('userId', data.id);
        localStorage.setItem('IsLoggedIn', 'true');
        setIsLoggedIn(localStorage.getItem('IsLoggedIn') === 'true');
         if (isLoggedIn) {
          window.location.href = '/mainpage';
         }
      }
    })
  }


  


  return (
  

    <>
    
      <UserContext.Provider value={UserID}  >
        
        
        { /*Add child from where You want to get UserID from*/ }


      </UserContext.Provider>





{  (
  <>
    <div className='bg-blue-300 w-[400px] h-[300px] flex flex-col items-center justify-center gap-4 rounded-lg shadow-xl text-center'>
      <input className='p-2 border border-gray-300 rounded-md' type="text" placeholder='0188XXXXXXX' value={Phone} onChange={(e) => setPhone(e.target.value)} />
      <input className='p-2 border border-gray-300 rounded-md' type="password" placeholder='Password' value={Password} onChange={(e) => setPassword(e.target.value)} />
      <button className='bg-blue-500 text-white px-4 py-2 rounded-md' onClick={handleLogin}>Login</button>
       <p>Don't have an account? <span><Link to = "/register" className='text-sm text-blue-700 hover:underline'> Register</Link></span> </p> 
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
      )
      }
      </div>
  </>
)}
    </>
  )
  
}
