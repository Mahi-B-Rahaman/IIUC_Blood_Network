import  { useContext } from 'react'
import { UserContext } from './Login';  
import { Link } from 'react-router-dom';

export const MainPage = () => {
 const UserID =  useContext(UserContext);
  
  return (
    <>
    <h1 className='bg-black'>Welcome {UserID}</h1>
    <Link to="/blooddashboard">Go to Dashboard</Link>
    </>
  )
}
