import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import NavBar from "../../../shared/components/NavBar";
import styles from "./AdminDashboard.js";
import { getRoleFromToken } from "../../../shared/utils/getRoleFromToken";
import { useUserManagement } from "../hooks/useUserManagement.js";
import PillFilter from "../../../shared/components/PillFilter.jsx";
import UserFormDialog from "../components/UserFormDialog";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { users, create, update, remove } = useUserManagement(navigate);
  const [activeRoleFilter, setActiveRoleFilter] = useState("all");

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

  const USER_FILTERS = [
    { label: "All users", value: "all" },
    { label: "Admins", value: "admin" },
    { label: "Tutors", value: "tutor" },
    { label: "Students", value: "student" },
  ];

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

  const handleClose = () => setOpen(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    currentUser ? await update(currentUser, formData) : await create(formData);
    handleClose();
  };

  const handleDelete = async (userId, userName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${userName}?`
    );
    if (!confirmed) return;
    await remove(userId);
  };

  const filteredUsers = users.filter((user) =>
    activeRoleFilter === "all" ? true : user.role === activeRoleFilter
  );

  return (
    <>
      <NavBar role={getRoleFromToken()} />
      <Box sx={styles.page}>
        <h1>Admin Dashboard</h1>
        <PillFilter
          options={USER_FILTERS}
          active={activeRoleFilter}
          onChange={setActiveRoleFilter}
        />
        <Button variant="contained" onClick={() => handleOpen()}>
          Add New User
        </Button>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
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
              {filteredUsers.map((user) => (
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
                      onClick={() => handleDelete(user.user_id, user.name)}
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
        <UserFormDialog
          open={open}
          onClose={handleClose}
          onSubmit={handleSubmit}
          formData={formData}
          handleChange={handleChange}
          currentUser={currentUser}
          faculties={faculties}
        />
      </Box>
    </>
  );
};

export default AdminDashboard;
