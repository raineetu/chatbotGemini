const express = require("express");
const axios = require("axios");
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());

app.use(express.json());

// API endpoint for chatbot
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.userMessage;

  if (!userMessage) {
    return res.status(400).json({ message: "No message provided." });
  }

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        contents: [
          {
            parts: [{ text: userMessage }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Extract the response from Gemini's API and send it to the client
    const botMessage =
      response.data.candidates[0]?.content?.parts[0]?.text ||
      "Sorry, I didn't get that.";
    return res.json({ message: botMessage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.response?.data?.message || "Something went wrong!",
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
