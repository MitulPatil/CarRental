# Car Rental Website - Quick Start Guide

## 🎯 What You Have

Your car rental website is **already built** with these features:

### ✅ Two User Types:
1. **Car Owners** - Can list cars, manage inventory, handle bookings
2. **Customers** - Can browse cars, make bookings, view rental history

### ✅ Complete Features:
- User authentication (register/login)
- Role-based access (user vs owner)
- Car listing with image upload
- Booking system with date range
- Dashboard for owners
- Booking management
- Responsive design with Tailwind CSS

## 🚀 Quick Setup (5 Minutes)

### Step 1: Install Dependencies

Open two terminals in VS Code:

**Terminal 1 (Server):**
```powershell
cd server
npm install
```

**Terminal 2 (Client):**
```powershell
cd client
npm install
```

### Step 2: Setup Environment Variables

#### Server Configuration:
1. Go to `server` folder
2. Copy `.env.example` to `.env`
3. Fill in these values:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017
JWT_SECRET=my_secret_key_12345
IMAGEKIT_PUBLIC_KEY=your_imagekit_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

**MongoDB Setup Options:**
- **Local MongoDB**: Install MongoDB locally and use `mongodb://localhost:27017`
- **MongoDB Atlas** (Free Cloud): 
  1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
  2. Create free account
  3. Create cluster
  4. Get connection string

**ImageKit Setup** (For car image uploads):
1. Go to [imagekit.io](https://imagekit.io/)
2. Sign up for free
3. Go to Developer section
4. Copy credentials

#### Client Configuration:
1. Go to `client` folder
2. Copy `.env.example` to `.env`
3. Add:

```env
VITE_BACKEND_URL=http://localhost:3000
```

### Step 3: Run the Application

**Terminal 1 (Server):**
```powershell
cd server
npm run dev
```
Server starts at: http://localhost:3000

**Terminal 2 (Client):**
```powershell
cd client
npm run dev
```
Frontend starts at: http://localhost:5173

### Step 4: Test the Application

1. Open browser: http://localhost:5173
2. Click "Login" button
3. Register as a **User** first (to book cars)
4. Then register another account as **Owner** (to list cars)

## 👤 How to Use

### As a Car Owner:
1. Register with role = "owner"
2. Visit: http://localhost:5173/owner
3. Add cars with images
4. Manage bookings from customers
5. View dashboard statistics

### As a Customer:
1. Register with role = "user"
2. Browse cars on homepage
3. Click on a car to see details
4. Select dates and book
5. View bookings in "My Bookings"

## 📁 Project Structure

```
CarRental/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # Auth context
│   │   └── App.jsx       # Main app with routes
│   └── .env              # Frontend config
│
├── server/               # Node.js backend
│   ├── models/           # MongoDB schemas
│   ├── controllers/      # Business logic
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   └── .env              # Server config
│
└── README.md             # Full documentation
```

## 🎨 Key Routes

### Frontend Routes:
- `/` - Home page
- `/cars` - Browse all cars
- `/car-details/:id` - Car details
- `/my-bookings` - User's bookings
- `/owner` - Owner dashboard (protected)
- `/owner/add-car` - Add new car
- `/owner/manage-cars` - Manage cars
- `/owner/manage-bookings` - Manage bookings

### API Endpoints:
- `POST /api/user/register` - Register
- `POST /api/user/login` - Login
- `POST /api/owner/add-car` - Add car
- `POST /api/booking/create` - Book car
- `GET /api/owner/dashboard` - Dashboard data

## 🐛 Common Issues

**Can't connect to MongoDB:**
- Install MongoDB locally OR use MongoDB Atlas
- Check connection string in `.env`

**Images not uploading:**
- Sign up for ImageKit.io (free)
- Add credentials to `.env`
- Restart server

**CORS errors:**
- Check `VITE_BACKEND_URL` in client `.env`
- Make sure both servers are running

## 📚 Next Steps

1. **Customize Design**: Update components in `client/src/components`
2. **Add Features**: Payment integration, ratings, car filters
3. **Deploy**: Use Vercel (frontend) + Render/Railway (backend)

## 💡 Tips

- Use Chrome DevTools to debug
- Check browser console for errors
- Check terminal logs for backend errors
- MongoDB Compass to view database

## 🎓 Learning Resources

- **React**: [react.dev](https://react.dev)
- **Node.js**: [nodejs.org](https://nodejs.org)
- **MongoDB**: [mongodb.com/docs](https://www.mongodb.com/docs)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)

---

**Need Help?** Check the main [README.md](README.md) for detailed documentation!
