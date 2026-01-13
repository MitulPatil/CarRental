import express from 'express';
import { getUserData, loginuser, registerUser, approveUser, rejectUser } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';


const userRouter = express.Router();

userRouter.post('/register',registerUser);
userRouter.post('/login',loginuser);
userRouter.get('/data',protect,getUserData);

// Admin approval routes
userRouter.get('/approve/:token', approveUser);
userRouter.get('/reject/:token', rejectUser);

export default userRouter;