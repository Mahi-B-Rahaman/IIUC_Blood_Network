import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const MainPage = () => {
 const { userId } = useAuth();
  
  return (
    <>
    <h1 className='bg-black'>Welcome {userId}</h1>
    <Link to="/blooddashboard">Go to Dashboard</Link>
    </>
  )
}
