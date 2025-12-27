import React, { useEffect,useState} from 'react'
import { assets } from '../../assets/assets';
import Title from '../../components/owner/Title';
import axios from 'axios';
import { toast } from 'react-toastify';

const ManageCars = () => {

  const currency = import.meta.env.VITE_CURRENCY;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOwnerCars = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login');
      return;
    }

    try {
      const { data } = await axios.get(`${backendUrl}/api/owner/cars`, {
        headers: { Authorization: token }
      });

      if (data.success) {
        setCars(data.cars);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  }

  const toggleAvailability = async (carId) => {
    const token = localStorage.getItem('token');
    try {
      const { data } = await axios.post(`${backendUrl}/api/owner/toggle-car`, 
        { carId },
        { headers: { Authorization: token } }
      );

      if (data.success) {
        toast.success('Car availability updated');
        fetchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update car');
    }
  }

  const deleteCar = async (carId) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;
    
    const token = localStorage.getItem('token');
    try {
      const { data } = await axios.post(`${backendUrl}/api/owner/delete-car`, 
        { carId },
        { headers: { Authorization: token } }
      );

      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete car');
    }
  }

  useEffect(() => {
    fetchOwnerCars();
  }, []);

  return (
    <div className='px-4 py-10 md:px-10 flex-1'>
      <Title title='Manage Your Cars' subTitle='View, edit, or remove your listed cars.' />
      {loading ? (
        <p className='text-center mt-6'>Loading cars...</p>
      ) : cars.length === 0 ? (
        <p className='text-center mt-6 text-gray-500'>No cars listed yet</p>
      ) : (
      <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>
        <table className='w-full border-collapse text-left text-sm text-gray-600'>
          <thead className='text-gray-500'>
            <tr>
              <th className='p-3 font-medium'>Car</th>
              <th className='p-3 font-medium max-md:hidden'>Category</th>
              <th className='p-3 font-medium'>Price</th>
              <th className='p-3 font-medium max-md:hidden'>Status</th>
              <th className='p-3 font-medium'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car,index)=>(
              <tr key={index} className='border-t border-borderColor hover:bg-light cursor-pointer'>
                <td className='p-3 flex items-center gap-3'>
                  <img src={car.image} alt="" className='w-12 h-12 object-cover aspect-square rounded-md' />
                  <div className='max-md:hidden'>
                    <p className='font-medium'>{car.brand} {car.model}</p>
                    <p className='text-xs text-gray-500'>{car.seating_capacity} - {car.transmission}</p>
                  </div>
                </td>
                
                <td className='p-3 max-md:hidden'>{car.category}</td>
                <td className='p-3'>{currency}{car.pricePerDay}/Day</td>
                <td className='p-3 max-md:hidden'>
                  <span className={`px-3 py-1 rounded-full text-xs ${car.isAvailable ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
                    {car.isAvailable ? "Available" : "Not Available"}
                  </span>
                </td>
                <td className='flex items-center p-3'>
                  <img 
                    src={car.isAvailable ? assets.eye_close_icon : assets.eye_icon} 
                    alt="" 
                    className='cursor-pointer' 
                    onClick={() => toggleAvailability(car._id)}
                    title={car.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                  />
                  <img 
                    src={assets.delete_icon} 
                    alt="" 
                    className='cursor-pointer ml-2' 
                    onClick={() => deleteCar(car._id)}
                    title='Delete Car'
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
      )}
    </div>
  )
}

export default ManageCars