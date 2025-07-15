import React from "react";
import NavBar from "../../../shared/components/NavBar";

export default function TutorBookingView() {
  const bookings = [
    {
      booking_id: 1,
      student_name: "Jane Doe",
      module_name: "CS1010",
      date: "2025-07-18",
      start_time: "10:00",
      end_time: "11:00",
      status: "confirmed",
    },
    {
      booking_id: 2,
      student_name: "Daniel Tan",
      module_name: "CS2100",
      date: "2025-07-20",
      start_time: "14:00",
      end_time: "15:30",
      status: "pending",
    },
  ];

  const navItems = [
    { label: "Home", to: "/home" },
    { label: "Profile", to: "/editprofile" },
  ];

  return (
    <>
      <NavBar navItems={navItems} heading="My Bookings" />
      <div style={{ padding: "1rem" }}>
        <h2>Bookings You've Received</h2>
        {bookings.map((booking) => (
          <div
            key={booking.booking_id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h3>{booking.module_name}</h3>
            <p>
              <strong>Student:</strong> {booking.student_name}
            </p>
            <p>
              <strong>Date:</strong> {booking.date}
            </p>
            <p>
              <strong>Time:</strong> {booking.start_time} – {booking.end_time}
            </p>
            <p>
              <strong>Status:</strong> {booking.status}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
