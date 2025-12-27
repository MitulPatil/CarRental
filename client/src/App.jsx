import {React,useState} from 'react'
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import {useLocation,Routes,Route} from 'react-router-dom';
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

const App = () => {

  const [showLogin , setShowLogin] = useState(false)
  const isOwnerpath = useLocation().pathname.startsWith('/owner');

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