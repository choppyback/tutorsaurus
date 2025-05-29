const express = require("express");
const app = express();
const cors = require("cors");

//middleware

app.use(cors());
app.use(express.json());

//routes

app.use("/dashboard", require("./routes/dashboard"));

app.use("/auth", require("./routes/auth"));

app.listen(2000, () => {
  console.log(`Server is listening on port 2000`);
});
