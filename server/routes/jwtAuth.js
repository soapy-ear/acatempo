const pool = require("../db");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorisation = require("../middleware/authorisation");

//registering

router.post("/register", validInfo, async (req, res) => {
  try {
    //1. destructe the req.body (name, email, password)

    const { name, email, password } = req.body;

    //2. check if user exists (if exists, throw error)

    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length !== 0) {
      return res.status(401).json({ error: "User already exists" }); //401 is unauthenticated error
    }

    //3. bcrypt the user password https://www.npmjs.com/package/bcrypt

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    //4. enter the new user isnide database

    const newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, bcryptPassword]
    );

    //res.json(newUser.rows[0]);

    //5. generate jwt token
    const token = jwtGenerator(newUser.rows[0].user_id);
    return res.json({ token });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
});

//login route

router.post("/login", validInfo, async (req, res) => {
  try {
    //1. destructure req.body
    const { email, password } = req.body;
    //2. check if user doesn't exist (if not throw error)
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);
    if (user.rows.length === 0) {
      return res.status(401).json("Password or email is incorrect");
    }
    //3. check if incoming password is same as db password
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );
    if (!validPassword) {
      return res.status(401).json("Password or email is incorrect");
    }

    //4. give them jwt token
    const token = jwtGenerator(user.rows[0].user_id);
    console.log("Generated Token:", token);
    return res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/is-verify", authorisation, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
