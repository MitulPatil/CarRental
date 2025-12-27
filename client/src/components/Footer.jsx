import React from 'react'
import {assets} from '../assets/assets'

const Footer = () => {
  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-60 tex-sm text-gray-500'>
            <div className='flex flex-wrap justify-between items-start gap-8 pb-6 border-borderColor border-bottom'>
                <div className='max-w-80'>
                    <div className='flex items-center gap-1 cursor-pointer'>
                        <img src={assets.car_icon} alt="" className='h-7 mb-2'/>
                        <h1 className='text-primary font-bold text-2xl sm:text-xl'>Car Rental</h1>
                    </div>
                    <p className='max-w-80 mt-3'>
                        Premium car rental service with a wide selection od luxury and everyday vehicles for all your driving needs.
                    </p>
                    <div className='flex items-center gap-3 mt-6'>
                        <a href="#"> <img src={assets.facebook_logo} alt="" className='w-5 h-5'/></a>
                        <a href="#"> <img src={assets.instagram_logo} alt="" className='w-5 h-5'/></a>
                        <a href="#"> <img src={assets.twitter_logo} alt="" className='w-5 h-5'/></a>
                        <a href="#"> <img src={assets.gmail_logo} alt="" className='w-5 h-5'/></a>
                    </div>
                </div>

                <div>
                    <h2 className='text-base font-medium text-gray-800 uppercase'>Quick Links</h2>
                    <ul className='mt-3 flex flex-col gap-1.5'>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">Browser Cars</a></li>
                        <li><a href="#">List Your Car</a></li>
                        <li><a href="#">About Us</a></li>
                    </ul>
                </div>
                <div>
                    <h2 className='text-base font-medium text-gray-800 uppercase'>Ressorces</h2>
                    <ul className='mt-3 flex flex-col gap-1.5'>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Insurance</a></li>
                    </ul>
                </div>
                <div>
                    <h2 className='text-base font-medium text-gray-800 uppercase'>Contact</h2>
                    <ul className='mt-3 flex flex-col gap-1.5'>
                        <li><a href="#">1234 Luxury Drive</a></li>
                        <li><a href="#">Vadodara, Gujarat</a></li>
                        <li><a href="#">+91 1234567890</a></li>
                        <li><a href="#">patilmitul1911@gmail.com</a></li>
                    </ul>
                </div>

            </div>
            <hr className='border-gray-300 mt-8' />
            <div className='flex flex-col md:flex-row gap-2 items-center justify-center py-5'>
                <p>© {new Date().getFullYear()} CarRental .All rights reserved.</p>
            </div>
        </div>
  )
}

export default Footer