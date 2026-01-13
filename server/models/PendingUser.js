import mongoose from "mongoose";

// Temporary storage for users pending email verification
const pendingUserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:3,
        max:20,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['user', 'owner'],
        default:'user'
    },
    verificationToken:{
        type:String,
        required:true
    },
    verificationExpires:{
        type:Date,
        required:true
    }
},{timestamps:true})

// Auto-delete expired pending registrations after 24 hours
pendingUserSchema.index({ verificationExpires: 1 }, { expireAfterSeconds: 0 });

const PendingUser = mongoose.model("PendingUser", pendingUserSchema)

export default PendingUser;
