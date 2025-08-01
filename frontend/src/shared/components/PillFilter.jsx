import { Box, Typography } from "@mui/material";

export default function PillFilter({ options, active, onChange }) {
  return (
    <Box
      display="flex"
      bgcolor="#e5e7eb"
      borderRadius="999px"
      p="4px"
      width="fit-content"
      mb="30px"
    >
      {options.map(({ label, value }) => {
        const isActive = active === value;

        return (
          <Box
            key={value}
            onClick={() => onChange(value)}
            sx={{
              px: 3,
              py: 1,
              borderRadius: "999px",
              cursor: "pointer",
              backgroundColor: isActive ? "#ffffff" : "transparent",
              transition: "all 0.2s ease-in-out",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: isActive ? "#8db85eff" : "#6b7280",
                fontWeight: isActive ? 600 : 500,
              }}
            >
              {label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
