import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const currency = import.meta.env.VITE_CURRENCY;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const fetchBookings = async() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to view bookings');
      navigate('/');
      return;
    }

    try {
      console.log('Fetching bookings with token:', token);
      console.log('Backend URL:', backendUrl);
      
      const { data } = await axios.get(`${backendUrl}/api/booking/user-bookings`, {
        headers: { Authorization: token }
      });

      console.log('Bookings response:', data);

      if (data.success) {
        setBookings(data.bookings || []);
      } else {
        toast.error(data.message || 'Failed to load bookings');
      }
    } catch (error) {
      console.error('Booking fetch error:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, [])

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl'>
      <Title title="My Bookings" subTitle='View and manage your all car bookings' align='left'/>
      {loading ? (
        <p className='text-center mt-12'>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p className='text-center mt-12 text-gray-500'>No bookings found</p>
      ) : (
      <div>
        {bookings.map((booking, index)=>{
          // Safety check for booking data
          if (!booking || !booking.car) {
            console.error('Invalid booking data:', booking);
            return null;
          }
          
          return (
          <div key={booking._id || index} className='p-6 border border-borderColor rounded-lg mt-5 first:mt-12'>
            
            {/* Mobile Layout */}
            <div className='block md:hidden'>
              {/* Price section - Top for mobile */}
              <div className='flex justify-between items-start mb-4'>
                <div>
                  <p className='px-3 py-1.5 bg-light rounded-md text-sm'>Booking #{index+1}</p>
                </div>
                <div className='text-right'>
                  <p className='text-gray-500 text-sm'>Total Price</p>
                  <h1 className='text-primary text-xl font-semibold'>{currency}{booking.price}</h1>
                  <p className='text-gray-500 text-xs'>Booked on {booking.createdAt.split('T')[0]}</p>
                </div>
              </div>

              {/* Car Image + info */}
              <div className='mb-4'>
                <div className='rounded-md overflow-hidden mb-3'>
                  <img src={booking.car.image} alt="" className='w-full h-auto aspect-video object-cover'/>
                </div>
                <p className='text-lg font-medium'>{booking.car.brand} {booking.car.model}</p>
                <p className='text-gray-500'>{booking.car.year} - {booking.car.category} - {booking.car.location}</p>
              </div>

              {/* Status and Details */}
              <div>
                <div className='flex items-center gap-2 mb-3'>
                  <p className={`px-3 py-1 text-xs rounded-full ${booking.status === 'confirmed' ? 'bg-green-400/15 text-green-600' : 'bg-red-400/15 text-red-600'}`}>{booking.status}</p>
                </div>

                <div className='flex items-start gap-2 mb-3'>
                  <img src={assets.calendar_icon_colored} alt="" className='w-4 h-4 mt-1'/>
                  <div>
                    <p className='text-gray-500'>Rental Period</p>
                    <p>{booking.pickupDate.split('T')[0]} To {booking.returnDate.split('T')[0]}</p>
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  <img src={assets.location_icon_colored} alt="" className='w-4 h-4 mt-1'/>
                  <div>
                    <p className='text-gray-500'>Pick-up Location</p>
                    <p>{booking.car.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className='hidden md:block relative'>
              {/* Price section - Top Right for desktop */}
              <div className='absolute top-0 right-0 text-right'>
                <p className='text-gray-500 text-sm'>Total Price</p>
                <h1 className='text-primary text-2xl font-semibold'>{currency}{booking.price}</h1>
                <p className='text-gray-500 text-xs'>Booked on {booking.createdAt.split('T')[0]}</p>
              </div>

              <div className='flex gap-6 pr-36'>
                {/* Car Image + info */}
                <div className='w-64 flex-shrink-0'>
                  <div className='rounded-md overflow-hidden mb-3'>
                    <img src={booking.car.image} alt="" className='w-full h-auto aspect-video object-cover'/>
                  </div>
                  <p className='text-lg font-medium'>{booking.car.brand} {booking.car.model}</p>
                  <p className='text-gray-500'>{booking.car.year} - {booking.car.category} - {booking.car.location}</p>
                </div>

                {/* Booking Details */}
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-3'>
                    <p className='px-3 py-1.5 bg-light rounded-md'>Booking #{index+1}</p>
                    <p className={`px-3 py-1 text-xs rounded-full ${booking.status === 'confirmed' ? 'bg-green-400/15 text-green-600' : 'bg-red-400/15 text-red-600'}`}>{booking.status}</p>
                  </div>

                  <div className='flex items-start gap-2 mb-3'>
                    <img src={assets.calendar_icon_colored} alt="" className='w-4 h-4 mt-1'/>
                    <div>
                      <p className='text-gray-500'>Rental Period</p>
                      <p>{booking.pickupDate.split('T')[0]} To {booking.returnDate.split('T')[0]}</p>
                    </div>
                  </div>

                  <div className='flex items-center gap-2'>
                    <img src={assets.location_icon_colored} alt="" className='w-4 h-4 mt-1'/>
                    <div>
                      <p className='text-gray-500'>Pick-up Location</p>
                      <p>{booking.car.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          );
        })}
      </div>
      )}
    </div>
  )
}

export default MyBookings