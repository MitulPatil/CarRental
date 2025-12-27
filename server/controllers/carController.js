import Car from "../models/Cars.js";
import Booking from "../models/Booking.js";

// API to get all available cars (for public browsing) with optional filtering
export const getAllCars = async (req, res) => {
    try {
        const { location, pickupDate, returnDate } = req.query;
        
        // Build base query - only show available cars
        let query = { isAvailable: true };
        
        // Filter by location if provided (case-insensitive)
        if (location) {
            query.location = { $regex: new RegExp(`^${location.trim()}$`, 'i') };
        }
        
        // Fetch cars with lean() for better performance (returns plain JS objects)
        let cars = await Car.find(query).sort({ createdAt: -1 }).lean();
        
        // If dates are provided, filter out cars that are already booked for those dates
        if (pickupDate && returnDate) {
            const pickup = new Date(pickupDate);
            const returnD = new Date(returnDate);
            
            // Find all bookings that overlap with the requested dates
            const overlappingBookings = await Booking.find({
                status: { $ne: 'cancelled' }, // Exclude cancelled bookings
                pickupDate: { $lte: returnD },
                returnDate: { $gte: pickup }
            }).select('car').lean();
            
            // Get IDs of booked cars
            const bookedCarIds = new Set(overlappingBookings.map(booking => booking.car.toString()));
            
            // Filter out booked cars
            cars = cars.filter(car => !bookedCarIds.has(car._id.toString()));
        }
        
        res.json({ success: true, cars });
    } catch (error) {
        console.error('Error in getAllCars:', error);
        res.json({ success: false, message: error.message });
    }
};

// API to get a single car by ID
export const getCarById = async (req, res) => {
    try {
        const { id } = req.params;
        const car = await Car.findById(id);
        
        if (!car) {
            return res.json({ success: false, message: "Car not found" });
        }
        
        res.json({ success: true, car });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
