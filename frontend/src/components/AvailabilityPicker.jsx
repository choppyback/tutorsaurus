import React from "react";
import { Box, Checkbox, Typography } from "@mui/material";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import dayjs from "dayjs";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const AvailabilityPicker = ({ availability, setAvailability }) => {
  const handleToggle = (day) => {
    setAvailability((prev) => {
      const current = prev[day] || {};
      const wasEnabled = !!current.enabled;

      const updated = {
        ...prev,
        [day]: {
          enabled: !wasEnabled,
          start: current.start ?? null,
          end: current.end ?? null,
        },
      };
      return updated;
    });
  };

  const updateField = (day, field, newVal) => {
    const prev = availability[day] || {};
    setAvailability((prevAvailability) => ({
      ...prevAvailability,
      [day]: {
        enabled: prev.enabled ?? true,
        start: field === "start" ? newVal : prev.start ?? null,
        end: field === "end" ? newVal : prev.end ?? null,
      },
    }));
  };

  const validateTimeRange = (day, fieldToClear) => {
    const { start, end } = availability[day] || {};
    if (start && end) {
      const startTime = dayjs(start);
      const endTime = dayjs(end);

      if (!startTime.isBefore(endTime)) {
        alert(`Invalid time for ${day}: start must be before end`);
        setAvailability((prev) => ({
          ...prev,
          [day]: {
            ...prev[day],
            [fieldToClear]: null,
          },
        }));
      }
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Weekly Availability
      </Typography>
      {days.map((day) => {
        const current = availability[day];
        console.log(day, ">", current);
        return (
          <Box
            key={day}
            sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
          >
            <Checkbox
              checked={!!current.enabled}
              onChange={() => handleToggle(day)}
            />
            <Typography sx={{ width: 40 }}>{day}</Typography>
            <TimeField
              label="Start"
              value={current.start ?? null}
              onChange={(newVal) => updateField(day, "start", newVal)}
              onBlur={() => validateTimeRange(day, "start")}
              format="HH:mm"
              disabled={!current.enabled}
              size="small"
            />
            <TimeField
              label="End"
              value={current.end ?? null}
              onChange={(newVal) => updateField(day, "end", newVal)}
              onBlur={() => validateTimeRange(day, "end")}
              format="HH:mm"
              disabled={!current.enabled}
              size="small"
            />
          </Box>
        );
      })}
    </Box>
  );
};

export const getFormattedAvailability = (availability) => {
  const formatted = {};
  for (const day of days) {
    const { enabled, start, end } = availability[day] || {};
    formatted[day] = {
      enabled: !!enabled,
      start: start ? dayjs(start).format("HH:mm") : null,
      end: end ? dayjs(end).format("HH:mm") : null,
    };
  }
  return formatted;
};

export default AvailabilityPicker;
