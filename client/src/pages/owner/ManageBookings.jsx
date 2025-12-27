import {React,useEffect,useState} from 'react'
import { assets } from '../../assets/assets';
import Title from '../../components/owner/Title';
import axios from 'axios';
import { toast } from 'react-toastify';

const ManageBookings = () => {

  const currency = import.meta.env.VITE_CURRENCY;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [bookings, setbookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOwnerBookings = async ()=>{
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login');
      return;
    }

    try {
      const { data } = await axios.get(`${backendUrl}/api/booking/owner-bookings`, {
        headers: { Authorization: token }
      });

      if (data.success) {
        setbookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }

  const updateBookingStatus = async (bookingId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const { data } = await axios.post(`${backendUrl}/api/booking/update-status`, 
        { bookingId, status: newStatus },
        { headers: { Authorization: token } }
      );

      if (data.success) {
        toast.success('Booking status updated');
        fetchOwnerBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update booking');
    }
  }

  useEffect(()=>{
    fetchOwnerBookings();
  },[])

  return (
    <div className='px-4 py-10 md:px-10 flex-1'>
      <Title title='Manage Bookings' subTitle='Track all customer bookings, approve or cancle requests, and manage booking statuses' />
      {loading ? (
        <p className='text-center mt-6'>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p className='text-center mt-6 text-gray-500'>No bookings yet</p>
      ) : (
      <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>
        <table className='w-full border-collapse text-left text-sm text-gray-600'>
          <thead className='text-gray-500'>
            <tr>
              <th className='p-3 font-medium'>Car</th>
              <th className='p-3 font-medium max-md:hidden'>Date Range</th>
              <th className='p-3 font-medium'>Total</th>
              <th className='p-3 font-medium max-md:hidden'>payment</th>
              <th className='p-3 font-medium'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? bookings.map((booking,index)=>(
              <tr key={index} className='border-t border-borderColor hover:bg-light cursor-pointer'>
                <td className='p-3 flex items-center gap-3'>
                  <img src={booking.car?.image || 'https://via.placeholder.com/48'} alt="" className='w-12 h-12 object-cover aspect-square rounded-md' />
                  <p className='font-medium max-md:hidden'>{booking.car ? `${booking.car.brand} ${booking.car.model}` : 'Car N/A'}</p>
                </td>
                
                <td className='p-3 max-md:hidden'>{booking.pickupDate.split('T')[0]} to {booking.returnDate.split('T')[0]}</td>
                <td className='p-3'>{currency}{booking.price}</td>
                <td className='p-3 max-md:hidden'>
                  <span className='bg-gray-100 px-3 py-1 rounded-full text-sm'>
                    offline
                  </span>
                </td>
                <td className=' p-3'>
                  {booking.status === 'pending' ? (
                    <select 
                      value={booking.status} 
                      onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                      className='px-2 py-1.5 mt-1 text-gray-500 border border-borderColor rounded-md outline-none'
                    >
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="confirmed">Confirmed</option>
                    </select>
                  ):(
                    <span className={`px-3 py-1 rounded-full font-semibold ${booking.status === 'cancelled' ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'}`}>{booking.status}</span>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className='p-8 text-center text-gray-500'>
                  No bookings yet
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>
      )}
    </div>
  )
}

export default ManageBookings