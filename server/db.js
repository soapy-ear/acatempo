const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
  user: "avnadmin",
  password: "AVNS_kwhengY87fiLpIbcIvo",
  host: "pg-acatempo-sophieearish-677a.g.aivencloud.com",
  port: 14081,
  database: "defaultdb",
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;
