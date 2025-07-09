/*
[
  {
    day: "Tue",
    start_time: "12:00",
    end_time: "13:00"
  },
  {
    day: "Wed",
    start_time: "18:00",
    end_time: "19:00"
  },
  // ...
]
*/

import React, { useEffect, useState } from "react";
import ScheduleSelector from "react-schedule-selector";
import dayjs from "dayjs";

const AvailabilityPicker = ({ availability, setAvailability }) => {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    if (!Array.isArray(availability) || availability.length === 0) return; // skip below if availability is empty

    const base = dayjs("2025-06-30"); // Treat as Monday
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const converted = availability.map(({ day, start_time }) => {
      const [h, m] = start_time.split(":").map(Number);
      return base
        .day(days.indexOf(day))
        .hour(h)
        .minute(m)
        .second(0)
        .millisecond(0)
        .toDate();
    });

    setSchedule(converted);
  }, []);

  const handleChange = (newSlot) => {
    setSchedule(newSlot);

    const formatted = newSlot.map((date) => {
      const start = dayjs(date);
      const end = start.add(1, "hour");
      return {
        day: start.format("ddd"), // e.g. "Mon"
        start_time: start.format("HH:mm:ss"), // e.g. "09:00"
        end_time: end.format("HH:mm:ss"), // e.g. "10:00"
      };
    });

    // Handle duplicates
    const seen = new Set();
    const deduped = formatted.filter((slot) => {
      const key = `${slot.day}-${slot.start_time}-${slot.end_time}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    setAvailability(deduped);
    console.log("Selected slots (unformatted, with duplicates):", schedule);
  };

  return (
    <div style={{ WebkitUserSelect: "none" }}>
      <h3>Select Your Weekly Availability</h3>
      <p style={{ fontSize: "0.9rem", color: "#555", marginBottom: "1rem" }}>
        You can <strong>click or drag</strong> to select multiple time slots.
        Each selected time represents the <strong>start time</strong> of a 1hr
        session.
      </p>
      <ScheduleSelector
        selection={schedule}
        numDays={7}
        minTime={7} // 8:00 AM
        maxTime={23} // 11:00 PM
        dateFormat="ddd"
        startDate={new Date("2025-06-30")} // a Monday
        onChange={handleChange}
      />
    </div>
  );
};

export default AvailabilityPicker;
