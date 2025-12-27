import {React,useState} from 'react'
import {assets,menuLinks} from '../assets/assets'
import {Link, useLocation, useNavigate} from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = ({setShowLogin}) => {

    const { user, logout, isAuthenticated, loading } = useAuth();
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/');
    };

  return (
    <div className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all ${location.pathname === "/" && "bg-light"}`}>
        <Link to='/'>
            <div className='flex items-center gap-1 cursor-pointer'>
            <img src={assets.car_icon} alt="" className='h-6'/>
            <h1 className='text-primary font-bold text-2xl sm:text-xl'>Car Rental</h1>
            </div>
        </Link>
        

        <div className={` max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-broderColor right-0 flex flex-col sm:flex-row items-center sm:items-center gap-4 sm-gap-8 max-sm:p-4 transition-all duration-300 z-50 ${location.pathname === "/" ? "bg-light": "bg-white"} ${open ? "max-sm:translate-x-0": "max-sm:translate-x-full"}`}>
            {menuLinks
                .filter(link => {
                    // Hide "My Bookings" from menu if user is logged in (shown as button instead)
                    if (link.path === '/my-bookings' && isAuthenticated) {
                        return false;
                    }
                    return true;
                })
                .map((link,index)=>(
                    <Link key={index} to={link.path}>
                        {link.name}
                    </Link>
                ))}

            <div className='flex max-sm:flex-col items-center sm:items-center gap-6'>
                {!loading && (
                    <>
                        {isAuthenticated && user?.role === 'owner' && (
                            <button onClick={()=> navigate('/owner')} className="cursor-pointer hover:text-primary transition-colors">Owner Dashboard</button>
                        )}
                        {isAuthenticated && user?.role === 'user' && (
                            <button onClick={()=> navigate('/my-bookings')} className="cursor-pointer hover:text-primary transition-colors">My Bookings</button>
                        )}
                        {isAuthenticated ? (
                            <div className='flex items-center gap-4'>
                                <span className='text-sm text-gray-700'>Hi, {user?.name}</span>
                                <button onClick={handleLogout} className='cursor-pointer px-8 py-2 bg-red-500 hover:bg-red-600 transition-all text-white rounded-lg'>Logout</button>
                            </div>
                        ) : (
                            <button onClick={()=> setShowLogin(true)} className='cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg'>Login</button>
                        )}
                    </>
                )}
            </div>  
        </div>
        <button className="lg:hidden min-md:hidden cursor-pointer" aria-label="Menu" onClick={()=> setOpen(!open)}>
            <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
        </button>
    </div>
  )
}

export default Navbar