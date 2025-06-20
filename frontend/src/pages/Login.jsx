import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@mui/material";
import BASE_URL from "../api";
import styles from "../styles/login";

const Login = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, inputs);
      alert("Login successful! Token: " + res.data.jwtToken);
      localStorage.setItem("token", res.data.jwtToken);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data || "Login failed");
    }
  };

  return (
    <Box sx={styles.page}>
      {/* Brand Header */}
      <Box sx={styles.brandHeader}>
        <Box sx={styles.brandContent}>
          <Box
            component="img"
            src="/logo-pure.png"
            alt="Tutorsaurus Logo"
            sx={styles.brandLogo}
          />
          <Typography variant="h5" sx={styles.logoText}>
            Tutorsaurus
          </Typography>
        </Box>
      </Box>

      {/* Login Form */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 200px)", // subtract logo height + top padding
        }}
      >
        <Box component="form" onSubmit={handleSubmit} sx={styles.formBox}>
          <Typography variant="h5" fontWeight="bold" sx={styles.title}>
            Login
          </Typography>

          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            onChange={handleChange}
            required
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={styles.loginButton}
          >
            Log In
          </Button>

          <Typography sx={styles.signUpText}>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </Typography>

          <Button
            type="button"
            onClick={() => navigate("/")}
            sx={styles.backButton}
          >
            ← Back to home
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
