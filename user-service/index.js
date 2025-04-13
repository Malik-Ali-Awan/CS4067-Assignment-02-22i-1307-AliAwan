const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios"); // For making REST API calls
const userRoutes = require("./routes/userRoutes"); // Import routes.js
const pool = require("./db");


require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

app.use("/users", userRoutes); // Prefix all user routes with /users


app.post("/signup", async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const result = await pool.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
        [name, email, password]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await pool.query("SELECT id, password FROM users WHERE email = $1", [email]);

        if (user.rows.length === 0) {
            return res.status(401).json({ error: "User not found" });
        }

        if (password !== user.rows[0].password) {
            return res.status(401).json({ error: "Invalid password" });
        }

        // Send back user_id in the response
        res.json({ user_id: user.rows[0].id });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error" });
    }
});


// Get all events from Event Service
app.get("/events", async (req, res) => {
    try {
        const eventServiceUrl = process.env.EVENT_SERVICE_URL || "http://localhost:5002";
        const response = await axios.get(`${eventServiceUrl}/events`);
    } catch (error) {
        console.error("Error fetching events:", error.message);
        res.status(500).json({ error: "Failed to fetch events" });
    }
});

// Book an event via Booking Service
app.post("/book", async (req, res) => {
    try {
        const { user_id, event_id, tickets } = req.body;
        const response = await axios.post("http://booking-service:5003/bookings", {
            user_id,
            event_id,
            tickets,
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error booking event:", error.message);
        res.status(500).json({ error: "Failed to book event" });
    }
});

app.get('/health', (req, res) => {
    res.status(200).send('OK');  // Simple health check response
  });

app.listen(PORT, () => console.log(`🚀 User Service running on http://localhost:${PORT}`));
