import React, { useEffect, useState } from 'react'
import Title from './Title';
import {assets, dummyCarData} from '../assets/assets'
import CarCard from './CarCard';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

const FeaturedSection = () => {

    const navigate = useNavigate();
    const [cars, setCars] = useState(dummyCarData.slice(0, 6)); // Start with dummy data
    const [loading, setLoading] = useState(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const fetchCars = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/cars/all`);
            if (data.success && data.cars.length > 0) {
                setCars(data.cars.slice(0, 6)); // Show first 6 cars from database
            }
            // If database is empty, keep dummy data
        } catch (error) {
            console.error('Error fetching cars:', error);
            // On error, keep dummy data showing
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

  return (
    <div className='flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32'>
        <div>
            <Title title='Featured Vehicles' subTitle='Explore our selection of premium vehicles available for your next adventure.'/>
        </div>

        {loading ? (
            <p className='mt-18 text-gray-500'>Loading vehicles...</p>
        ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18'>
                {cars.map((car)=>(
                    <div key={car._id}>
                        <CarCard car={car}/>
                    </div>
                ))}
            </div>
        )}

        <button onClick={()=>{
            navigate('/cars'); scrollTo(0,0) 
            }} className='flex items-center justify-center gap-2 px-6 py-2 border border-borderColor hover:bg-gray rounded-md mt-18 cursor-pointer'>
            Explore all Cars <img src={assets.arrow_icon} alt="arrow" />
        </button>
    </div>
  )
}

export default FeaturedSection