const express = require("express");
const axios = require("axios");
const router = express.Router();

require("dotenv").config();

const API_KEY = process.env.WEATHER_API_KEY;

router.get("/", (req, res) => {
  const city = req.query.city || "Kathmandu";

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      const data = response.data;

      const weatherData = {
        city: data.name,
        temperature: data.main.temp.toFixed(1),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed.toFixed(2),
      };

      res.write(`data: ${JSON.stringify(weatherData)}\n\n`);
    } catch (error) {
      console.error("Error fetching weather data:", error.message);
      res.write(`data: ${JSON.stringify({ error: "City not found" })}\n\n`);
    }
  };

  fetchWeatherData(); // Fetch immediately on connect
  const intervalId = setInterval(fetchWeatherData, 8000);

  req.on("close", () => {
    clearInterval(intervalId);
    res.end();
  });
});

module.exports = router;
