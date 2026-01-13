// Migration Script: Update Existing Users to Approved Status
// Run this ONCE if you have existing users in your database

import mongoose from 'mongoose';
import 'dotenv/config';

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Import models
import User from './models/User.js';
import Owner from './models/Owner.js';

const migrateExistingUsers = async () => {
    try {
        console.log('🔄 Starting migration...\n');

        // Update all existing users to approved status
        const usersResult = await User.updateMany(
            { isApproved: { $exists: false } }, // Users without isApproved field
            { 
                $set: { 
                    isApproved: true,
                    approvalToken: null,
                    approvedAt: new Date()
                } 
            }
        );

        console.log(`✅ Updated ${usersResult.modifiedCount} users`);

        // Update all existing owners to approved status
        const ownersResult = await Owner.updateMany(
            { isApproved: { $exists: false } }, // Owners without isApproved field
            { 
                $set: { 
                    isApproved: true,
                    approvalToken: null,
                    approvedAt: new Date()
                } 
            }
        );

        console.log(`✅ Updated ${ownersResult.modifiedCount} owners`);

        // Show summary
        console.log('\n📊 Migration Summary:');
        console.log(`   Total Users Updated: ${usersResult.modifiedCount}`);
        console.log(`   Total Owners Updated: ${ownersResult.modifiedCount}`);
        console.log(`   Total Accounts Updated: ${usersResult.modifiedCount + ownersResult.modifiedCount}`);
        
        console.log('\n✅ Migration completed successfully!');
        console.log('   All existing users can now login without approval.');
        console.log('   New registrations will require your approval.\n');

    } catch (error) {
        console.error('❌ Migration error:', error);
    } finally {
        // Close connection
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
        process.exit(0);
    }
};

// Run migration
(async () => {
    console.log('\n🚀 Existing Users Migration Script');
    console.log('═══════════════════════════════════\n');
    console.log('⚠️  This will approve all existing users in your database.');
    console.log('⚠️  Run this ONLY ONCE after implementing the approval system.\n');
    
    await connectDB();
    await migrateExistingUsers();
})();
