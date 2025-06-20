import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";

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
    <div>
      <h2>Welcome to your Dashboard</h2>
      <SearchBar />
    </div>
  );
};

export default Dashboard;
