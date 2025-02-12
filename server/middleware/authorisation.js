const jwt = require("jsonwebtoken"); //Import JSON Web Token library
require("dotenv").config(); //Load environment variables

//Had the help of https://www.youtube.com/watch?v=7UQBMb8ZpuE&t=5025s

//Middleware function to verify and authenticate JWT tokens
//Ensures that protected routes can only be accessed by authenticated users.

module.exports = async (req, res, next) => {
  try {
    // Retrieve JWT token from the request header
    const jwtToken = req.header("token");

    // If no token is provided, return a 403 (Forbidden) response
    if (!jwtToken) {
      return res.status(403).json("Not authorised - No token provided");
    }

    // Verify the JWT token using the secret key stored in environment variables
    const payload = jwt.verify(jwtToken, process.env.jwtSecret);

    // Attach the decoded user information to the request object
    req.user = payload.user;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);

    // If token verification fails, return a 403 (Forbidden) response
    return res.status(403).json("Not authorised - Invalid token");
  }
};
