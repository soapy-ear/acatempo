const Pool = require("pg").Pool; //Import PostgreSQL Pool from pg package
require("dotenv").config(); // Load environment variables from .env file

/**
 * Creates a connection pool for PostgreSQL database.
 * 
 * The pool allows multiple queries to be handled efficiently without opening
 * a new connection for each request.
 */
const pool = new Pool({
  user: "avnadmin",
  password: "AVNS_kwhengY87fiLpIbcIvo",
  host: "pg-acatempo-sophieearish-677a.g.aivencloud.com",
  port: 14081,
  database: "defaultdb",
  ssl: { rejectUnauthorized: false }, // Allows SSL connection (Necessary for cloud-hosted PostgreSQL databases)
});

// Export the pool to be used in database queries
module.exports = pool;
