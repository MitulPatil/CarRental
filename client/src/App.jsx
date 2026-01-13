import {React,useState,useEffect} from 'react'
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import {useLocation,Routes,Route,useNavigate} from 'react-router-dom';
import Home from './pages/Home';
import Cars from './pages/Cars';
import CarDetails from './pages/CarDetails';
import MyBookings from './pages/MyBookings';
import Layout from './pages/owner/Layout';
import Dashboard from './pages/owner/Dashboard';
import AddCar from './pages/owner/AddCar';
import ManageCars from './pages/owner/ManageCars';
import ManageBookings from './pages/owner/ManageBookings';
import Login from './components/Login';
import { useAuth } from './context/AuthContext';
import { toast } from 'react-toastify';

const App = () => {

  const [showLogin , setShowLogin] = useState(false)
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const isOwnerpath = location.pathname.startsWith('/owner');

  // Handle token from URL parameters (email verification redirect)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const verified = params.get('verified');
    const name = params.get('name');

    if (token && verified === 'true') {
      // Auto-login with the token
      login(token).then(() => {
        toast.success(`Account created successfully! Welcome ${name || ''}!`);
        // Remove token from URL
        navigate('/', { replace: true });
      }).catch((error) => {
        console.error('Auto-login failed:', error);
        toast.error('Auto-login failed. Please login manually.');
        navigate('/', { replace: true });
      });
    }
  }, [location.search, login, navigate]);

  return (
    <>

      {showLogin && <Login setShowLogin={setShowLogin}/>}
      {!isOwnerpath && <Navbar setShowLogin={setShowLogin}/>}

      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/car-details/:id' element={<CarDetails/>}/>
        <Route path='/cars' element={<Cars/>}/>
        <Route path='/my-bookings' element={<MyBookings/>}/>
        <Route path='/owner' element={<Layout/>}>
          <Route index element={<Dashboard/>}/>
          <Route path='add-car' element={<AddCar/>}/>
          <Route path='manage-cars' element={<ManageCars/>}/>
          <Route path='manage-bookings' element={<ManageBookings/>}/>
        </Route>
      </Routes>

      {!isOwnerpath && <Footer/>}
    </>
  )
}

export default App