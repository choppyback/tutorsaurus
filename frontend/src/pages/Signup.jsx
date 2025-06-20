import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
} from "@mui/material";
import BASE_URL from "../api.js";
import styles from "../styles/signup";

const faculties = [
  "Arts and Social Sciences",
  "Business",
  "Computing",
  "Dentistry",
  "Design and Engineering",
  "Law",
  "Medicine",
  "Science",
  "Music",
  "Public Health",
  "Public Policy",
];

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    faculty: "",
    gender: "",
    year_of_study: "",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [modulesTaught, setModulesTaught] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.role === "tutor" && !profilePic) {
      setError("Profile picture is required for tutors.");
      return;
    }

    try {
      const data = new FormData();
      for (const key in formData) data.append(key, formData[key]);
      if (profilePic) data.append("profile_pic", profilePic);
      if (formData.role === "tutor") {
        data.append("modules_taught", modulesTaught);
        data.append("hourly_rate", hourlyRate);
      }

      const res = await axios.post(`${BASE_URL}/auth/signup`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Signup successful. Token: " + res.data.jwtToken);
      localStorage.setItem("token", res.data.jwtToken);
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.error || "Signup failed.";
      alert(`Signup failed: ${msg}`);
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

      {/* Form Section */}
      <Box sx={styles.centerContainer}>
        <Box component="form" onSubmit={handleSubmit} sx={styles.formBox}>
          <Typography variant="h5" sx={styles.title}>
            Signup
          </Typography>

          <TextField
            name="name"
            label="Name"
            required
            onChange={handleChange}
          />
          <TextField
            name="email"
            type="email"
            label="Email"
            required
            onChange={handleChange}
          />
          <TextField
            name="password"
            type="password"
            label="Password"
            required
            onChange={handleChange}
          />

          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="tutor">Tutor</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Faculty</InputLabel>
            <Select
              label="Faculty"
              name="faculty"
              value={formData.faculty}
              onChange={handleChange}
              required
            >
              {faculties.map((f, idx) => (
                <MenuItem key={idx} value={f}>
                  {f}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Gender</InputLabel>
            <Select
              label="Gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Year of Study</InputLabel>
            <Select
              label="Year of Study"
              value={formData.year_of_study}
              onChange={handleChange}
              required
            >
              {[1, 2, 3, 4, 5].map((year) => (
                <MenuItem key={year} value={year}>
                  Year {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {formData.role === "tutor" && (
            <>
              <TextField
                label="Modules Taught (e.g. CS2030S,CS2040S)"
                value={modulesTaught}
                onChange={(e) => setModulesTaught(e.target.value)}
                required
              />
              <TextField
                label="Hourly Rate (e.g. 30)"
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                required
              />
              <Box>
                <Typography
                  sx={{ fontWeight: "bold", color: "#294A29", mb: 1 }}
                >
                  Profile Picture (JPG only, max 5MB)
                </Typography>
                <input
                  type="file"
                  accept=".jpg,.jpeg"
                  name="profile_pic"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file && file.size > 5 * 1024 * 1024) {
                      alert("File size should not exceed 5MB.");
                      e.target.value = ""; // reset file input
                    } else {
                      setProfilePic(file);
                    }
                  }}
                  required
                />
              </Box>
            </>
          )}

          {error && <Typography sx={styles.errorText}>{error}</Typography>}

          <Button type="submit" variant="contained" sx={styles.submitButton}>
            Sign Up
          </Button>

          <Typography sx={{ mt: 2, textAlign: "center" }}>
            Already have an account? <Link to="/login">Log in</Link>
          </Typography>

          <Button onClick={() => navigate("/")} sx={styles.backButton}>
            ← Back to home
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Signup;
