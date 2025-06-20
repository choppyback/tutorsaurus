const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 2000;
const path = require("path");

//middleware

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//routes

app.use("/dashboard", require("./routes/dashboard"));

app.use("/auth", require("./routes/auth"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
