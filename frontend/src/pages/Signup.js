import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api.js";

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
    role: "student", // default role
    faculty: "",
    gender: "",
    year_of_study: "",
  });

  const [profilePic, setProfilePic] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
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
      for (const key in formData) {
        data.append(key, formData[key]);
      }
      if (profilePic) {
        data.append("profile_pic", profilePic); // important field name
      }

      const res = await axios.post(`${BASE_URL}/auth/signup`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Signup successful. Token: " + res.data.jwtToken);
      localStorage.setItem("token", res.data.jwtToken);
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup error:", err.response || err.message);
      const msg = err.response?.data?.error || "Signup failed.";
      alert(`Signup failed: ${msg}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ margin: "auto", paddingLeft: "10px", paddingTop: "40px" }}
    >
      <button type="button" onClick={() => navigate("/")}>
        ⬅ Back
      </button>
      <h2>Signup</h2>
      <input
        type="text"
        name="name"
        placeholder="Name"
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />

      <select name="role" onChange={handleChange} value={formData.role}>
        <option value="student">Student</option>
        <option value="tutor">Tutor</option>
      </select>

      <select name="faculty" onChange={handleChange} required>
        <option value="">-- Select Faculty --</option>
        {faculties.map((f, index) => (
          <option key={index} value={f}>
            {f}
          </option>
        ))}
      </select>
      <select name="gender" onChange={handleChange} required>
        <option value="">-- Select Gender --</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      <select name="year_of_study" onChange={handleChange} required>
        <option value="">-- Select Year --</option>
        {[1, 2, 3, 4, 5].map((year) => (
          <option key={year} value={year}>{`Year ${year}`}</option>
        ))}
      </select>
      {formData.role === "tutor" && (
        <input
          type="file"
          accept="image/*"
          name="profile_pic"
          onChange={handleFileChange}
          required
        />
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit">Sign Up</button>
      <p style={{ marginTop: "10px" }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </form>
  );
};

export default Signup;
