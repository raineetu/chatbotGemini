import React, { useState } from "react";

function Login({ setIsLoggedIn, setMainProfile }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Login successful!") {
          localStorage.setItem("tokenWeather", data.token);
          console.log("Token saved:", data.token);
          fetchProfile(); // Fetch profile after saving token
        } else {
          alert("Username or password incorrect!");
        }
      })
      .catch((error) => console.log("Login error:", error));
  };

  const fetchProfile = () => {
    fetch("http://localhost:3000/api/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tokenWeather")}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Profile API response:", data);

        // Check if username exists directly or within a nested object
        const username = data?.username || data?.profile?.username;
        console.log(username);

        if (username) {
          setMainProfile(username);
          setIsLoggedIn(true);
        } else {
          alert("Failed to fetch the profile name");
        }
      })
      .catch((error) => console.log("Profile fetch error:", error));
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-2xl mb-4">Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mb-2 p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-2 p-2 border rounded"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Login
      </button>
    </div>
  );
}

export default Login;
