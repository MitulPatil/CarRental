# 🚀 Quick Start - Admin Approval System

## ⚡ 3-Minute Setup

### 1️⃣ Get Gmail App Password (2 minutes)

1. Open: https://myaccount.google.com/apppasswords
2. Click "Select app" → Choose **Mail**
3. Click "Select device" → Choose **Other**
4. Type: "Car Rental"
5. Click **Generate**
6. Copy the 16-character password

### 2️⃣ Add to .env file (1 minute)

Open `server/.env` and add:

```env
ADMIN_EMAIL=your_email@gmail.com
ADMIN_EMAIL_PASSWORD=abcdefghijklmnop
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

### 3️⃣ Restart Server

```bash
cd server
npm run dev
```

## ✅ Test It

1. Register a new user on your website
2. Check your email (ADMIN_EMAIL)
3. Click **APPROVE** or **REJECT**
4. Done!

---

## 📧 What You'll Receive

Every time someone registers, you'll get this email:

```
Subject: 🚨 New User Registration Request

Name: John Doe
Email: john@example.com
Role: Regular User

[✅ APPROVE]  [❌ REJECT]
```

Click the button → Done!

---

## 🔍 What Changed

- ✅ Users need YOUR approval to login
- ✅ Email validation (no more "abc123")  
- ✅ You get notified for every registration
- ✅ One-click approve/reject via email
- ✅ Users get notified when approved

---

## 🐛 Not Working?

### No email received?
- Check spam folder
- Verify ADMIN_EMAIL is correct
- Make sure App Password has no spaces

### Can't generate App Password?
- Enable 2-Factor Authentication first
- Go to: https://myaccount.google.com/security

### Links don't work?
- Make sure server is running
- Check BACKEND_URL matches your server

---

## 📚 Full Documentation

- **Complete Setup**: See `ADMIN_APPROVAL_SETUP.md`
- **All Changes**: See `SECURITY_IMPLEMENTATION.md`

---

**That's it!** Your system is now secure. 🔒
