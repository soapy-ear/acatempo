//Had the help of https://www.youtube.com/watch?v=7UQBMb8ZpuE&t=5025s

const pool = require("../db"); //Import database connection
const router = require("express").Router(); //Import Express router
const bcrypt = require("bcrypt"); //Import bcrypt for password hashing
const jwtGenerator = require("../utils/jwtGenerator"); //Utility for generating JWT tokens
const validInfo = require("../middleware/validInfo"); //Middleware for input validation


/**
 * route   POST /auth/register
 * desc    Register a new user
 * access  Public
 */



router.post("/register", validInfo, async (req, res) => {
  try {
    // 1. Extract name, email, and password from request body
    const { name, email, password, user_specialisation } = req.body;

    // 2. Check if the user already exists in the database
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length !== 0) {
      return res.status(401).json({ error: "User already exists" }); //401 is unauthorised error
    }

    //3. Hash the user password using bcrypt https://www.npmjs.com/package/bcrypt
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // 4. Insert the new user into the database
    const newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, bcryptPassword]
    );

    //res.json(newUser.rows[0]); for testing

    const userId = newUser.rows[0].user_id;
      // insert into student or staff table based on role
    if (user_specialisation === "student") {
      await pool.query(
      "INSERT INTO students (user_id, student_number) VALUES ($1, $2)",
      [userId, `S${userId}`]
    );
  } else if (user_specialisation === "staff"){
    await pool.query(
      "INSERT INTO staff (user_id, department) VALUES ($1, $2)",
      [userId, "Computing"]
    );
  }


    // 5. Generate JWT token for the newly registered user
    const token = jwtGenerator(userId);

    // 6. Send the JWT token in the response
    return res.json({ token, user_specialisation });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
});

/**
 * route   POST /auth/login
 * desc    Authenticate user and return JWT token
 * access  Public
 */

router.post("/login", validInfo, async (req, res) => {
  try {
    // 1. Extract email and password from request body
    const { email, password } = req.body;

    // 2. Check if the user exists in the database
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);
    if (user.rows.length === 0) {
      return res.status(401).json("Password or email is incorrect");
    }

    const user_id = user.rows[0].user_id;

    // 3. Compare the provided password with the hashed password in the database
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );
    if (!validPassword) {
      return res.status(401).json("Password or email is incorrect");
    }

    // Determine if the user is a student or staff
    const studentCheck = await pool.query(
      "SELECT * FROM students WHERE user_id = $1",
      [user_id]
    );
    const staffCheck = await pool.query(
      "SELECT * FROM staff WHERE user_id = $1",
      [user_id]
    );
    let user_specialisation = "";
    if (studentCheck.rows.length > 0) {
      user_specialisation = "student";
    } else if (staffCheck.rows.length > 0) {
      user_specialisation= "staff";
    }

    // 4. Generate JWT token for the authenticated user
    const token = jwtGenerator(user_id);
    console.log("Generated Token:", token);

    // 5. Send the JWT token in the response
    return res.json({ token, user_specialisation });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


/**
 * route   GET /auth/is-verify
 * desc    Verify if the user's token is valid
 * access  Private (requires JWT)
 */
router.get("/is-verify", async (req, res) => {
  try {
    // If the user has a valid token, return true
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Export the router for use in the server
module.exports = router;
