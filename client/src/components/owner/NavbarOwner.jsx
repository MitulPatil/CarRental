import React from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NavbarOwner = () => {

    const { user } = useAuth();
  return (
    <div className='flex items-center justify-between px-6 md:px-20 py-4 text-gray-500 border-b border-borderColor relative transition-all'>
       <Link to='/'>
            <div className='flex items-center gap-1 cursor-pointer'>
              <img src={assets.car_icon} alt="" className='h-6'/>
              <h1 className='text-primary font-bold text-2xl sm:text-xl'>Car Rental</h1>
            </div>
       </Link> 
       <p>Welcome, {user?.name || "Owner"}</p>
    </div>
  )
}

export default NavbarOwner