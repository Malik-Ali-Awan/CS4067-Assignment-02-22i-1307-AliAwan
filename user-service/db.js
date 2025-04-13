require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(async () => {
    console.log("Connected to PostgreSQL");

    try {
      // Create the 'users' table if it doesn't already exist
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) NOT NULL UNIQUE,
          password VARCHAR(100) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

      await pool.query(createTableQuery);
      console.log("✅ Users table created or already exists.");
    } catch (err) {
      console.error("❌ Error creating users table:", err.message);
    }
  })
  .catch(err => console.error("Database connection error", err));


module.exports = pool;
