import mongoose from 'mongoose';
import 'dotenv/config';

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/car-rental`);
        console.log('MongoDB connected...');
        
        // Drop the problematic index
        const db = mongoose.connection.db;
        const collection = db.collection('owners');
        
        try {
            await collection.dropIndex('user_1');
            console.log('Successfully dropped user_1 index from owners collection');
        } catch (err) {
            if (err.code === 27 || err.codeName === 'IndexNotFound') {
                console.log('Index user_1 does not exist, nothing to drop');
            } else {
                throw err;
            }
        }
        
        console.log('Fix completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

connectDB();
