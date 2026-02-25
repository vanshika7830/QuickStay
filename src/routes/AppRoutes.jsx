import { Routes, Route } from "react-router-dom";

// USER
import UserLayout from "../user/layout/UserLayout";
import Home from "../user/pages/Home";
import Hotels from "../user/pages/Hotels";
import HotelDetails from "../user/pages/HotelDetails";
import Booking from "../user/pages/Booking";
import UserLogin from "../user/pages/UserLogin";
import UserSignup from "../user/pages/UserSignUp";
import UserDashboard from "../user/pages/UserDashboard";
import UserBookings from "../user/pages/UserBookings";
import UserProfile from "../user/pages/UserProfile";


// ADMIN
import AdminLayout from "../admin/layout/AdminLayout";
import AdminLogin from "../admin/pages/AdminLogin";
import Dashboard from "../admin/pages/Dashboard";
import AdminHotels from "../admin/pages/Hotels";
import AddHotel from "../admin/pages/AddHotel";
import Bookings from "../admin/pages/Bookings";
import AdminProtectedRoute from "../admin/components/AdminProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* USER */}
      <Route path="/" element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path="hotels" element={<Hotels />} />
        <Route path="hotels/:id" element={<HotelDetails />} />
        <Route path="hotels/:id/book" element={<Booking />} />

        <Route path="login" element={<UserLogin />} />
        <Route path="signup" element={<UserSignup />} />
        <Route path="dashboard" element={<UserDashboard />}>
          <Route path="user-bookings" element={<UserBookings />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>

      </Route>

      {/* ADMIN */}
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="hotels" element={<AdminHotels />} />
        <Route path="add-hotel" element={<AddHotel />} />
        <Route path="bookings" element={<Bookings />} />

      </Route>

      {/* 404 */}
      <Route path="*" element={<h1 style={{ padding: 30 }}>Not Found</h1>} />
    </Routes>
  );
}
