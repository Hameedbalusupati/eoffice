const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Render PostgreSQL
  },
});

// When new connection is created
pool.on("connect", () => {
  console.log("📦 PostgreSQL Connected");
});

// Handle unexpected errors
pool.on("error", (err) => {
  console.error("❌ Unexpected DB Error:", err);
});

// Function to test DB connection
const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ DB Connected Successfully");
    client.release();
  } catch (err) {
    console.error("❌ DB Connection Failed:", err.message);
    process.exit(1);
  }
};

module.exports = { pool, connectDB };