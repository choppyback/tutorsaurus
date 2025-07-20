// src/components/AdminDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import serverBaseURL from "../../config/api.js";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    gender: "",
    year_of_study: "",
    faculty: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${serverBaseURL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        if (err.response?.status === 403) {
          navigate("/");
        }
      }
    };
    fetchUsers();
  }, [navigate]);

  const handleOpen = (user = null) => {
    if (user) {
      setCurrentUser(user.user_id);
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role,
        gender: user.gender || "",
        year_of_study: user.year_of_study || "",
        faculty: user.faculty || "",
      });
    } else {
      setCurrentUser(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "student",
        gender: "",
        year_of_study: "",
        faculty: "",
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (currentUser) {
        // Update existing user
        await axios.put(
          `${serverBaseURL}/api/admin/users/${currentUser}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        // Create new user
        await axios.post(`${serverBaseURL}/api/admin/users`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      // Refresh user list
      const response = await axios.get(`${serverBaseURL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
      handleClose();
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${serverBaseURL}/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      //filter out the deleted id
      setUsers(users.filter((user) => user.user_id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add New User
      </Button>

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Faculty</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.user_id}>
                <TableCell>{user.user_id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.gender || "-"}</TableCell>
                <TableCell>{user.year_of_study || "-"}</TableCell>
                <TableCell>{user.faculty || "-"}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpen(user)}>Edit</Button>
                  <Button
                    onClick={() => handleDelete(user.user_id)}
                    color="error"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentUser ? "Edit User" : "Add New User"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              margin="dense"
              name="name"
              label="Name"
              type="text"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              margin="dense"
              name="email"
              label="Email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              margin="dense"
              name="password"
              label="Password"
              type="password"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              required={!currentUser}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="tutor">Tutor</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              name="gender"
              label="Gender"
              type="text"
              fullWidth
              value={formData.gender}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="year_of_study"
              label="Year of Study"
              type="number"
              fullWidth
              value={formData.year_of_study}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="faculty"
              label="Faculty"
              type="text"
              fullWidth
              value={formData.faculty}
              onChange={handleChange}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            {currentUser ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
