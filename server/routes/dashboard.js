const router = require("express").Router();
const pool = require("../db");
const authorisation = require("../middleware/authorisation");

router.get("/", authorisation, async (req, res) => {
  try {
    // Log user ID from authorisation middleware
    console.log("User ID from token:", req.user);

    // Query the database to get the user's name
    const user = await pool.query(
      "SELECT user_name FROM users WHERE user_id = $1",
      [req.user]
    );

    // Check if the user exists
    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send the user's name in the response to customise site
    res.json({ user_name: user.rows[0].user_name });
  } catch (err) {
    console.error("Error in dashboard route:", err.message);
    res.status(500).json("Server Error");
  }
});

module.exports = router;
