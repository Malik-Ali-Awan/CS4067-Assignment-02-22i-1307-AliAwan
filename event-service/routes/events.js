const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// 🔹 Get all events
router.get("/", async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        console.error("❌ Error fetching events:", error);
        res.status(500).json({ error: "Failed to fetch events" });
    }
});

// 🔹 Get Event Availability (For Booking Service)
router.get("/:event_id/availability", async (req, res) => {
    let event_id = req.params.event_id;

    // Convert event_id to a Number (if stored as Number in MongoDB)
    if (!isNaN(event_id)) {
        event_id = Number(event_id);
    }

    try {
        const event = await Event.findOne({ event_id });

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        res.json({ available_tickets: event.available_tickets });
    } catch (error) {
        console.error("❌ Error fetching event availability:", error);
        res.status(500).json({ error: "Failed to fetch event availability" });
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findOne({event_id: id}); // Fetch event from MongoDB
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        res.json(event);
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
