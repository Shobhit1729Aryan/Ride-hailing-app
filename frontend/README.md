## ⚠️ Chrome Security Warning (Important)

If the app does not work in **Google Chrome** and shows a security warning:

### ✅ What worked:
1. Click the **red warning / "Not Secure" icon** on the page
2. Chrome will open **Site settings**
3. Set security to **Allow / No security**
4. Reload the page

After this, Google Maps autocomplete and location suggestions work correctly.

✅ The app works without any issues in **Edge, Firefox, and other browsers**.

# Ride Hailing Frontend (Uber Clone)

A modern **React-based frontend** for an Uber-like ride hailing application.  
The frontend supports **User and Captain roles**, real-time ride updates using **Socket.IO**, OTP-based ride start, and smooth animated panels inspired by real ride-hailing apps.

---

## 🚀 Tech Stack

- React 18
- Vite
- React Router DOM
- Context API
- Socket.IO Client
- Axios
- Tailwind CSS
- GSAP (panel animations)

---

## 🎥 Features (As shown in demo video)

### 👤 User Features
- User signup & login
- Pickup and destination search with autocomplete
- Fare estimation (Auto / Car / Moto)
- Ride confirmation
- Waiting for captain assignment
- Ride started screen
- Live ride tracking
- Payment screen

### 🚖 Captain Features
- Captain signup & login
- Real-time incoming ride requests
- Accept / reject rides
- OTP-based ride start
- Live tracking during ride
- Finish ride flow

---

## 🔄 Application Flow

### User Flow
1. User login / signup
2. Enter pickup & destination
3. View fare estimates
4. Confirm ride
5. Wait for captain
6. Ride starts after OTP verification
7. Live tracking & payment

### Captain Flow
1. Captain login / signup
2. Receive ride request in real time
3. Accept ride
4. Enter OTP to start ride
5. Navigate to captain riding screen
6. Finish ride
