import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./features/auth/pages/Signup/Signup.jsx";
import Landing from "./shared/pages/Landing/Landing.jsx";
import Login from "./features/auth/pages/Login/Login.jsx";
import Home from "./features/home/pages/Home/Home.jsx";
import EditProfile from "./features/profile/pages/EditProfile/EditProfile.jsx";
import ProtectedRoute from "./shared/components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
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
      </Routes>
    </Router>
  );
}

export default App;
