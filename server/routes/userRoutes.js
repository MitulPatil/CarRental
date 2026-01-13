import express from 'express';
import { getUserData, loginuser, registerUser, approveUser, rejectUser, verifyEmail } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';


const userRouter = express.Router();

userRouter.post('/register',registerUser);
userRouter.post('/login',loginuser);
userRouter.get('/data',protect,getUserData);

// Email verification route
userRouter.get('/verify-email/:token', verifyEmail);

// Admin approval routes
userRouter.get('/approve/:token', approveUser);
userRouter.get('/reject/:token', rejectUser);

export default userRouter;