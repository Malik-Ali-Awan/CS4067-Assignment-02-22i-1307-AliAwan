const mongoose = require("mongoose");

// Counter Schema for auto-incrementing event_id
const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    sequence_value: { type: Number, required: true }
});

const Counter = mongoose.model("Counter", counterSchema);

// Event Schema
const eventSchema = new mongoose.Schema({
    event_id: { type: Number, unique: true },  // Custom Incrementing ID
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    total_tickets: { type: Number, required: true },
    available_tickets: { type: Number, required: true, default: 100 },
    price: { type: Number, required: true }
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
