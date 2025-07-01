import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import axios from "axios";
import BASE_URL from "../api";
import {
  Tooltip,
  Box,
  Typography,
  TextField,
  Avatar,
  Grid,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AvailabilityPicker, {
  getFormattedAvailability,
} from "../components/AvailabilityPicker";
import ModuleSelect from "../components/ModuleSelect";
import dayjs from "dayjs";
import styles from "../styles/editprofile";

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

const genders = ["Male", "Female"];
const years = [1, 2, 3, 4, 5];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function EditProfile() {
  const [userData, setUserData] = useState(null);
  const [availability, setAvailability] = useState({});
  const [originalEmail, setOriginalEmail] = useState("");
  const [originalData, setOriginalData] = useState(null);
  const token = localStorage.getItem("token");
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [modules, setModules] = useState([]);

  const isAvailabilityFilled = () => {
    for (const day in availability) {
      const slot = availability[day];
      if (slot.enabled && (!slot.start || !slot.end)) {
        alert(`Please provide both start and end time for ${day}.`);
        return false;
      }
    }
    return true;
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newAvailability = {};
      for (const day of days) {
        const data = res.data.availability?.[day] || {};
        newAvailability[day] = {
          enabled: !!data.enabled,
          start: data.start ? dayjs(`2000-01-01 ${data.start}`) : null,
          end: data.end ? dayjs(`2000-01-01 ${data.end}`) : null,
        };
      }

      const userWithFormattedAvailability = {
        ...res.data,
        availability: newAvailability,
      };
      setUserData(userWithFormattedAvailability);
      setOriginalData(userWithFormattedAvailability);
      setOriginalEmail(res.data.email);
      setAvailability(newAvailability);
    } catch (err) {
      console.error("Profile fetch failed:", err.response?.data || err.message);
    }
  };

  const fetchModules = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/modules`);
      setModules(res.data);
    } catch (err) {
      console.error("Failed to fetch modules", err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchModules();
  }, []);

  const handleSave = async () => {
    try {
      if (
        userData.role === "tutor" &&
        (!userData.modules_taught || !userData.hourly_rate)
      ) {
        alert("Please ensure Modules Taught and Hourly Rate are filled in");
        return;
      }

      if (!isAvailabilityFilled()) return;

      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("email", userData.email);
      formData.append("faculty", userData.faculty);
      formData.append("year_of_study", userData.year_of_study);
      formData.append("gender", userData.gender);

      if (userData.role === "tutor") {
        formData.append("bio", userData.bio || "");
        formData.append("modules_taught", userData.modules_taught);
        formData.append("hourly_rate", userData.hourly_rate);
        formData.append(
          "availability",
          JSON.stringify(getFormattedAvailability(availability))
        );
      }

      if (newProfilePic) {
        formData.append("profile_pic", newProfilePic);
      }

      await axios.put(`${BASE_URL}/api/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile updated successfully");
      await fetchProfile();
    } catch (err) {
      console.error(
        "Error updating profile:",
        err.response?.data || err.message
      );
      alert("Failed to update profile");
    }
  };

  if (!userData) {
    return (
      <Box sx={styles.page}>
        <NavBar />
        <Box sx={styles.container}>
          <Typography variant="h5">Loading....</Typography>
        </Box>
      </Box>
    );
  }

  const hasChanges = () => {
    if (!originalData || !userData) return false;

    return (
      originalData.name !== userData.name ||
      originalData.email !== userData.email ||
      originalData.faculty !== userData.faculty ||
      originalData.gender !== userData.gender ||
      originalData.year_of_study !== userData.year_of_study ||
      userData.bio !== originalData.bio ||
      userData.modules_taught !== originalData.modules_taught ||
      userData.hourly_rate !== originalData.hourly_rate ||
      JSON.stringify(originalData.availability) !==
        JSON.stringify(availability) ||
      newProfilePic !== null
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={styles.page}>
        <NavBar />
        <Box sx={styles.container}>
          <Typography variant="h4" sx={styles.title}>
            Edit Profile
          </Typography>

          <Paper elevation={24} sx={styles.paper}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Box sx={{ maxWidth: 730, width: "100%" }}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={userData.name}
                    onChange={(e) =>
                      setUserData({ ...userData, name: e.target.value })
                    }
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    value={userData.email}
                    margin="normal"
                    onChange={(e) =>
                      setUserData({ ...userData, email: e.target.value })
                    }
                  />
                  {userData.email !== originalEmail && (
                    <Typography
                      variant="caption"
                      color="warning.main"
                      sx={styles.emailWarning}
                    >
                      NOTE!! this will be your new login email.
                    </Typography>
                  )}

                  <FormControl fullWidth margin="normal">
                    <InputLabel>Faculty</InputLabel>
                    <Select
                      value={userData.faculty}
                      label="Faculty"
                      onChange={(e) =>
                        setUserData({ ...userData, faculty: e.target.value })
                      }
                    >
                      {faculties.map((faculty) => (
                        <MenuItem key={faculty} value={faculty}>
                          {faculty}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth margin="normal">
                    <InputLabel>Year of Study</InputLabel>
                    <Select
                      value={userData.year_of_study}
                      label="Year of Study"
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          year_of_study: e.target.value,
                        })
                      }
                    >
                      {years.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth margin="normal">
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={userData.gender}
                      label="Gender"
                      onChange={(e) =>
                        setUserData({ ...userData, gender: e.target.value })
                      }
                    >
                      {genders.map((g) => (
                        <MenuItem key={g} value={g}>
                          {g}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {userData.role === "tutor" && (
                    <>
                      <TextField
                        fullWidth
                        label="Bio"
                        multiline
                        rows={4}
                        required
                        inputProps={{ maxLength: 250 }}
                        helperText={`${
                          userData.bio?.length || 0
                        }/250 characters`}
                        value={userData.bio || ""}
                        onChange={(e) =>
                          setUserData({ ...userData, bio: e.target.value })
                        }
                        margin="normal"
                      />
                      <ModuleSelect
                        options={modules}
                        value={
                          userData.modules_taught
                            ? userData.modules_taught.split(", ")
                            : []
                        }
                        onChange={(newModules) =>
                          setUserData({
                            ...userData,
                            modules_taught: newModules.join(", "),
                          })
                        }
                      />
                      <TextField
                        fullWidth
                        type="number"
                        label="Hourly Rate ($)"
                        required
                        value={userData.hourly_rate || ""}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            hourly_rate: e.target.value,
                          })
                        }
                        margin="normal"
                      />
                      <AvailabilityPicker
                        availability={availability}
                        setAvailability={setAvailability}
                      />
                    </>
                  )}
                </Box>
              </Grid>

              <Grid item md={6} px={5} sx={styles.avatarSection}>
                <Avatar
                  src={
                    newProfilePic
                      ? URL.createObjectURL(newProfilePic)
                      : userData.profile_pic
                      ? BASE_URL + userData.profile_pic
                      : ""
                  }
                  alt="Profile"
                  sx={styles.avatar}
                />
                <Button
                  variant="outlined"
                  component="label"
                  sx={styles.uploadButton}
                >
                  Upload New Picture
                  <input
                    type="file"
                    hidden
                    accept=".jpg,.jpeg"
                    name="profile_pic"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && file.size > 5 * 1024 * 1024) {
                        alert("File size should not exceed 5MB.");
                        e.target.value = "";
                      } else {
                        setNewProfilePic(file);
                      }
                    }}
                  />
                </Button>
                <Typography variant="subtitle1" sx={styles.subtitle}>
                  Profile Picture
                </Typography>
                <Tooltip title={!hasChanges() ? "No changes made" : ""}>
                  <span>
                    <Button
                      variant="contained"
                      sx={styles.saveButton}
                      disabled={!hasChanges()}
                      onClick={handleSave}
                    >
                      Save Changes
                    </Button>
                  </span>
                </Tooltip>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}

export default EditProfile;
