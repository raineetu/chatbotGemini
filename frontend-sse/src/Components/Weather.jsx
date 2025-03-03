import React, { useState, useEffect } from "react";
import axios from "axios";

function Weather() {
  const [weatherData, setWeatherData] = useState({
    city: "Loading...",
    temperature: "Loading...",
    description: "Loading...",
    humidity: "Loading...",
    windSpeed: "Loading...",
  });
  const [city, setCity] = useState("");
  const [isConnected, setIsConnected] = useState(false); // Track connection status

  const handleChange = (e) => {
    e.preventDefault();
    setCity(e.target.value);
  };

  const handleSearch = () => {
    if (isConnected) {
      setIsConnected(false); // Disconnect previous stream if connected
    }
    connectToSSE(); // Reconnect with the new city
  };

  const connectToSSE = () => {
    const eventsrc = new EventSource(`http://localhost:3000/?city=${city}`);

    eventsrc.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);

      if (!data.error) {
        setWeatherData(data);
      } else {
        alert("City not found");
      }
    };

    eventsrc.onerror = () => {
      eventsrc.close();
      setIsConnected(false);
    };
    setIsConnected(true);

    // Clean up when component unmounts or city changes
    return () => {
      eventsrc.close();
      setIsConnected(false);
    };
  };

  useEffect(() => {
    connectToSSE();
  }, []); // Connect to SSE on mount

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-indigo-600">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-150 h-150">
        <div className="mb-6 flex relative cursor-pointer">
          <input
            type="text"
            placeholder="Enter City Name"
            value={city}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition mb-5"
          />
          <button
            onClick={handleSearch}
            className="absolute left-4/5 px-4 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition w-28"
          >
            Search
          </button>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          🌤 {weatherData.city}
        </h2>
        <p className="text-6xl font-bold text-indigo-600 mb-8">
          {weatherData.temperature}°C
        </p>
        <p className="text-lg text-gray-600 mb-4 capitalize">
          {weatherData.description}
        </p>
        <div className="text-gray-600 my-16">
          <div className="text-xl my-8">
            🌧️ Humidity:{" "}
            <span className="font-bold">{weatherData.humidity}%</span>
          </div>
          <div className="text-xl my-8">
            💨 Wind:{" "}
            <span className="font-bold">{weatherData.windSpeed} m/s</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Weather;
