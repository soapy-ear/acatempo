const jwt = require("jsonwebtoken"); // Import JSON Web Token library
require("dotenv").config(); // Load environment variables from .env file


//Generates JWT token for a given user ID
function jwtGenerator(user_id) {
  // Define the payload (data stored inside the token)
  const payload = {
    // Stores the user ID inside the token
    user: user_id,
  };

  // Generate and return the JWT token
  return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "2hr" });
}

// Export function for use in authentication routes
module.exports = jwtGenerator;
