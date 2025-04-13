const amqp = require("amqplib");
const express = require("express");
const axios = require("axios");
const router = express.Router();
const pool = require("../config/db");

const EVENT_SERVICE_URL = "http://event-service:5002";
const USER_SERVICE_URL = "http://user-service:5001";
//const EVENT_SERVICE_URL = "http://localhost:5002"; // Adjust as needed
const RABBITMQ_URL = process.env.RABBITMQ_URL;
const QUEUE_NAME = "booking_notifications";

// 🔹 Function to Publish to RabbitMQ
async function publishToQueue(message) {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();

        await channel.assertQueue(QUEUE_NAME, { durable: true });
        channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), {
            persistent: true,
        });

        console.log("📩 Sent message to queue:", message);

        await channel.close();
        await connection.close();
    } catch (error) {
        console.error("❌ RabbitMQ Publish Error:", error);
    }
}

// 🔹 Book an Event (with Availability Check)
router.post("/", async (req, res) => {
    const { user_id, event_id, tickets} = req.body;

    try {
        // ✅ Step 1: Check Event Availability
        const response = await axios.get(`${EVENT_SERVICE_URL}/events/${event_id}/availability`);
        const availableTickets = response.data.available_tickets;

        if (availableTickets < tickets) {
            return res.status(400).json({ error: "Not enough tickets available" });
        }

        const userEmailResponse = await axios.get(`${USER_SERVICE_URL}/users/email`, {
            params: { user_id: user_id }
        });

        if (userEmailResponse.status !== 200) {
            return res.status(404).json({ error: "User not found" });
        }

        const user_email = userEmailResponse.data.user_email;

        // ✅ Step 2: Proceed with Booking
        const total_price = tickets * 20;
        const query = `INSERT INTO bookings (user_id, event_id, tickets, total_price, status) VALUES ($1, $2, $3, $4, 'CONFIRMED') RETURNING *`;
        const values = [user_id, event_id, tickets, total_price];

        const result = await pool.query(query, values);
        const booking = result.rows[0];

        // ✅ Step 3: Send Booking Confirmation Notification (Async via RabbitMQ)
        const message = {
            booking_id: booking.id,
            user_email: user_email,
            status: "CONFIRMED",
        };
        await publishToQueue(message);

        res.json(booking);
    } catch (error) {
        console.error("❌ Booking Error:", error);
        res.status(500).json({ error: "Failed to create booking" });
    }
});


router.get("/:user_id", async (req, res) => {
    const { user_id } = req.params;

    try {
        // ✅ Step 1: Fetch Bookings from PostgreSQL
        const result = await pool.query("SELECT * FROM bookings WHERE user_id = $1", [user_id]);
        const bookings = result.rows;

        // ✅ Step 2: Fetch Event Details from Event Service
        const eventRequests = bookings.map(async (booking) => {
            try {
                const response = await axios.get(`http://event-service:5002/events/${booking.event_id}`);
                console.log(response);
                return { ...booking, event_name: response.data.name };
            } catch (error) {
                console.error(`Failed to fetch event ${booking.event_id}:`, error);
                return { ...booking, event_name: "Unknown Event" };
            }
        });

        const bookingsWithEvents = await Promise.all(eventRequests);

        res.json(bookingsWithEvents);
    } catch (error) {
        console.error("Fetch Bookings Error:", error);
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
});



module.exports = router;
