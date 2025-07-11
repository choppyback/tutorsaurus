// BookingInterface.jsx

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import BASE_URL from "../../config/api";

export default function BookingInterface({
  tutor_id,
  modules,
  availability,
  hourly_rate,
}) {
  // STATE
  // ==========================
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);

  // COMPUTED VALUES
  // ==========================

  // Convert modules string to an array
  const moduleOptions = modules ? modules.split(",").map((m) => m.trim()) : [];

  // Extract time slots based on day selected
  const selectedDay = selectedDate.format("ddd");
  const timeSlots = availability
    ?.filter((entry) => entry.day === selectedDay)
    .map((entry) => entry.start_time.slice(0, 5))
    .filter((slot) => !bookedSlots.includes(slot));

  const totalPrice = (selectedSlots.length * hourly_rate).toFixed(2);

  // EVENT HANDLERS
  // ==========================
  const fetchBookedSlots = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/bookings/${tutor_id}`, {
        params: {
          date: selectedDate.format("YYYY-MM-DD"),
        },
      });
      const slots = res.data.map((b) => b.start_time.slice(0, 5)); // convert to 13:00
      setBookedSlots(slots);
    } catch (err) {
      console.error("Failed to fetch booked slots", err);
    }
  };

  useEffect(() => {
    if (tutor_id && selectedDate) {
      fetchBookedSlots();
    }
  }, [tutor_id, selectedDate]);

  const toggleSlot = (slot) => {
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const handleBooking = async () => {
    // Check if all info is selected
    if (!selectedModule || selectedSlots.length === 0) {
      alert("Please select a module and at least one time slot.");
      return;
    }

    const confirmMsg =
      `Confirm booking on ${selectedDate.format("MMM DD, YYYY")}:\n` +
      selectedSlots
        .map((slot) => {
          const start = dayjs(slot, "HH:mm");
          const end = start.add(1, "hour");
          return `${slot} - ${end.format("HH:mm")}`;
        })
        .join("\n");

    const confirmed = window.confirm(confirmMsg);

    if (!confirmed) {
      return; // user clicked cancel
    }

    // Get token from localStorage
    const token = localStorage.getItem("token");

    // Send booking for each time slot
    try {
      let lastMessage = "";
      for (const slot of selectedSlots) {
        const res = await axios.post(
          `${BASE_URL}/api/bookings`,
          {
            tutor_id,
            module_code: selectedModule,
            date: selectedDate.format("YYYY-MM-DD"),
            start_time: slot,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Get the last response message
        lastMessage = res.data?.message;
      }

      alert(lastMessage || "Booking successful!");
      setSelectedSlots([]); // Clear slots
      setSelectedModule(""); // Clear module
      await fetchBookedSlots();
    } catch (err) {
      console.error("Booking error:", err);
      alert("Booking failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={4}
      p={1}
    >
      <Paper
        elevation={1}
        sx={{
          p: 0,
          borderRadius: 3,
          width: "100%",
          display: "flex",
          overflow: "hidden",
          border: "1px solid #ddd",
        }}
      >
        {/* LEFT: Calendar */}
        <Box sx={{ p: 3, backgroundColor: "#fff" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              minDate={dayjs()}
              value={selectedDate}
              onChange={(newDate) => {
                setSelectedDate(newDate);
                setSelectedSlots([]);
              }}
            />
          </LocalizationProvider>
        </Box>

        {/* RIGHT: Time slots panel */}
        <Box
          sx={{
            p: 3,
            flex: 1,
            backgroundColor: "#fafafa",
            borderLeft: "1px solid #eee",
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            {selectedSlots.length} Slot Selected
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ⓘ Each slot is a 1-hour block.
          </Typography>
          <Typography variant="body2" mb={2}>
            {selectedDate.format("MMM DD, YYYY")}
          </Typography>

          <Box
            sx={{
              maxHeight: 140, // control height of scrollable area
              overflowY: "auto", // scroll only this section
              pr: 1, // optional: prevent scroll bar from overlapping content
            }}
          >
            {timeSlots.length === 0 ? (
              <Typography color="text.secondary" fontStyle="italic">
                No time slots available for {selectedDay}.
              </Typography>
            ) : (
              <Grid container spacing={1} direction="row" width="100%">
                <Grid item width={"45%"}>
                  {timeSlots
                    .filter((_, i) => i % 2 === 0)
                    .map((slot) => (
                      <Box
                        key={slot}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mb: 1,
                        }}
                      >
                        <Button
                          fullWidth
                          onClick={() => toggleSlot(slot)}
                          sx={{
                            maxWidth: "100%",
                            borderRadius: 10,
                            textTransform: "none",
                            fontWeight: "bold",
                            color: selectedSlots.includes(slot)
                              ? "white"
                              : "black",
                            backgroundColor: selectedSlots.includes(slot)
                              ? "#1976d2"
                              : "#cfd8dc",
                          }}
                        >
                          {slot}
                        </Button>
                      </Box>
                    ))}
                </Grid>

                <Grid item width={"45%"}>
                  {timeSlots
                    .filter((_, i) => i % 2 === 1)
                    .map((slot) => (
                      <Box
                        key={slot}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mb: 1,
                        }}
                      >
                        <Button
                          fullWidth
                          onClick={() => toggleSlot(slot)}
                          sx={{
                            maxWidth: "100%",
                            borderRadius: 10,
                            textTransform: "none",
                            fontWeight: "bold",
                            color: selectedSlots.includes(slot)
                              ? "white"
                              : "black",
                            backgroundColor: selectedSlots.includes(slot)
                              ? "#1976d2"
                              : "#cfd8dc",
                          }}
                        >
                          {slot}
                        </Button>
                      </Box>
                    ))}
                </Grid>
              </Grid>
            )}
          </Box>
          <Divider sx={{ mt: 3, borderColor: "#b0bec5" }} />

          {/* Module Dropdown */}
          <Box mt={2}>
            <Typography variant="subtitle2" gutterBottom fontWeight={"bold"}>
              Select Module
            </Typography>
            <Select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              displayEmpty
              fullWidth
              sx={{ backgroundColor: "#fff", borderRadius: 1 }}
            >
              {moduleOptions.map((mod) => (
                <MenuItem key={mod} value={mod}>
                  {mod}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
      </Paper>

      {/* Price and Button */}
      <Box
        display="flex"
        justifyContent="center"
        gap={10}
        alignItems="center"
        width="100%"
        maxWidth={800}
      >
        <Typography variant="h6">
          Total price: <strong>${totalPrice}</strong>
        </Typography>
        <Button
          variant="contained"
          color="error"
          size="large"
          onClick={handleBooking}
          disabled={selectedSlots.length === 0 || !selectedModule}
          sx={{ borderRadius: 3, px: 4 }}
        >
          Book
        </Button>
      </Box>
    </Box>
  );
}
