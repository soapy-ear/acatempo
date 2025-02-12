//Had the help of https://www.youtube.com/watch?v=7UQBMb8ZpuE&t=5025s

//Middleware to validate user input for registration and login routes.
//Ensures required fields are provided and the email format is valid.

module.exports = (req, res, next) => {
  // Extract email, name, and password from the request body
  const { email, name, password } = req.body;

  //function to validate email format
  function validEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  // Validation for the registration route
  if (req.path === "/register") {
    // Check if all required fields are provided
    if (![email, name, password].every(Boolean)) {
      return res.status(401).json("Missing Credentials");

      // Validate email format
    } else if (!validEmail(email)) {
      return res.status(401).json("Invalid Email");
    }
    // Validation for the login route
  } else if (req.path === "/login") {
    // Check if both email and password are provided
    if (![email, password].every(Boolean)) {
      return res.status(401).json("Missing Credentials");
      // Validate email format
    } else if (!validEmail(email)) {
      return res.status(401).json("Invalid Email");
    }
  }
  // If all validations pass, continue to the next middleware or route handler
  next();
};
