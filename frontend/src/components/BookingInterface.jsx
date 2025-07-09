// BookingInterface.jsx

import React, { useState } from "react";
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

const mockTimeSlots = [];

for (let hour = 7; hour <= 22; hour++) {
  const formatted = dayjs().hour(hour).minute(0).format("HH:mm");
  mockTimeSlots.push(formatted);
}

export default function BookingInterface() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");

  const toggleSlot = (slot) => {
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const totalPrice = (selectedSlots.length * 38.75).toFixed(2);

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
          <Typography variant="subtitle1" mb={1} fontWeight="bold">
            {selectedSlots.length} Slot Selected
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
            <Grid container spacing={1} direction="row" width="100%">
              <Grid item width={"45%"}>
                {mockTimeSlots
                  .filter((_, i) => i % 2 === 0)
                  .map((slot) => (
                    <Box
                      key={slot}
                      sx={{ display: "flex", justifyContent: "center", mb: 1 }}
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
                {mockTimeSlots
                  .filter((_, i) => i % 2 === 1)
                  .map((slot) => (
                    <Box
                      key={slot}
                      sx={{ display: "flex", justifyContent: "center", mb: 1 }}
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
              <MenuItem value="CS2030">CS2030</MenuItem>
              <MenuItem value="CS2100">CS2100</MenuItem>
              <MenuItem value="MA1511">MA1511</MenuItem>
              <MenuItem value="IS1103">IS1103</MenuItem>
            </Select>
          </Box>
        </Box>
      </Paper>

      {/* Price and Button */}
      <Box
        display="flex"
        justifyContent="space-between"
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
          sx={{ borderRadius: 3, px: 4 }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
