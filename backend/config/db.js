const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction
    ? { rejectUnauthorized: false } // Render
    : false, // Local PostgreSQL
});

// Logs
pool.on("connect", () => {
  console.log("📦 PostgreSQL Connected");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected DB Error:", err);
});

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