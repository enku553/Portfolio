require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const { initTable, insertMessage } = require("./db/config");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve the static frontend (index.html + assets)
app.use(express.static(path.join(__dirname, "..", "frontend")));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Contact form endpoint
app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, error: "All fields are required." });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, error: "Invalid email address." });
  }

  try {
    const id = await insertMessage({
      name: String(name).trim(),
      email: String(email).trim(),
      subject: String(subject).trim(),
      message: String(message).trim(),
    });
    res.status(201).json({ success: true, id });
  } catch (err) {
    console.error("Failed to save message:", err.message);
    res.status(500).json({ success: false, error: "Could not save message." });
  }
});

async function start() {
  try {
    await initTable();
  } catch (err) {
    console.error("Database connection failed:", err.message);
    console.error("Check your .env settings and make sure the database exists.");
  }

  const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `Port ${PORT} is already in use. The server is likely already running at http://localhost:${PORT}`
      );
      process.exit(1);
    } else {
      throw err;
    }
  });
}

start();

module.exports = app;
