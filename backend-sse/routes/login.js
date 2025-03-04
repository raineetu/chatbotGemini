const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

//middleware to verify token from Authorization header
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token Missing" });
  }
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token!" });
    }

    req.user = user; // Saves user info for next handlers
    next(); // Pass control to next handler
  });
};

// Login route
router.post("/login", (req, res) => {
  //client post input to a serevr with JSON body
  const { username, password } = req.body;

  //checks the client input here
  if (username === "admin" && password === "123") {
    //if correct then generate the token
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful!", token });
  } else {
    res.status(401).json({ message: "Invalid credentials!" });
  }
});

// Example of a protected route
router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: `Welcome ${req.user.username}!`,
    username: req.user.username,
  });
});

module.exports = router;
