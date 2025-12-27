import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Owner from "../models/Owner.js";

export const protect = async (req,res,next)=>{
    const token = req.headers.authorization;
    if(!token){
        return res.json({success:false, message:"not authorized , no token"});
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded || !decoded.userId){
            return res.json({success:false, message:"not authorized"});
        }
        
        // Check if user is owner or regular user
        if (decoded.role === 'owner') {
            const owner = await Owner.findById(decoded.userId).select("-password");
            if (owner) {
                req.user = owner.toObject();
                req.user.role = 'owner';
            }
        } else {
            const user = await User.findById(decoded.userId).select("-password");
            if (user) {
                req.user = user.toObject();
                req.user.role = 'user';
            }
        }
        
        if (!req.user) {
            return res.json({success:false, message:"not authorized"});
        }
        
        next();
    } catch (error) {
        return res.json({success: false, message : error.message})
    }
}