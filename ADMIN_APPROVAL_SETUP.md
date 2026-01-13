# 🔒 Admin Approval System - Setup Guide

## Security Features Implemented

### 1. **Admin Approval System**
- All new user registrations (both regular users and car owners) require admin approval
- Admin receives an email notification for each new registration request
- Email contains approve/reject buttons for easy one-click approval

### 2. **Email Validation**
- Strict email format validation using regex pattern
- Prevents invalid email formats like incomplete domains
- Validates on both client and server side

### 3. **Approval Workflow**
- User submits registration → Account created with `isApproved: false`
- Admin receives notification email with user details
- Admin clicks "Approve" or "Reject" in the email
- User receives confirmation email when approved
- User can only login after approval

---

## 📧 Email Configuration Setup

### Step 1: Set Up Gmail App Password

**⚠️ NEVER use your regular Gmail password!**

1. **Enable 2-Factor Authentication**
   - Go to: https://myaccount.google.com/security
   - Find "2-Step Verification" and enable it
   - Follow the prompts to set up 2FA

2. **Generate App Password**
   - After enabling 2FA, go to: https://myaccount.google.com/apppasswords
   - Or search for "App passwords" in your Google Account settings
   
3. **Create the App Password**
   - Select App: **Mail**
   - Select Device: **Other (Custom name)**
   - Enter name: **Car Rental System**
   - Click **Generate**
   
4. **Copy the Password**
   - You'll see a 16-character password like: `abcd efgh ijkl mnop`
   - **Important**: Remove all spaces when adding to .env file
   - Example: `abcdefghijklmnop`

### Step 2: Update Your .env File

Add these lines to your `server/.env` file:

```env
# Your personal email (where you'll receive notifications)
ADMIN_EMAIL=your_email@gmail.com

# The app password you generated (no spaces!)
ADMIN_EMAIL_PASSWORD=abcdefghijklmnop

# Backend URL (needed for approval links)
BACKEND_URL=http://localhost:3000

# Frontend URL (needed for login redirect)
FRONTEND_URL=http://localhost:5173
```

**Example with real values:**
```env
ADMIN_EMAIL=john.doe@gmail.com
ADMIN_EMAIL_PASSWORD=xyzabc123def4567
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

---

## 🚀 How It Works

### Registration Flow:

1. **User Signs Up**
   - Fills registration form with name, email, password
   - Selects role (Regular User or Car Owner)
   - Clicks "Create Account"

2. **Server Processing**
   - Validates email format
   - Checks if user already exists
   - Creates account with `isApproved: false`
   - Generates unique approval token
   - Sends email to admin (you)

3. **Admin Receives Email**
   - Email contains:
     - User's name and email
     - Role (User or Car Owner)
     - Registration time
     - **APPROVE** button (green)
     - **REJECT** button (red)

4. **Admin Takes Action**
   - Click **APPROVE**: 
     - User's account is activated
     - User receives approval email
     - User can now login
   
   - Click **REJECT**:
     - User account is deleted
     - User receives rejection email
     - User must register again if needed

5. **User Logs In**
   - If not approved yet: Shows pending message
   - If approved: Login successful
   - If rejected: Account doesn't exist

---

## 📧 Email Templates

### Admin Notification Email
You'll receive emails that look like this:

```
Subject: 🚨 New User Registration Request

New User Registration Request
━━━━━━━━━━━━━━━━━━━━━━━━━━

Someone wants to register on your Car Rental platform:

Name: John Doe
Email: john@example.com
Role: Regular User
Request Time: Jan 13, 2026, 10:30 AM

[✅ APPROVE]  [❌ REJECT]
```

### User Approval Email
Users receive this when approved:

```
Subject: ✅ Your Account Has Been Approved!

🎉 Welcome to Car Rental!

Hello John,

Great news! Your account has been approved. 
You can now login and start using our car rental services.

[Login Now]
```

---

## 🔧 Testing the System

### Test Registration:

1. Start your server:
   ```bash
   cd server
   npm run dev
   ```

2. Start your client:
   ```bash
   cd client
   npm run dev
   ```

3. Go to your website and click "Sign Up"

4. Fill in the form and submit

5. Check your email (ADMIN_EMAIL) - you should receive a notification

6. Click the approve/reject button

7. Check the test user's email for confirmation

### Troubleshooting:

**Problem**: Not receiving emails

**Solutions**:
- Verify Gmail App Password is correct (no spaces)
- Check if 2FA is enabled on your Google Account
- Check spam/junk folder
- Verify ADMIN_EMAIL is correct
- Check server logs for email errors

**Problem**: "Invalid credentials" error

**Solutions**:
- Make sure you're using an App Password, not your regular Gmail password
- Regenerate a new App Password
- Remove all spaces from the password in .env

**Problem**: Approval links don't work

**Solutions**:
- Verify BACKEND_URL in .env matches your server URL
- Make sure server is running when clicking links
- Check if port 3000 is correct

---

## 🛡️ Security Benefits

1. **Prevents Spam Registrations**
   - All accounts need your approval
   - Malicious users can't create accounts automatically

2. **Email Validation**
   - Only valid email formats accepted
   - Reduces fake registrations

3. **Manual Control**
   - You review every registration
   - Can reject suspicious users
   - Full audit trail via email

4. **Bad Entries Prevention**
   - Bad actors can't add content
   - Car owners need approval to list cars
   - Quality control from registration stage

---

## 📝 Additional Notes

### For Production Deployment:

1. **Update URLs in .env**:
   ```env
   BACKEND_URL=https://your-backend-domain.com
   FRONTEND_URL=https://your-frontend-domain.com
   ```

2. **Consider Using Professional Email Service**:
   - Gmail has sending limits (500 emails/day)
   - For production, consider:
     - SendGrid
     - AWS SES
     - Mailgun
     - Postmark

3. **Keep App Password Secret**:
   - Never commit .env to Git
   - Use environment variables on your hosting platform
   - Rotate passwords periodically

### Optional Enhancements:

You can modify the system to:
- Add email notifications when users update profiles
- Send weekly digest of pending approvals
- Add admin dashboard to manage users
- Implement automatic approval for certain email domains
- Add captcha to prevent automated registrations

---

## 🔗 Important Links

- Gmail Security Settings: https://myaccount.google.com/security
- Generate App Passwords: https://myaccount.google.com/apppasswords
- Nodemailer Documentation: https://nodemailer.com/

---

## ✅ Quick Checklist

Before running the system:

- [ ] Gmail 2FA enabled
- [ ] App Password generated
- [ ] ADMIN_EMAIL added to .env
- [ ] ADMIN_EMAIL_PASSWORD added to .env (no spaces!)
- [ ] BACKEND_URL set correctly
- [ ] FRONTEND_URL set correctly
- [ ] Server restarted after .env changes
- [ ] Test registration to verify emails are sent

---

## 🆘 Support

If you encounter issues:
1. Check server console logs for errors
2. Verify all environment variables are set
3. Test email sending with a simple registration
4. Check Gmail security settings
5. Ensure server is accessible from the approval email links

---

**Implementation Date**: January 13, 2026
**Version**: 1.0
**Status**: ✅ Ready for Testing
