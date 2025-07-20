import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./features/auth/pages/Signup/Signup.jsx";
import Landing from "./features/landing/pages/Landing.jsx";
import Login from "./features/auth/pages/Login/Login.jsx";
import Home from "./features/home/pages/Home/Home.jsx";
import EditProfile from "./features/profile/pages/EditProfile/EditProfile.jsx";
import StudentBookingView from "./features/studentBookings/pages/StudentBookingView.jsx";
import TutorBookingView from "./features/tutorBookings/pages/TutorBookingView.jsx";

import ProtectedRoute from "./shared/components/ProtectedRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editprofile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/bookings"
          element={
            <ProtectedRoute>
              <StudentBookingView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tutor/bookings"
          element={
            <ProtectedRoute>
              <TutorBookingView />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
