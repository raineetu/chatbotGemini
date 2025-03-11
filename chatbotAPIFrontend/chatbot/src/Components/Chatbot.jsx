import React, { useState, useEffect, useRef } from "react";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import axios from "axios";

function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "How can I help you?" },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle user input and API call
  const handleSend = async () => {
    if (input.trim() === "") return;

    // Add user message
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput(""); // Clear input field
    setLoading(true); // Show loading state

    try {
      // API call
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/chat`,
        {
          userMessage: input,
        }
      );
      const botMessage = { sender: "bot", text: response.data.message };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        sender: "bot",
        text: error.response?.data?.message || "Sorry, something went wrong!",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="border border-white rounded-2xl bg-white shadow-lg p-6 w-[40%] h-[60%]">
        <h2 className="text-3xl text-black mb-4 text-center font-bold">
          ChatBot
        </h2>
        <div className="flex items-center justify-center mb-4">
          <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-500 mr-2" />
          <span className="text-xl text-black">Chat with me!</span>
        </div>

        {/* Chat Messages */}
        <div className="overflow-y-scroll max-h-[calc(100%-140px)] space-y-5 mt-5 scrollbar-hide h-56">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`${
                  msg.sender === "user"
                    ? "bg-[#6D4FC2] text-white"
                    : "bg-[#F6F2FF] text-black"
                } rounded-xl p-3 px-2 w-fit max-w-[60%] mb-2`}
              >
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* Scroll to bottom */}
        </div>

        {/* Input Area */}
        <div className="flex justify-center relative mt-4">
          <input
            type="text"
            placeholder="Enter your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="bg-gray-200 p-2 rounded-xl w-full"
          />
          <button
            onClick={handleSend}
            className="absolute right-1 bg-blue-500 w-[100px] text-white px-4 py-2 rounded-2xl hover:bg-blue-600 transition duration-300"
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
