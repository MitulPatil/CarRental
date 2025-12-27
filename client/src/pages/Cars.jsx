import {React,useState,useEffect} from 'react'
import Title from '../components/Title';
import { assets, dummyCarData } from '../assets/assets';
import CarCard from '../components/CarCard';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';


const Cars = () => {
  const [searchParams] = useSearchParams();
  const location = searchParams.get('location');
  const pickupDate = searchParams.get('pickupDate');
  const returnDate = searchParams.get('returnDate');

  const [input,setInput] = useState('')
  const [cars, setCars] = useState(dummyCarData); // Start with dummy data
  const [filteredCars, setFilteredCars] = useState(dummyCarData);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchAvailableCars = async () => {
    try {
      setLoading(true);
      
      // Build URL with optional filter parameters
      let url = `${backendUrl}/api/cars/all`;
      const params = new URLSearchParams();
      
      if (location) params.append('location', location);
      if (pickupDate) params.append('pickupDate', pickupDate);
      if (returnDate) params.append('returnDate', returnDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const { data } = await axios.get(url);
      
      if (data.success) {
        if (data.cars.length > 0) {
          setCars(data.cars);
          setFilteredCars(data.cars);
          
          // Show filter info message
          if (location && pickupDate && returnDate) {
            toast.success(`Found ${data.cars.length} cars in ${location} for your dates`);
          } else if (location) {
            toast.success(`Found ${data.cars.length} cars in ${location}`);
          }
        } else {
          // No cars found
          if (location || pickupDate || returnDate) {
            toast.info('No cars available for the selected filters');
          }
          setCars([]);
          setFilteredCars([]);
        }
      } else {
        toast.error(data.message || 'Failed to fetch cars');
      }
    } catch (error) {
      console.error('Error fetching cars:', error.message);
      toast.error('Failed to fetch cars from server');
      // On error, keep showing current data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableCars();
  }, [location, pickupDate, returnDate]); // Re-fetch when search params change

  useEffect(() => {
    if (input.trim() === '') {
      setFilteredCars(cars);
    } else {
      const filtered = cars.filter(car => 
        car.brand.toLowerCase().includes(input.toLowerCase()) ||
        car.model.toLowerCase().includes(input.toLowerCase()) ||
        car.category.toLowerCase().includes(input.toLowerCase()) ||
        car.description.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredCars(filtered);
    }
  }, [input, cars]);

  return (
    <div>
      <div className='flex flex-col items-center py-20 bg-light max-md:px-4'>
        <Title title='Available Cars' subTitle='Browse our selection of premium vechicles available for your next advanture'/>

        <div className='flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow'>
          <img src={assets.search_icon} alt="" className='w-4.5 h-4.5 mr-2'/>
          <input onChange={(e)=> setInput(e.target.value)} value={input} type="text" placeholder='Search by make, model or features' className='w-full h-full text-gray-500 outline-none'/>
          <img src={assets.filter_icon} alt="" className='w-4.5 h-4.5 ml-2'/>
        </div>

        {/* Display active filters */}
        {(location || pickupDate || returnDate) && (
          <div className='mt-4 max-w-140 w-full bg-blue-50 border border-blue-200 rounded-lg p-4'>
            <p className='text-sm font-medium text-gray-700 mb-2'>Active Filters:</p>
            <div className='flex flex-wrap gap-2'>
              {location && (
                <span className='px-3 py-1 bg-white rounded-full text-sm border border-gray-200'>
                  📍 Location: <strong>{location}</strong>
                </span>
              )}
              {pickupDate && (
                <span className='px-3 py-1 bg-white rounded-full text-sm border border-gray-200'>
                  📅 Pickup: <strong>{new Date(pickupDate).toLocaleDateString()}</strong>
                </span>
              )}
              {returnDate && (
                <span className='px-3 py-1 bg-white rounded-full text-sm border border-gray-200'>
                  📅 Return: <strong>{new Date(returnDate).toLocaleDateString()}</strong>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'>
        {loading ? (
          <p className='text-center text-gray-500'>Loading cars...</p>
        ) : (
          <>
            <p className='text-gray-500 xl:px-20 max-w-7xl mx-auto'>Showing {filteredCars.length} Cars</p>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto'>
              {filteredCars.map((car, index) => (
                <CarCard key={index} car={car} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Cars