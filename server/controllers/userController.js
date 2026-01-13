import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Owner from '../models/Owner.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendAdminNotificationEmail, sendUserApprovalEmail, sendUserRejectionEmail } from '../configs/email.js';

// Generate JWT Token
const generateToken = (userId, role)=>{
    const payload = { userId, role };
    return jwt.sign(payload, process.env.JWT_SECRET);
} 

// register user

export const registerUser = async (req,res)=>{
    try {
       const {name,email,password,role} = req.body;
       
       // Validate input
       if(!name || !email || !password || password.length < 8){
        return res.json({success: false, message : "Fill all the fields correctly. Password must be at least 8 characters"})
       }
       
       // Validate email format
       const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
       if(!emailRegex.test(email)){
        return res.json({success: false, message : "Please provide a valid email address"})
       }
       
       // Generate approval token
       const approvalToken = crypto.randomBytes(32).toString('hex');
       
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
            password: hashedpassword,
            isApproved: false,
            approvalToken
           })
           
           // Send notification to admin
           try {
               await sendAdminNotificationEmail(name, email, 'owner', approvalToken);
               return res.json({
                   success: true, 
                   message: "Registration request submitted! Admin approval is required. You will receive an email once approved.",
                   pendingApproval: true
               })
           } catch (emailError) {
               console.error('Email sending failed:', emailError);
               // Still create the account but inform about email failure
               return res.json({
                   success: true, 
                   message: "Registration request submitted! Admin will be notified. You will receive an email once approved.",
                   pendingApproval: true
               })
           }
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
            password:hashedpassword,
            isApproved: false,
            approvalToken
           })
           
           // Send notification to admin
           try {
               await sendAdminNotificationEmail(name, email, 'user', approvalToken);
               return res.json({
                   success: true, 
                   message: "Registration request submitted! Admin approval is required. You will receive an email once approved.",
                   pendingApproval: true
               })
           } catch (emailError) {
               console.error('Email sending failed:', emailError);
               return res.json({
                   success: true, 
                   message: "Registration request submitted! Admin will be notified. You will receive an email once approved.",
                   pendingApproval: true
               })
           }
       }

    } catch (error) {
        console.error('Registration error:', error);
        return res.json({success: false, message : error.message})
    }
}

// login user

export const loginuser = async (req,res)=>{
    try {
        const {email,password} = req.body;
        
        // Validate email format
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(!emailRegex.test(email)){
            return res.json({success: false, message : "Please provide a valid email address"})
        }
        
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
        
        // Check if user is approved
        if(!user.isApproved){
            return res.json({
                success: false, 
                message : "Your account is pending admin approval. You will receive an email once approved.",
                pendingApproval: true
            });
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

// Approve user registration
export const approveUser = async (req, res) => {
    try {
        const { token } = req.params;
        
        // Try to find user in User collection
        let user = await User.findOne({ approvalToken: token });
        let role = 'user';
        
        // If not found, try Owner collection
        if (!user) {
            user = await Owner.findOne({ approvalToken: token });
            role = 'owner';
        }
        
        if (!user) {
            return res.send(`
                <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f4f4f4; }
                            .container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
                            .error { color: #f44336; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h2 class="error">❌ Invalid Token</h2>
                            <p>This approval link is invalid or has expired.</p>
                        </div>
                    </body>
                </html>
            `);
        }
        
        if (user.isApproved) {
            return res.send(`
                <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f4f4f4; }
                            .container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
                            .info { color: #2196F3; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h2 class="info">ℹ️ Already Approved</h2>
                            <p>This user has already been approved.</p>
                        </div>
                    </body>
                </html>
            `);
        }
        
        // Approve the user
        user.isApproved = true;
        user.approvedAt = new Date();
        user.approvalToken = null; // Clear the token
        await user.save();
        
        // Send approval email to user
        try {
            await sendUserApprovalEmail(user.name, user.email);
        } catch (emailError) {
            console.error('Failed to send approval email:', emailError);
        }
        
        res.send(`
            <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f4f4f4; }
                        .container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
                        .success { color: #4CAF50; }
                        .details { background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2 class="success">✅ User Approved Successfully!</h2>
                        <div class="details">
                            <p><strong>Name:</strong> ${user.name}</p>
                            <p><strong>Email:</strong> ${user.email}</p>
                            <p><strong>Role:</strong> ${role === 'owner' ? 'Car Owner' : 'Regular User'}</p>
                        </div>
                        <p>The user has been notified via email and can now login to the platform.</p>
                    </div>
                </body>
            </html>
        `);
        
    } catch (error) {
        console.error('Approval error:', error);
        res.send(`
            <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f4f4f4; }
                        .container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
                        .error { color: #f44336; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2 class="error">❌ Error</h2>
                        <p>An error occurred while approving the user: ${error.message}</p>
                    </div>
                </body>
            </html>
        `);
    }
};

// Reject user registration
export const rejectUser = async (req, res) => {
    try {
        const { token } = req.params;
        
        // Try to find user in User collection
        let user = await User.findOne({ approvalToken: token });
        let role = 'user';
        
        // If not found, try Owner collection
        if (!user) {
            user = await Owner.findOne({ approvalToken: token });
            role = 'owner';
        }
        
        if (!user) {
            return res.send(`
                <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f4f4f4; }
                            .container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
                            .error { color: #f44336; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h2 class="error">❌ Invalid Token</h2>
                            <p>This rejection link is invalid or has expired.</p>
                        </div>
                    </body>
                </html>
            `);
        }
        
        // Store user details before deletion
        const userName = user.name;
        const userEmail = user.email;
        
        // Delete the user
        if (role === 'user') {
            await User.deleteOne({ _id: user._id });
        } else {
            await Owner.deleteOne({ _id: user._id });
        }
        
        // Send rejection email to user
        try {
            await sendUserRejectionEmail(userName, userEmail);
        } catch (emailError) {
            console.error('Failed to send rejection email:', emailError);
        }
        
        res.send(`
            <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f4f4f4; }
                        .container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
                        .warning { color: #ff9800; }
                        .details { background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2 class="warning">❌ Registration Rejected</h2>
                        <div class="details">
                            <p><strong>Name:</strong> ${userName}</p>
                            <p><strong>Email:</strong> ${userEmail}</p>
                            <p><strong>Role:</strong> ${role === 'owner' ? 'Car Owner' : 'Regular User'}</p>
                        </div>
                        <p>The registration has been rejected and the user has been notified via email.</p>
                    </div>
                </body>
            </html>
        `);
        
    } catch (error) {
        console.error('Rejection error:', error);
        res.send(`
            <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f4f4f4; }
                        .container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
                        .error { color: #f44336; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2 class="error">❌ Error</h2>
                        <p>An error occurred while rejecting the user: ${error.message}</p>
                    </div>
                </body>
            </html>
        `);
    }
};