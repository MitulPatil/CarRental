import {React,useState} from 'react'
import {assets, cityList} from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Hero = () => {
    const navigate = useNavigate();
    const [pickupLocation, setpickupLocation] = useState('');
    const [pickupDate, setPickupDate] = useState('');
    const [returnDate, setReturnDate] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        
        // Validation
        if (!pickupLocation) {
            toast.error('Please select a pickup location');
            return;
        }
        if (!pickupDate || !returnDate) {
            toast.error('Please select pickup and return dates');
            return;
        }
        if (new Date(returnDate) <= new Date(pickupDate)) {
            toast.error('Return date must be after pickup date');
            return;
        }

        // Navigate to cars page with search parameters
        navigate(`/cars?location=${encodeURIComponent(pickupLocation)}&pickupDate=${pickupDate}&returnDate=${returnDate}`);
    };

  return (
    <div className='h-screen w-full flex flex-col items-center justify-center gap-14 bg-light text-center'>
        <h1 className='text-4xl md:text-5xl font-semibold top-1 sm:top-4 md:top-4'>Luxury cars on Rent</h1>

        <form onSubmit={handleSearch} className='flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-lg md:rounded-full w-full max-w-80 md:max-w-200 bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]'>
            <div className='flex flex-col md:flex-row items-start md:items-center gap-10 min-md:ml-8'>
                <div className='flex flex-col items-start gap-2'>
                    <select required value={pickupLocation} onChange={(e)=>setpickupLocation(e.target.value)}>
                    <option value="">Pickup Location</option>
                    {cityList.map((city)=>(
                        <option key={city} value={city}>{city}</option> 
                    ))}
                </select>
                <p className='px-1 text-sm text-gray-500'>{pickupLocation ? pickupLocation : 'Please Select location'}</p>
                </div>
                <div className='flex flex-col items-start gap-2'>
                    <label htmlFor="pickup-date">Pick-up Date</label>
                    <input 
                        type="date" 
                        id='pickup-date' 
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]} 
                        className='text-sm text-gray-500' 
                        required
                    />
                </div>
                <div className='flex flex-col items-start gap-2'>
                    <label htmlFor="return-date">Return Date</label>
                    <input 
                        type="date" 
                        id='return-date'
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        min={pickupDate || new Date().toISOString().split('T')[0]}
                        className='text-sm text-gray-500' 
                        required
                    />
                </div>
            </div>
            <button type='submit' className='flex items-center justify-center gap-1 px-9 py-3 max-sm:mt-4 bg-primary hover:bg-primary-dull text-white rounded-full cursor-pointer'>
                <img src={assets.search_icon} alt="search" className=''/>
                Search
            </button>
        </form>

        <img className='max-h-74' src={assets.main_car} alt="" />
    </div>
  )
}

export default Hero