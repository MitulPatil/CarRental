import express from 'express';
import { getUserData, loginuser, registerUser } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';


const userRouter = express.Router();

userRouter.post('/register',registerUser);
userRouter.post('/login',loginuser);
userRouter.get('/data',protect,getUserData);

export default userRouter;