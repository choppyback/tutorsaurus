const express = require("express");
const app = express();
const cors = require("cors");

//middleware

app.use(cors());
app.use(express.json());

//routes

app.listen(2000, () => {
  console.log(`Server is listening on port 2000`);
});