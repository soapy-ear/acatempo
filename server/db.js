const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
  user: "acatempo_user",
  password: "rZAwdTEaDLorKnNBCljObsR88yzy4nTc",
  host: "dpg-cugrq4rtq21c73f32uj0-a",
  port: 5432, //postgres automatically runs on port 5432
  database: "acatempo",
});

module.exports = pool;
