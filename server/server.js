import express from 'express';
import cors from 'cors';
import "dotenv/config";
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import ownerRouter from './routes/ownerRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import carRouter from './routes/carRoutes.js';

// Initialize express app
const app = express()

await connectDB();

// Middleware
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        process.env.FRONTEND_URL, 
        'https://car-rental-nine-liard.vercel.app',
        'https://carrental-nine-liard.vercel.app'
      ].filter(Boolean) // Remove undefined values
    : ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Server is running')
})

app.use('/api/user', userRouter)
app.use('/api/owner', ownerRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/cars', carRouter);

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
