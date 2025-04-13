const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Make sure this exists in your .env
});

pool.on("connect", async() => {
  console.log("✅ PostgreSQL Connected (Booking Service)");

  try {
    // Create the 'bookings' table if it doesn't already exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        event_id INT NOT NULL,
        tickets INT NOT NULL,
        total_price INT NOT NULL,
        status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pool.query(createTableQuery);
    console.log("✅ Bookings table created or already exists.");
  } catch (err) {
    console.error("❌ Error creating bookings table:", err.message);
  }
});

module.exports = pool;
