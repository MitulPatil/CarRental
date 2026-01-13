import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Owner from '../models/Owner.js';
import PendingUser from '../models/PendingUser.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendAdminNotificationEmail, sendUserApprovalEmail, sendUserRejectionEmail, sendVerificationEmail } from '../configs/email.js';

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
       
       // Check if user already exists in main collections
       const existingUser = await User.findOne({email});
       const existingOwner = await Owner.findOne({email});
       
       if(existingUser || existingOwner){
        return res.json({success: false, message : "This email is already registered. Please login instead."})
       }
       
       // Check if already pending verification
       const pendingUser = await PendingUser.findOne({email});
       if(pendingUser){
        return res.json({success: false, message : "A verification email has already been sent to this address. Please check your email or try again after 24 hours."})
       }
       
       // Hash password
       const hashedpassword = await bcrypt.hash(password,10);
       
       // Generate verification token
       const verificationToken = crypto.randomBytes(32).toString('hex');
       const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
       
       // Store in pending collection
       await PendingUser.create({
           name,
           email,
           password: hashedpassword,
           role: role || 'user',
           verificationToken,
           verificationExpires
       });
       
       // Send verification email
       try {
           await sendVerificationEmail(name, email, verificationToken);
           return res.json({
               success: true, 
               message: `Registration initiated! We've sent a verification link to ${email}. Please check your email and click the link to complete your registration. The link will expire in 24 hours.`,
               requiresEmailVerification: true
           })
       } catch (emailError) {
           console.error('Email sending failed:', emailError);
           // Delete pending user if email fails
           await PendingUser.deleteOne({ email });
           return res.json({
               success: false, 
               message: "Failed to send verification email. Please make sure you're using a valid email address and try again."
           })
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
            return res.json({success: false, message : "No account found with this email. Please sign up first."});
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
// Verify email and create user account
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        
        // Find pending user with matching verification token
        const pendingUser = await PendingUser.findOne({ 
            verificationToken: token,
            verificationExpires: { $gt: Date.now() } // Check if token hasn't expired
        });
        
        if (!pendingUser) {
            return res.send(`
                <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f4f4f4; }
                            .container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; max-width: 500px; }
                            .error { color: #f44336; }
                            .icon { font-size: 48px; margin-bottom: 20px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="icon">❌</div>
                            <h2 class="error">Invalid or Expired Link</h2>
                            <p>This verification link is invalid or has expired. Verification links are valid for 24 hours.</p>
                            <p>Please register again to receive a new verification link.</p>
                        </div>
                    </body>
                </html>
            `);
        }
        
        // Create user in appropriate collection based on role
        let createdUser;
        if (pendingUser.role === 'owner') {
            createdUser = await Owner.create({
                name: pendingUser.name,
                email: pendingUser.email,
                password: pendingUser.password,
                isApproved: true,
                approvedAt: new Date()
            });
        } else {
            createdUser = await User.create({
                name: pendingUser.name,
                email: pendingUser.email,
                password: pendingUser.password
            });
        }
        
        // Delete pending user
        await PendingUser.deleteOne({ _id: pendingUser._id });
        
        // Generate JWT token for auto-login
        const authToken = generateToken(createdUser._id.toString(), pendingUser.role);
        
        // Redirect to frontend with token as URL parameter
        const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
        const redirectUrl = `${frontendUrl}?token=${authToken}&verified=true&name=${encodeURIComponent(pendingUser.name)}`;
        
        res.send(`
            <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f4f4f4; }
                        .container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; max-width: 500px; }
                        .success { color: #4CAF50; }
                        .icon { font-size: 48px; margin-bottom: 20px; }
                        .details { background: #f0f8f4; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4CAF50; }
                        .btn { background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; font-size: 16px; }
                        .btn:hover { background-color: #45a049; }
                        .spinner { border: 3px solid #f3f3f3; border-top: 3px solid #4CAF50; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 20px auto; }
                        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                    </style>
                    <script>
                        // Redirect immediately
                        setTimeout(() => {
                            window.location.href = '${redirectUrl}';
                        }, 2000);
                    </script>
                </head>
                <body>
                    <div class="container">
                        <div class="icon">✅</div>
                        <h2 class="success">Account Created Successfully!</h2>
                        <div class="details">
                            <p><strong>Name:</strong> ${pendingUser.name}</p>
                            <p><strong>Email:</strong> ${pendingUser.email}</p>
                            <p><strong>Role:</strong> ${pendingUser.role === 'owner' ? 'Car Owner' : 'User'}</p>
                        </div>
                        <p>Your email has been verified and your account has been created!</p>
                        <div class="spinner"></div>
                        <p>Redirecting you to login...</p>
                    </div>
                </body>
            </html>
        `);
        
    } catch (error) {
        console.error('Email verification error:', error);
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
                        <p>An error occurred during email verification. Please try again later.</p>
                        <p style="color: #666; font-size: 14px;">${error.message}</p>
                    </div>
                </body>
            </html>
        `);
    }
};