const { Pool } = require("pg");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: isProduction
    ? process.env.DATABASE_URL // Render's PostgreSQL
    : "postgres://postgres:takethat@localhost:5432/acatempomain", // Local PostgreSQL
  ssl: isProduction
    ? { rejectUnauthorized: false } // Required for Render
    : false, // No SSL needed locally
});

module.exports = pool;
