const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 2000;

//middleware

app.use(cors());
app.use(express.json());

//routes

app.use("/dashboard", require("./routes/dashboard"));

app.use("/auth", require("./routes/auth"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
