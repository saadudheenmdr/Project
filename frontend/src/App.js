import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// User Pages
import Dashboard from "./pages/Dashboard";
import BookingForm from './pages/BookingForm';
import MyVehicles from './pages/MyVehicles';
import AppointmentHistory from './pages/AppointmentHistory';
import Profile from './pages/Profile';

// Admin Pages (Ningalude folder structure anusarich path correct aanennurappu varuthuka)
import AdminDashboard from './components/AdminDashboard';
import AdminAppointments from './components/AdminAppointments';
import ApprovedServices from './components/ApprovedServices';
import PendingServices from './components/PendingServices';
// Security
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* =========================
            Public Routes 
        ========================= */}
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* =========================
            Protected User Routes (Strictly for regular users)
        ========================= */}
        <Route path="/dashboard" element={
          <ProtectedRoute userOnly={true}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/book-appointment" element={
          <ProtectedRoute userOnly={true}>
            <BookingForm />
          </ProtectedRoute>
        } />

        <Route path="/my-vehicles" element={
          <ProtectedRoute userOnly={true}>
            <MyVehicles />
          </ProtectedRoute>
        } />

        <Route path="/appointment-history" element={
          <ProtectedRoute userOnly={true}>
            <AppointmentHistory />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/* =========================
            Protected Admin Routes (Strictly for admins)
        ========================= */}
        <Route path="/admin-dashboard" element={
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin-appointments" element={
          <ProtectedRoute adminOnly={true}>
            <AdminAppointments />
          </ProtectedRoute>
        } />

        <Route path="/approved-services" element={
          <ProtectedRoute adminOnly={true}>
            <ApprovedServices />
          </ProtectedRoute>
        } />
        <Route path="/pending-services" element={
          <ProtectedRoute adminOnly={true}>
            <PendingServices />
          </ProtectedRoute>
        } />

        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;