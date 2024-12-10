const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock responses for the chatbot
const botResponses = {
  "hello": "Hello! How can I assist you today?",
  "spare parts": "Of course, click here to see [Spare Parts](https://example.com/spare-parts).",
  "technician": "Would you like me to schedule a technician for Monday?",
  "thank you": "You're welcome! Let me know if you need anything else.",
};

// Routes
app.get("/", (req, res) => {
  res.send("Chatbot backend is running!");
});

// WebSocket Connection
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle messages from the user
  socket.on("userMessage", (message) => {
    console.log("User:", message);

    // Respond with bot logic
    const lowerCaseMessage = message.toLowerCase();
    const botResponse =
      botResponses[lowerCaseMessage] || "I'm sorry, I didn't understand that. Can you please rephrase?";

    // Emit bot's response
    socket.emit("botMessage", botResponse);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
