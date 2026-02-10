import { NavLink } from 'react-router-dom'

export const Nav = () => {
  return (
    <>
    <div className='bg-red-600 w-full h-16 flex justify-center text-white text-2xl font-bold p-4'>
        <div>
            <NavLink to="/" className="hover:text-black mr-4"  >IIUC_Blood.net </NavLink>
            <NavLink to="/about">AboutUs</NavLink>
            <NavLink to="/blooddashboard" className="ml-4">Dashboard</NavLink>
            <NavLink to="/bloodrequest" className="ml-4">RequestBlood</NavLink>
        </div>
    </div>
    </>
  )
}
