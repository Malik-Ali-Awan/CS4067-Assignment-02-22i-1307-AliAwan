const mongoose = require("mongoose");
require("dotenv").config();
const Event = require("../models/Event"); // Import the Event model


const connectDB = async () => {
    try {
      // Connect to MongoDB
      await mongoose.connect(process.env.MONGO_URI);
  
      console.log("✅ MongoDB Connected (Event Service)");
  
      // Sample event data
      const sampleEvents = [
        {
          event_id: 1,
          name: "Music Concert",
          description: "A live music concert featuring top artists.",
          date: new Date("2025-06-15"),
          location: "New York City, USA",
          total_tickets: 500,
          available_tickets: 500,
          price: 50
        },
        {
          event_id: 2,
          name: "Tech Conference",
          description: "A conference for tech enthusiasts to explore new technologies.",
          date: new Date("2025-08-20"),
          location: "San Francisco, USA",
          total_tickets: 300,
          available_tickets: 300,
          price: 150
        },
        {
          event_id: 3,
          name: "Art Exhibition",
          description: "An exhibition showcasing modern art.",
          date: new Date("2025-09-10"),
          location: "Los Angeles, USA",
          total_tickets: 200,
          available_tickets: 200,
          price: 30
        },
        {
          event_id: 4,
          name: "Food Festival",
          description: "A celebration of food from around the world.",
          date: new Date("2025-11-05"),
          location: "Chicago, USA",
          total_tickets: 1000,
          available_tickets: 1000,
          price: 25
        },
      ];
  
      // Insert sample events into the database if they don't already exist
      const eventsExist = await Event.countDocuments();
  
      if (eventsExist === 0) {
        try {
          await Event.create(sampleEvents);
          console.log("✅ Sample events inserted into the database.");
        } catch (err) {
          console.error("❌ Error inserting events:", err);
        }
      } else {
        console.log("ℹ️ Events already exist in the database.");
      }
    } catch (error) {
      console.error("❌ MongoDB Connection Failed", error);
      process.exit(1);
    }
  };
  
  module.exports = connectDB;