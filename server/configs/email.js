import nodemailer from 'nodemailer';

// Create email transporter
const createTransporter = () => {
    // Log for debugging
    console.log('Email Config Check:', {
        hasSendGridKey: !!process.env.SENDGRID_API_KEY,
        hasAdminEmail: !!process.env.ADMIN_EMAIL,
        sendGridKeyLength: process.env.SENDGRID_API_KEY?.length || 0
    });
    
    // Use SendGrid for production (works with all hosting platforms)
    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY.trim() !== '') {
        console.log('✅ Using SendGrid for email');
        return nodemailer.createTransport({
            host: 'smtp.sendgrid.net',
            port: 587,
            secure: false,
            auth: {
                user: 'apikey',
                pass: process.env.SENDGRID_API_KEY.trim()
            }
        });
    }
    
    // Fallback to Gmail for local development
    console.log('⚠️ Using Gmail fallback (SendGrid key not found)');
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.ADMIN_EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });
};

// Send admin notification email
export const sendAdminNotificationEmail = async (userName, userEmail, userRole, approvalToken) => {
    try {
        const transporter = createTransporter();
        
        const approvalLink = `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/user/approve/${approvalToken}`;
        const rejectLink = `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/user/reject/${approvalToken}`;
        
        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: process.env.ADMIN_EMAIL, // Sending to yourself
            subject: `🚨 New ${userRole === 'owner' ? 'Owner' : 'User'} Registration Request`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
                            New ${userRole === 'owner' ? 'Car Owner' : 'User'} Registration Request
                        </h2>
                        
                        <div style="margin: 20px 0;">
                            <p style="font-size: 16px; color: #555;">
                                Someone wants to register on your Car Rental platform:
                            </p>
                            
                            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
                                <p style="margin: 5px 0;"><strong>Name:</strong> ${userName}</p>
                                <p style="margin: 5px 0;"><strong>Email:</strong> ${userEmail}</p>
                                <p style="margin: 5px 0;"><strong>Role:</strong> ${userRole === 'owner' ? 'Car Owner' : 'Regular User'}</p>
                                <p style="margin: 5px 0;"><strong>Request Time:</strong> ${new Date().toLocaleString()}</p>
                            </div>
                        </div>
                        
                        <div style="margin: 30px 0; text-align: center;">
                            <p style="font-size: 16px; color: #555; margin-bottom: 20px;">
                                Click below to approve or reject this registration:
                            </p>
                            
                            <a href="${approvalLink}" 
                               style="display: inline-block; padding: 12px 30px; margin: 10px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                                ✅ APPROVE
                            </a>
                            
                            <a href="${rejectLink}" 
                               style="display: inline-block; padding: 12px 30px; margin: 10px; background-color: #f44336; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                                ❌ REJECT
                            </a>
                        </div>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                            <p style="font-size: 12px; color: #888; text-align: center;">
                                This is an automated notification from your Car Rental System.<br>
                                If you didn't expect this, please check your platform for unauthorized registration attempts.
                            </p>
                        </div>
                    </div>
                </div>
            `
        };
        
        await transporter.sendMail(mailOptions);
        console.log(`Admin notification sent for ${userEmail}`);
        return true;
    } catch (error) {
        console.error('Error sending admin notification email:', error);
        throw error;
    }
};

// Send approval confirmation to user
export const sendUserApprovalEmail = async (userName, userEmail) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: userEmail,
            subject: '✅ Your Account Has Been Approved!',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                        <h2 style="color: #4CAF50; text-align: center;">
                            🎉 Welcome to Car Rental!
                        </h2>
                        
                        <p style="font-size: 16px; color: #555;">
                            Hello ${userName},
                        </p>
                        
                        <p style="font-size: 16px; color: #555;">
                            Great news! Your account has been approved by our administrator. 
                            You can now login and start using our car rental services.
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" 
                               style="display: inline-block; padding: 12px 30px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                                Login Now
                            </a>
                        </div>
                        
                        <p style="font-size: 14px; color: #888; text-align: center; margin-top: 30px;">
                            Thank you for choosing our service!
                        </p>
                    </div>
                </div>
            `
        };
        
        await transporter.sendMail(mailOptions);
        console.log(`Approval email sent to ${userEmail}`);
        return true;
    } catch (error) {
        console.error('Error sending approval email:', error);
        throw error;
    }
};

// Send rejection email to user
export const sendUserRejectionEmail = async (userName, userEmail) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: userEmail,
            subject: 'Registration Request Update',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                        <h2 style="color: #f44336;">
                            Registration Request
                        </h2>
                        
                        <p style="font-size: 16px; color: #555;">
                            Hello ${userName},
                        </p>
                        
                        <p style="font-size: 16px; color: #555;">
                            We regret to inform you that your registration request has not been approved at this time.
                        </p>
                        
                        <p style="font-size: 16px; color: #555;">
                            If you have any questions or believe this was a mistake, please contact our support team.
                        </p>
                        
                        <p style="font-size: 14px; color: #888; text-align: center; margin-top: 30px;">
                            Thank you for your interest in our service.
                        </p>
                    </div>
                </div>
            `
        };
        
        await transporter.sendMail(mailOptions);
        console.log(`Rejection email sent to ${userEmail}`);
        return true;
    } catch (error) {
        console.error('Error sending rejection email:', error);
        throw error;
    }
};
// Send email verification email
export const sendVerificationEmail = async (userName, userEmail, verificationToken) => {
    try {
        const transporter = createTransporter();
        
        const verificationLink = `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/user/verify-email/${verificationToken}`;
        
        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: userEmail,
            subject: 'Verify Your Email Address',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                        <h2 style="color: #4CAF50;">
                            Email Verification Required
                        </h2>
                        
                        <p style="font-size: 16px; color: #555;">
                            Hello ${userName},
                        </p>
                        
                        <p style="font-size: 16px; color: #555;">
                            Thank you for registering! Please verify your email address to complete your registration.
                        </p>
                        
                        <p style="font-size: 16px; color: #555;">
                            Click the button below to verify your email address:
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px;">
                                Verify Email Address
                            </a>
                        </div>
                        
                        <p style="font-size: 14px; color: #888;">
                            Or copy and paste this link in your browser:<br>
                            <a href="${verificationLink}" style="color: #4CAF50;">${verificationLink}</a>
                        </p>
                        
                        <p style="font-size: 14px; color: #888;">
                            <strong>Important:</strong> This verification link will expire in 24 hours.
                        </p>
                        
                        <p style="font-size: 14px; color: #888;">
                            If you didn't create an account, please ignore this email.
                        </p>
                        
                        <p style="font-size: 14px; color: #888; text-align: center; margin-top: 30px;">
                            Thank you for joining us!
                        </p>
                    </div>
                </div>
            `
        };
        
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${userEmail}`);
        return true;
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
};