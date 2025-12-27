import Booking from '../models/Booking.js';
import Car from '../models/Cars.js';
// Function to check if a car is available for booking in the given date range


const checkAvailability = async (car, pickupDate, returnDate) => {
    // Normalize dates to start of day to avoid time-related issues
    const pickup = new Date(pickupDate);
    pickup.setHours(0, 0, 0, 0);
    
    const returnD = new Date(returnDate);
    returnD.setHours(23, 59, 59, 999);
    
    // Find overlapping bookings (excluding cancelled ones)
    const bookings = await Booking.find({
        car,
        status: { $ne: 'cancelled' },
        $or: [
            // New booking starts during an existing booking
            { pickupDate: { $lte: returnD }, returnDate: { $gte: pickup } }
        ]
    });
    
    console.log('Checking availability for car:', car);
    console.log('Requested pickup:', pickup);
    console.log('Requested return:', returnD);
    console.log('Conflicting bookings found:', bookings.length);
    if (bookings.length > 0) {
        console.log('Conflicting bookings:', bookings.map(b => ({
            pickup: b.pickupDate,
            return: b.returnDate,
            status: b.status
        })));
    }
    
    return bookings.length === 0;
}

// API to check availability of a car for the given date range and location
export const checkCarAvailability = async (req,res)=>{
    try {
        const {location, pickupDate, returnDate} = req.body;

        // Find cars in the specified location
        const cars = await Car.find({location, isAvailable:true});

        // check availability for the given date range using promise
        const availableCarsPromises = cars.map(async (car) => {
            const isAvailable = await checkAvailability(car._id, pickupDate, returnDate);
            return {...car._doc, isAvailable: isAvailable};
        });

        let availableCars = await Promise.all(availableCarsPromises);
        availableCars = availableCars.filter(car => car.isAvailable);
        res.json({success:true,availableCars});
    } catch (error) {
        console.log(error);
        res.json({success:false, message : error.message});
    }
}

// API to Book a Car
export const createBooking = async (req,res)=>{
    try {
       const {_id, role} = req.user;
       const {car, pickupDate, returnDate} = req.body;
       
       // Check if user is an owner (owners cannot book cars)
       if(role === 'owner'){
           return res.json({success:false, message : "Owners cannot book cars. Only regular users can make bookings."});
       }
       
       // Validate required fields
       if(!car || !pickupDate || !returnDate){
           return res.json({success:false, message : "Please provide all required fields"});
       }
       
       // Check if car exists
       const carData = await Car.findById(car);
       if(!carData){
           return res.json({success:false, message : "Car not found"});
       }
       
       // Check if car is available
       if(!carData.isAvailable){
           return res.json({success:false, message : "Car is not currently available"});
       }
       
       const isAvailable = await checkAvailability(car, pickupDate, returnDate);
       if(!isAvailable){
        return res.json({success:false, message : "Car is not available for the selected date range"});
       }

       // calculate price based on pickup and return dates
       const picked = new Date(pickupDate);
       const returned = new Date(returnDate);
       const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
       
       if(noOfDays <= 0){
           return res.json({success:false, message : "Return date must be after pickup date"});
       }
       
       const price = noOfDays * carData.pricePerDay;

       // Create a new booking
       await Booking.create({
            user: _id,
            car,
            owner: carData.owner,
            pickupDate,
            returnDate,
            price
       });
        res.json({success:true, message : "Booking created successfully"});
    } catch (error) {
        console.log(error);
        res.json({success:false, message : error.message});
    }
}

export const getUserBookings = async (req,res)=>{
    try {
        const {_id} = req.user;
        const bookings = await Booking.find({user:_id}).populate("car").sort({createdAt: -1});
        res.json({success:true, bookings});
    } catch (error) {
        console.log(error);
        res.json({success:false, message : error.message});
    }
}

export const getOwnerBookings = async (req,res)=>{
    try {
        if(req.user.role !== 'owner'){
            return res.json({success:false, message : "Unauthorized Access"});
        }
        const bookings = await Booking.find({owner: req.user._id}).populate("car user").sort({createdAt: -1});
        res.json({success:true, bookings});
    } catch (error) {
        console.log(error);
        res.json({success:false, message : error.message});
    }
}

// API to Update Booking Status
export const updateBookingStatus = async (req,res)=>{
    try {
        const {bookingId, status} = req.body;
        const {_id, role} = req.user;

        if(role !== 'owner'){
            return res.json({success:false, message : "Unauthorized Access"});
        }

        const booking = await Booking.findById(bookingId);
        if(!booking){
            return res.json({success:false, message : "Booking not found"});
        }

        if(booking.owner.toString() !== _id.toString()){
            return res.json({success:false, message : "Unauthorized"});
        }

        booking.status = status;
        await booking.save();

        res.json({success:true, message : "Booking status updated successfully"});
    } catch (error) {
        console.log(error);
        res.json({success:false, message : error.message});
    }
}
