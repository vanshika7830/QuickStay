# 🏨 MERN Hotel Booking Application

A full-stack Hotel Booking Web Application built using the MERN stack with third-party travel API integration. This project demonstrates authentication, hotel listing, booking management, admin dashboard analytics, and external API data handling.

---

## 🚀 Project Overview

This application allows users to:

* Browse hotels
* View hotel details
* Book hotels
* Manage bookings
* Login / Signup securely
* View dashboard statistics (Admin)

Hotels are imported dynamically using a third-party travel API and enhanced with custom image handling.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* CSS
* Lucide React (icons)

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* CORS
* dotenv

### Third Party API

* Amadeus Hotel List API (for hotel data)

---

## 📂 Folder Structure

```
root
 ├── backend
 │   ├── models
 │   ├── routes
 │   ├── middleware
 │   ├── config
 │   └── server.js
 │
 ├── frontend
 │   ├── user
 │   ├── admin
 │   ├── components
 │   └── App.jsx
```

---

## 🔐 Authentication Features

* User Signup
* User Login
* JWT Token-based authentication
* Protected Routes using middleware
* Role-based access (Admin / User)

---

## 🏨 Hotel Features

* Import hotels from Amadeus API
* Store hotels in MongoDB
* Prevent duplicate hotel entries
* Multiple images per hotel (minimum 3 images stored as array)
* Dynamic hotel image support
* View hotel details page

---

## 📅 Booking Features

* Book a hotel
* Store booking details in database
* Associate bookings with logged-in user
* View user bookings

---

## 📊 Admin Dashboard

Admin can view:

* Total Hotels
* Total Bookings
* Total Revenue
* Active Users (filtered by role)

Dashboard statistics are dynamically calculated using MongoDB queries.

---

## 🗄️ Database Schema (Simplified)

### User Schema

* name
* email
* password
* role (admin/user)

### Hotel Schema

* name
* cityCode
* latitude
* longitude
* address
* images (Array of Strings)

### Booking Schema

* user
* hotel
* checkInDate
* checkOutDate
* totalPrice

---

## 🌍 Environment Variables

Create a `.env` file in backend:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
AMADEUS_CLIENT_ID=your_amadeus_client_id
AMADEUS_CLIENT_SECRET=your_amadeus_client_secret
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```
git clone <repository-url>
cd project-folder
```

### 2️⃣ Install Backend Dependencies

```
cd backend
npm install
```

### 3️⃣ Install Frontend Dependencies

```
cd frontend
npm install
```

### 4️⃣ Run Backend

```
npm run dev
```

### 5️⃣ Run Frontend

```
npm start
```

---

## 🔄 Import Hotels

Call the import route once:

```
http://localhost:5000/api/hotels/import-hotels
```

Hotels will be saved into MongoDB with multiple images.

---

## 🎯 Key Learning Outcomes

* REST API development
* MongoDB data modeling
* Third-party API integration
* JWT authentication
* Role-based authorization
* Dashboard data aggregation
* Handling external API limitations (like missing images)

---

## 🔮 Future Improvements

* Payment Gateway Integration
* Real-time availability
* Reviews & Ratings
* Hotel search filters
* Cloud image storage (Cloudinary)
* Deployment (Render / Vercel / Railway)

---

## 👩‍💻 Author

Vanshika Gupta

---

## 📜 License

This project is created for educational purposes.

---

⭐ If you like this project, feel free to fork and enhance it!
