import express from 'express';
import { protect } from '../middleware/auth.js';
import { checkCarAvailability, createBooking, getUserBookings, getOwnerBookings, updateBookingStatus } from '../controllers/bookingController.js';

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkCarAvailability);
bookingRouter.post('/create', protect, createBooking);
bookingRouter.get('/user-bookings', protect, getUserBookings);
bookingRouter.get('/owner-bookings', protect, getOwnerBookings);
bookingRouter.post('/update-status', protect, updateBookingStatus);

export default bookingRouter;
