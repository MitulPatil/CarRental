import User from "../models/User.js";
import Owner from "../models/Owner.js";
import fs from 'fs';
import imagekit from "../configs/imageKit.js";
import Car from "../models/Cars.js";
import Booking from "../models/Booking.js";


export const changeRoleToOwner =  async (req,res)=>{
    try {
        // This endpoint is no longer needed since we separate users and owners
        return res.json({success:false, message:"Please register as an owner instead"});
    } catch (error) {
        console.log(error.message);
        return res.json({success: false, message : error.message})
    }
}

// API to List car

export const addCar = async (req,res)=>{
    try {
        const {_id} = req.user;
        let car = JSON.parse(req.body.carData);
        const imageFile = req.file;

        // Upload image to imagekit
        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer, 
            fileName: imageFile.originalname, 
            folder:'/cars'
        });

        // Optimization through imagekit URL transformation
        var optimizedImageURL = imagekit.url({
            path: response.filePath,
            transformation:[
                {width: "1280"}, // Resize to width 1280px
                {quality: "auto"}, // Auto adjust quality
                {format: "webp"} // Convert to WebP format
            ]
        });

        const image = optimizedImageURL;
        await Car.create({...car, owner:_id, image});

        return res.json({success:true, message:"Car listed successfully"});    
    } catch (error) {
        return res.json({success: false, message : error.message})
    }
}

// API to List Owner Cars

export const getOwnerCars = async (req,res)=>{
    try {
        const {_id} = req.user;
        const cars = await Car.find({owner: _id});
        res.json({success:true, cars}); 
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message: error.message});
    }
}

// API to Toggle Car Availability

export const toggleCarAvailability = async (req,res)=>{
    try {
        const {_id} = req.user;
        const {carId} = req.body;
        const car = await Car.findById(carId)

        // Checking is car belongs to the user

        if(car.owner.toString() !== _id.toString()){
            return res.json({success:false , message : "Unathorized"});
        }

        car.isAvailable = !car.isAvailable;
        await car.save()

        res.json({success:true , car})
    } catch (error) {
        console.log(error);
        res.json({success:false, message : error.message});
    }
}

//  Api to Delete Car

export const deletecar = async (req,res)=>{
    try {
        const {_id} = req.user;
        const {carId} = req.body;
        const car = await Car.findById(carId)

        // Checking is car belongs to the user

        if(car.owner.toString() !== _id.toString()){
            return res.json({success:false , message : "Unathorized"});
        }

        car.owner = null;
        car.isAvailable = false;
        await car.save()

        res.json({success:true , message: "Car Deleted Successfully"})
    } catch (error) {
        console.log(error);
        res.json({success:false, message : error.message});
    }
}

// API to get Dashboard Data
export const getDashboardData = async (req,res)=>{
    try {
        const {_id, role} = req.user;

        if(role !== "owner"){
            return res.json({success:false, message: "Unauthorized"});
        }
        
        const cars = await Car.find({owner: _id});
        const bookings = await Booking.find({owner: _id});
        
        const totalCars = cars.length;
        const totalBookings = bookings.length;
        const pendingBookings = bookings.filter(b => b.status === 'pending').length;
        const completedBookings = bookings.filter(b => b.status === 'confirmed').length;
        
        // Get recent bookings (last 5)
        const recentBookings = await Booking.find({owner: _id})
            .populate('car')
            .populate('user', 'name email')
            .sort({createdAt: -1})
            .limit(5);
        
        // Calculate monthly revenue (current month)
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyRevenue = bookings
            .filter(b => {
                const bookingDate = new Date(b.createdAt);
                return bookingDate.getMonth() === currentMonth && 
                       bookingDate.getFullYear() === currentYear;
            })
            .reduce((sum, b) => sum + b.price, 0);
        
        // Update owner stats
        const owner = await Owner.findById(_id);
        if (owner) {
            owner.totalCars = totalCars;
            owner.totalBookings = totalBookings;
            owner.totalRevenue = bookings.reduce((sum, b) => sum + b.price, 0);
            await owner.save();
        }
        
        res.json({
            success: true,
            data: {
                totalCars,
                totalBookings,
                pendingBookings,
                completedBookings,
                recentBookings,
                monthlyRevenue
            }
        });
    } catch (error) {
        console.log(error);
        res.json({success:false, message : error.message});
    }
}