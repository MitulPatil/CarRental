# 🚗 Car Rental Website

A full-stack car rental platform with two types of access:
1. **Car Owners** - List and manage their cars, track bookings
2. **Customers** - Browse cars, make bookings, manage their rentals

## 🎯 Features

### For Car Owners:
- ✅ List and manage cars
- ✅ Upload car images with optimization
- ✅ View dashboard with analytics
- ✅ Manage bookings (confirm/cancel)
- ✅ Track revenue and statistics
- ✅ Toggle car availability

### For Customers:
- ✅ Browse available cars by location
- ✅ View detailed car information
- ✅ Check availability for specific dates
- ✅ Book cars for rental
- ✅ View booking history
- ✅ Track booking status

## 🛠️ Tech Stack

### Frontend:
- React 19
- React Router DOM
- Tailwind CSS 4
- Axios
- React Toastify

### Backend:
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- ImageKit (Image Upload & Optimization)
- bcrypt (Password Hashing)
- Multer (File Uploads)

## 📋 Prerequisites

Before you begin, ensure you have installed:
- Node.js (v18 or higher)
- MongoDB (local or Atlas account)
- ImageKit account (for image uploads)

## 🚀 Installation & Setup

### 1. Clone the repository (if applicable)
```bash
cd CarRental
```

### 2. Setup Backend

#### Install dependencies:
```bash
cd server
npm install
```

#### Create environment file:
Create a `.env` file in the `server` directory:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

**How to get these credentials:**

- **MongoDB URI**: 
  - Local: `mongodb://localhost:27017`
  - Cloud: Create free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
  
- **JWT Secret**: Any random string (e.g., `your_super_secret_jwt_key_12345`)

- **ImageKit Credentials**: 
  1. Sign up at [ImageKit.io](https://imagekit.io/)
  2. Go to Developer section
  3. Copy Public Key, Private Key, and URL Endpoint

#### Start backend server:
```bash
npm run dev
```
Server will run on `http://localhost:3000`

### 3. Setup Frontend

#### Install dependencies:
```bash
cd client
npm install
```

#### Create environment file:
Create a `.env` file in the `client` directory:

```env
VITE_BACKEND_URL=http://localhost:3000
```

#### Start frontend:
```bash
npm run dev
```
Frontend will run on `http://localhost:5173`

## 👤 User Roles

### Regular User (Customer)
1. Register/Login as a user
2. Browse available cars
3. Select pickup/return dates and location
4. Book cars
5. View booking history

### Owner
1. Register/Login and select "Owner" role during registration
2. Go to `/owner` route to access owner dashboard
3. Add cars with details and images
4. Manage listed cars
5. View and manage customer bookings
6. Track analytics and revenue

## 🎨 Key Pages

### Customer Pages:
- `/` - Home page with featured cars
- `/cars` - Browse all cars with filters
- `/car-details/:id` - Detailed car information
- `/my-bookings` - User's booking history

### Owner Pages:
- `/owner` - Dashboard with analytics
- `/owner/add-car` - Add new car listing
- `/owner/manage-cars` - Manage listed cars
- `/owner/manage-bookings` - View and manage bookings

## 🔐 Authentication Flow

1. **Registration**: Users can register as either "user" or "owner"
2. **Login**: JWT token stored in localStorage
3. **Protected Routes**: Authentication required for bookings and owner pages
4. **Role-based Access**: Owner routes check for owner role

## 📊 Database Models

### User Model:
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "user" | "owner",
  image: String
}
```

### Car Model:
```javascript
{
  owner: ObjectId (User),
  brand: String,
  model: String,
  image: String,
  year: Number,
  category: String,
  seating_capacity: Number,
  fuel_type: String,
  transmission: String,
  pricePerDay: Number,
  location: String,
  description: String,
  isAvailable: Boolean
}
```

### Booking Model:
```javascript
{
  car: ObjectId (Car),
  user: ObjectId (User),
  owner: ObjectId (User),
  pickupDate: Date,
  returnDate: Date,
  status: "pending" | "Confirmed" | "Cancelled",
  price: Number
}
```

## 🔌 API Endpoints

### User Routes (`/api/user`):
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /data` - Get user data (protected)

### Owner Routes (`/api/owner`):
- `POST /change-role` - Change user role to owner (protected)
- `POST /add-car` - Add new car (protected, multipart)
- `GET /cars` - Get owner's cars (protected)
- `PUT /toggle-availability` - Toggle car availability (protected)
- `DELETE /delete-car` - Delete car (protected)
- `GET /dashboard` - Get dashboard data (protected)

### Booking Routes (`/api/booking`):
- `POST /check-availability` - Check car availability
- `POST /create` - Create new booking (protected)
- `GET /user-bookings` - Get user bookings (protected)
- `GET /owner-bookings` - Get owner bookings (protected)
- `PUT /update-status` - Update booking status (protected)

## 🎯 Usage Guide

### For Customers:
1. Visit the website
2. Click "Login" and register as a user
3. Browse cars from the home page or cars page
4. Click on a car to view details
5. Select dates and book
6. View your bookings in "My Bookings"

### For Car Owners:
1. Visit the website
2. Click "Login" and register as an owner
3. Navigate to `/owner` to access dashboard
4. Click "Add Car" and fill in details with an image
5. Manage your cars from "Manage Cars"
6. View booking requests in "Manage Bookings"
7. Confirm or cancel bookings as needed

## 📝 Environment Variables Summary

### Server (.env):
```
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
IMAGEKIT_PUBLIC_KEY=your_key
IMAGEKIT_PRIVATE_KEY=your_key
IMAGEKIT_URL_ENDPOINT=your_endpoint
```

### Client (.env):
```
VITE_BACKEND_URL=http://localhost:3000
```

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Check if MongoDB is running locally or connection string is correct
- Ensure IP address is whitelisted in MongoDB Atlas

**CORS Error:**
- Verify backend URL in frontend `.env` file
- Check if server is running

**Image Upload Error:**
- Verify ImageKit credentials
- Check file size limits

**Authentication Issues:**
- Clear localStorage and re-login
- Check if JWT_SECRET matches between requests

## 🚀 Production Deployment

**For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)**

### Quick Overview:
- **Database**: MongoDB Atlas (free tier)
- **Backend**: Render (free tier)  
- **Frontend**: Vercel (free tier)
- **Images**: ImageKit (free tier)

### Quick Steps:
1. Setup MongoDB Atlas cluster
2. Deploy backend to Render with environment variables
3. Deploy frontend to Vercel with backend URL
4. Update CORS settings
5. Test all functionality

**Total Cost**: $0/month with free tiers 🎉

See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for a quick checklist.

## 📧 Support

For issues or questions, check the code comments or create an issue in the repository.

## 📄 License

This project is open source and available under the MIT License.

---

**Happy Renting! 🚗💨**
