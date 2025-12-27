import React, { useState } from 'react'
import Title from '../../components/owner/Title';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddCar = () => {

  const currency = import.meta.env.VITE_CURRENCY; 
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [image,setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [car, setcar] = useState({
    brand: '',
    model: '',
    year: 0,
    pricePerDay: 0,
    category: '',
    transmission:'',
    fuel_type:'',
    seating_capacity:'',
    location:'',
    description:'',
  })

  const onsubmitHandler = async (e)=>{
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to add a car');
      return;
    }

    if (!image) {
      toast.error('Please upload a car image');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', image);
      formData.append('carData', JSON.stringify(car));

      const { data } = await axios.post(`${backendUrl}/api/owner/add-car`, formData, {
        headers: { 
          Authorization: token,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (data.success) {
        toast.success(data.message);
        navigate('/owner/manage-cars');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add car');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='px-4 py-10 md:px-10 flex-1'>
      <Title title='Add New Car' subTitle='Fill in details to list a new car for booking,including pricing, availability , and car specifications.'/>

      <form onSubmit={onsubmitHandler} className='flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl'>

        {/* Car Image */}
        <div className='flex items-center gap-2 w-full'>
          <label htmlFor="car-image">
            <img src={image ? URL.createObjectURL(image) : assets.upload_icon} alt="" className='h-14 cursor-pointer rounded' />
            <input type="file" id='car-image' accept='image/*' hidden onChange={(e) => setImage(e.target.files[0])} />
          </label>
          <p className='text-xs mt-1 text-gray-500'>Upload car image</p>
        </div>

        {/*nCar Brand & Model */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col w-full'>
            <label>Brand</label>
            <input type="text" placeholder='e.g. BMW, Mercedes, Audi...' required className='px-3 py-2 border border-borderColor rounded-md outline-none' value={car.brand} onChange={e=> setcar({...car, brand:e.target.value})} />
          </div>
          <div className='flex flex-col w-full'>
            <label>Model</label>
            <input type="text" placeholder='e.g. X5, E-class, M3...' required className='px-3 py-2 border border-borderColor rounded-md outline-none' value={car.model} onChange={e=> setcar({...car, model:e.target.value})} />
          </div>
        </div>

        {/* Car Year, Price , Category */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          <div className='flex flex-col w-full'>
            <label>Year</label>
            <input type="number" placeholder='e.g. 2025' required className='px-3 py-2 border border-borderColor rounded-md outline-none' value={car.year} onChange={e=> setcar({...car, year:e.target.value})} />
          </div>
          <div className='flex flex-col w-full'>
            <label>Daily Price ({currency})</label>
            <input type="number" placeholder='e.g. 100' required className='px-3 py-2 border border-borderColor rounded-md outline-none' value={car.pricePerDay} onChange={e=> setcar({...car, pricePerDay:e.target.value})} />
          </div>
          <div className='flex flex-col w-full'>
            <label>Category</label>
            <select className='px-3 py-2 border border-borderColor rounded-md outline-none' value={car.category} onChange={e=> setcar({...car, category:e.target.value})} >
              <option value="">Select a Category</option>
              <option value="SUV">SUV</option>
              <option value="Sedan">Sedan</option>
              <option value="Hatchback">Van</option>
              <option value="Coupe">Coupe</option>
              <option value="Convertible">Convertible</option>
            </select>
          </div>
        </div>
        {/*Car Transmission, Fuel Type, Seating Capacity */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          <div className='flex flex-col w-full'>
            <label>Transmission</label>
            <select className='px-3 py-2 border border-borderColor rounded-md outline-none' value={car.transmission} onChange={e=> setcar({...car, transmission:e.target.value})} >
              <option value="">Select a Transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Semi-Automatic">Semi-Automatic</option>
            </select>
          </div>
          <div className='flex flex-col w-full'>
            <label>Fuel Type</label>
            <select className='px-3 py-2 border border-borderColor rounded-md outline-none' value={car.fuel_type} onChange={e=> setcar({...car, fuel_type:e.target.value})} >
              <option value="">Select a Fuel Type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Gas">Gas</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div className='flex flex-col w-full'>
            <label>Seating Capacity</label>
            <input type="number" placeholder='e.g. 5' required className='px-3 py-2 border border-borderColor rounded-md outline-none' value={car.seating_capacity} onChange={e=> setcar({...car, seating_capacity:e.target.value})} />
          </div>
        </div>

        {/* Car Location */}
        <div className='flex flex-col w-full max-w-sm'>
          <label>Location</label>
            <select className='px-3 py-2 border border-borderColor rounded-md outline-none' value={car.location} onChange={e=> setcar({...car, location:e.target.value})} >
              <option value="">Select a Location</option>
              <option value="Vadodara">Vadodara</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Pune">Pune</option>
            </select>
        </div>

        {/* Car Description */}
        <div className='flex flex-col w-full'>
          <label>Description</label>
          <textarea rows={4} placeholder='Provide a brief description of the car, including key features and any additional information that may be relevant to potential renters.' className='px-3 py-2 border border-borderColor rounded-md outline-none resize-none' value={car.description} onChange={e=> setcar({...car, description:e.target.value})} ></textarea>
        </div>

        <button className='flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-max cursor-pointer disabled:opacity-50' disabled={loading}>
          <img src={assets.tick_icon} alt="" />
          <span>{loading ? 'Listing...' : 'List Car'}</span>
        </button>
      </form>

    </div>
  )
}

export default AddCar