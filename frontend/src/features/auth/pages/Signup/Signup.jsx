import React, { useState, useEffect } from "react";
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
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import BASE_URL from "../../../../config/api";
import AvailabilityPicker from "../../../../shared/components/AvailabilityPicker.jsx";
import ModuleSelect from "../../../../shared/components/ModuleSelect.jsx";
import styles from "./signup.js";

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
  const [hourlyRate, setHourlyRate] = useState("");
  const [modules, setModules] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/modules`);
        setModules(res.data);
      } catch (err) {
        console.error("Failed to fetch modules", err);
      }
    };

    if (formData.role === "tutor") {
      fetchModules();
    }
  }, [formData.role]);

  // Value check
  const isAvailabilityFilled = () => {
    // Make sure all timing field are filled before submit
    if (formData.role === "tutor" && availability.length === 0) {
      setError("Please select at least one availability slot.");
      return false;
    }
    return true;
  };

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

    if (!isAvailabilityFilled()) {
      return;
    }

    try {
      const data = new FormData();
      for (const key in formData) data.append(key, formData[key]);
      if (profilePic) data.append("profile_pic", profilePic);
      if (formData.role === "tutor") {
        data.append("modules_taught", selectedModules.join(","));
        data.append("hourly_rate", hourlyRate);
        data.append("availability", JSON.stringify(availability));
      }

      // Log form data (DEBUGGING)
      for (const [key, value] of data.entries()) {
        console.log(`${key}:`, value);
      }
      const res = await axios.post(`${BASE_URL}/auth/signup`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // alert("Signup successful. Token: " + res.data.jwtToken);
      localStorage.setItem("token", res.data.jwtToken);
      navigate("/home");
    } catch (err) {
      const msg = err.response?.data;
      alert(`Signup failed: ${msg}`);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                name="gender"
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
                name="year_of_study"
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
                <ModuleSelect
                  options={modules}
                  value={selectedModules}
                  onChange={setSelectedModules}
                />
                <TextField
                  label="Hourly Rate (e.g. 30)"
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  required
                />
                <AvailabilityPicker
                  availability={availability}
                  setAvailability={setAvailability}
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
                        e.target.value = "";
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
    </LocalizationProvider>
  );
};

export default Signup;
