import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import React from "react";

const UserFormDialog = ({
  open,
  onClose,
  onSubmit,
  formData,
  handleChange,
  currentUser,
  faculties,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{currentUser ? "Edit User" : "Add New User"}</DialogTitle>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <Stack spacing={2} sx={{ pt: "5px", width: "550px" }}>
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
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                label="Role"
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
                <MenuItem value="">
                  <em>Select Year</em>
                </MenuItem>
                {[1, 2, 3, 4, 5].map((year) => (
                  <MenuItem key={year} value={year}>
                    Year {year}
                  </MenuItem>
                ))}
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
                <MenuItem value="">
                  <em>Select Faculty</em>
                </MenuItem>
                {faculties.map((f, idx) => (
                  <MenuItem key={idx} value={f}>
                    {f}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit} color="primary">
          {currentUser ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserFormDialog;
