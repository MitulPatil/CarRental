import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
   image:{
       type:String,
       default:""
   },
   isApproved:{
       type:Boolean,
       default:false
   },
   approvalToken:{
       type:String,
       default:null
   },
   approvedAt:{
       type:Date,
       default:null
   }
},{timestamps:true})

const User = mongoose.model("User", userSchema)

export default User;