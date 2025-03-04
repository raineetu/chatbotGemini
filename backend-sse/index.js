const express = require("express");
const cors = require("cors");
const axios = require("axios"); // For making HTTP requests
const app = express();
const port = 3000;
const weatherRoute = require("./routes/weather.js");
const loginRoute = require("./routes/login.js");

require("dotenv").config();
// enables json body parsing
app.use(express.json());

const API_KEY = process.env.WEATHER_API_KEY;

// Enable CORS for React frontend
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.get("/", weatherRoute);
app.use("/api", loginRoute);
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
