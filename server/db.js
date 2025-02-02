const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
  user: "postgres",
  password: "takethat",
  host: "localhost",
  port: 5432, //postgres automatically runs on port 5432
  database: "acatempomain",
});

module.exports = pool;
