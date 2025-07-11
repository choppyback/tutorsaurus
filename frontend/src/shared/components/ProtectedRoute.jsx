import React from "react";
import { Navigate } from "react-router-dom";
import { isTokenExpired } from "../utils/isTokenExpired";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token"); // if expire remove token
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
