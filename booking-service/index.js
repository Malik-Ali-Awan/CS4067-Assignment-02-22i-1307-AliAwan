const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();
const pool = require("./config/db"); // ✅ PostgreSQL pool
const bookingRoutes = require("./routes/bookings"); // ✅ Import booking routes

const app = express();
const PORT = process.env.PORT || 5003;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); // Ensure JSON body parsing


// Test Database Connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ PostgreSQL Connection Failed:", err);
  } else {
    console.log("✅ PostgreSQL Connected at:", res.rows[0].now);
  }
});

// Root Route for Testing
app.get("/", (req, res) => {
  res.send("Booking Service is running 🚀");
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');  // Simple health check response
});

// Booking Routes
app.use("/bookings", bookingRoutes);

// Start Server
app.listen(PORT, () => console.log(`🚀 Booking Service running on http://booking-service:${PORT}`));
