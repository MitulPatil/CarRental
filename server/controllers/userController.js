import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Owner from '../models/Owner.js';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (userId, role)=>{
    const payload = { userId, role };
    return jwt.sign(payload, process.env.JWT_SECRET);
} 

// register user

export const registerUser = async (req,res)=>{
    try {
       const {name,email,password,role} = req.body;
       if(!name || !email || !password || password.length < 8){
        return res.json({success: false, message : "Fill all the fields correctly"})
       }
       
       if (role === 'owner') {
           // Check if owner already exists
           const ownerExists = await Owner.findOne({email});
           if(ownerExists){
            return res.json({success: false, message : "Owner already exists"})
           }
           
           const hashedpassword = await bcrypt.hash(password,10);
           
           const owner = await Owner.create({
            name,
            email,
            password: hashedpassword
           })
           
           const token = generateToken(owner._id.toString(), 'owner');
           return res.json({success:true , token})
       } else {
           // Regular user registration
           const userExists = await User.findOne({email});
           if(userExists){
            return res.json({success: false, message : "User already exists"})
           }

           const hashedpassword = await bcrypt.hash(password,10);

           const user = await User.create({
            name,
            email,
            password:hashedpassword
           })

           const token = generateToken(user._id.toString(), 'user');
           return res.json({success:true , token})
       }

    } catch (error) {
        return res.json({success: false, message : error.message})
    }
}

// login user

export const loginuser = async (req,res)=>{
    try {
        const {email,password} = req.body;
        
        // Try to find in User collection first
        let user = await User.findOne({email});
        let role = 'user';
        
        // If not found, try Owner collection
        if (!user) {
            user = await Owner.findOne({email});
            role = 'owner';
        }
        
        if(!user){
            return res.json({success: false, message : "User does not exist"});
        }
        
        const isMatch = await bcrypt.compare(password , user.password);
        if(!isMatch){
            return res.json({success: false, message : "Incorrect password"});
        }
        
        const token = generateToken(user._id.toString(), role);
        return res.json({success:true , token})
    } catch (error) {
        return res.json({success: false, message : error.message})
    }
}

// get user details using token(JWT)

export const getUserData = async (req,res)=>{
    try {
        const {user} = req;
        return res.json({success: true, user});
    } catch (error) {
        return res.json({success: false, message : error.message})
    }
}