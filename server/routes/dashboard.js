//Had the help of https://www.youtube.com/watch?v=7UQBMb8ZpuE&t=5025s

const router = require("express").Router(); // Import Express Router
const pool = require("../db"); // Import database connection pool
const authorisation = require("../middleware/authorisation"); // Import JWT authorisation middleware

/**
 * route GET /dashboard
 * desc    Retrieve the authenticated user's name
 * access  Private (requires JWT authentication)
 */

router.get("/", authorisation, async (req, res) => {
  try {
    // Log the user ID extracted from the JWT token (set in authorisation middleware)
    console.log("User ID from token:", req.user);

    // Query the database to fetch the user's name using their user ID
    const user = await pool.query(
      "SELECT user_name FROM users WHERE user_id = $1",

      // The user ID is extracted from the JWT token
      [req.user]
    );

    // Check if the user exists in the database
    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send the user's name in the response for use in the frontend
    res.json({ user_name: user.rows[0].user_name });
  } catch (err) {
    console.error("Error in dashboard route:", err.message); //for testing, comment out if needed

    // Return a 500 error response in case of a server-side issue
    res.status(500).json("Server Error");
  }
});

// Export the router to be used in the main server file
module.exports = router;
