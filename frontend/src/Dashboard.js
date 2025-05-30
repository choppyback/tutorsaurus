import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userMessage, setUserMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to view the dashboard");
      navigate("/login");
    } else {
      // You can fetch protected user data from backend here if needed
      setUserMessage("Welcome to your dashboard!");
    }
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", paddingTop: "50px" }}>
      <h2>Dashboard</h2>
      <p>{userMessage}</p>
    </div>
  );
};

export default Dashboard;
