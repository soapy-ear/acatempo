const express = require("express"); //Import Express framework
const app = express(); //initialise express application
const cors = require("cors"); //Import CORS middleware for handling cross-origin requests
const pool = require("./db"); //Import database connection
const authorisation = require("./middleware/authorisation");
//Had the help of https://www.youtube.com/watch?v=5vF0FGfa0RQ throughout for CRUD operations

//middleware
app.use(cors()); // Enables backend to accept requests from frontend (Cross-Origin Resource Sharing)
app.use(express.json()); // Allows Express to parse incoming JSON data (for req.body)

//ROUTES

// Authentication routes (register & login)
app.use("/auth", require("./routes/jwtAuth"));

//dashboard route
app.use("/dashboard", require("./routes/dashboard"));

//THE FOLLOWING ROUTES NEED MOVING INTO NEW FILE crudModules.js
/**
 * route   GET /modules
 * desc    Retrieve all modules (Used in module info page or module selection page)
 * access  Public
 */

app.get("/modules", async (req, res) => {
  try {
    const allModules = await pool.query("SELECT * FROM module"); // Fetch all module data from database
    res.json(allModules.rows); // Send retrieved module data as JSON response
  } catch (err) {
    console.error(err.message);
  }
});

/**
 * route   GET /modules/:id
 * desc    Retrieve a specific module by ID
 * access  Public
 */
app.get("/modules/:id", async (req, res) => {
  try {
    const { id } = req.params; // Extract module ID from request parameters
    const module = await pool.query("SELECT * FROM module WHERE mod_id = $1", [
      id,
    ]); // Fetch module data where ID matches
    res.json(module.rows[0]); // Return specific module data
  } catch (err) {
    console.error(err.message);
  }
});

/**
 * route   POST /modules
 * desc    Create a new module (Admin only)
 * access  Private (Admin)
 */

app.post("/modules", async (req, res) => {
  try {
    const { mod_name, mod_cod, semester, description } = req.body;

    // Check if all required fields are provided
    if (!mod_name || !mod_cod || !semester || !description) {
      return res
        .status(400)
        .json({ message: "All fields, including description, are required." });
    }
    // Insert new module into database
    const newModule = await pool.query(
      "INSERT INTO module (mod_name, mod_cod, semester, description) VALUES ($1, $2, $3, $4) RETURNING *",
      [mod_name, mod_cod, semester, description]
    );
    // Return the newly created module
    res.json(newModule.rows[0]);
  } catch (err) {
    console.error("Error adding module:", err.message);
    res.status(500).send("Server Error");
  }
});

/**
 * route   PUT /modules/:id
 * desc    Update an existing module (Admin only)
 * access  Private (Admin)
 */

app.put("/modules/:id", async (req, res) => {
  try {
    const { id } = req.params; // Extract module ID from request parameters
    const { mod_cod, mod_name } = req.body; // Extract module details from request body

    // Update module details in the database
    const updateModule = await pool.query(
      "UPDATE module SET mod_cod = $1, mod_name = $2 WHERE mod_id = $3",
      [mod_cod, mod_name, id]
    );

    res.json("Module was updated");
  } catch (err) {
    console.error(err.message);
  }
});

/**
 * route   DELETE /modules/:id
 * desc    Delete a module (Admin only)
 * access  Private (Admin)
 */

app.delete("/modules/:id", async (req, res) => {
  try {
    const { id } = req.params; // Extract module ID from request parameters

    // Delete module from database
    const deleteModule = await pool.query(
      "DELETE FROM module WHERE mod_id = $1",
      [id]
    );
    res.json("Module was deleted");
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/register-module", authorisation, async (req, res) => {
  try {
    const { mod_id } = req.body;
    const user_id = req.user; // Extract user ID from JWT
    console.log("🔹 Registering module:", { user_id, mod_id });

    // ✅ Step 1: Get all groups for this module, ordered by name
    const groupQuery = await pool.query(
      `SELECT g.group_id, g.group_name, 
              COUNT(um.user_id) AS student_count
       FROM group_table g
       LEFT JOIN user_modules um ON g.group_id = um.group_id
       WHERE g.mod_id = $1
       GROUP BY g.group_id, g.group_name
       HAVING COUNT(um.user_id) < g.capacity
       ORDER BY g.group_name
       LIMIT 1;`,
      [mod_id]
    );

    if (groupQuery.rows.length === 0) {
      console.error("❌ No available groups for this module.");
      return res
        .status(400)
        .json({ error: "All groups are full. Please create a new group." });
    }

    const assignedGroup = groupQuery.rows[0].group_id;
    console.log(`✅ Assigning user ${user_id} to group ${assignedGroup}`);

    // ✅ Step 2: Register student in the module **AND** assign them a group
    const registerQuery = await pool.query(
      `INSERT INTO user_modules (user_id, mod_id, group_id) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (user_id, mod_id) 
       DO UPDATE SET group_id = EXCLUDED.group_id 
       RETURNING group_id;`,
      [user_id, mod_id, assignedGroup]
    );

    console.log("✅ Successfully registered:", registerQuery.rows[0]);

    return res.json({
      message: `Module registered successfully! Assigned to group: ${assignedGroup}`,
      assignedGroup,
    });
  } catch (err) {
    console.error("❌ Error registering module:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

//profile route to display registered modules
app.get("/profile", authorisation, async (req, res) => {
  try {
    const user_id = req.user; // Extract user ID from JWT

    console.log("Fetching profile for user:", user_id);

    // Fetch user details
    const userQuery = await pool.query(
      "SELECT user_name FROM users WHERE user_id = $1",
      [user_id]
    );
    if (userQuery.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch registered modules
    const moduleQuery = await pool.query(
      `SELECT m.mod_id, m.mod_name, m.mod_cod, m.semester 
       FROM user_modules um
       JOIN module m ON um.mod_id = m.mod_id
       WHERE um.user_id = $1`,
      [user_id]
    );

    console.log("Registered Modules Fetched:", moduleQuery.rows);

    return res.json({
      user_name: userQuery.rows[0].user_name,
      registeredModules: moduleQuery.rows, // Send registered modules as array
    });
  } catch (err) {
    console.error("Error fetching profile data:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

//deregister from a module
app.delete("/deregister-module/:mod_id", authorisation, async (req, res) => {
  try {
    const user_id = req.user; // Extract user ID from JWT
    const { mod_id } = req.params; // Get mod_id from URL

    console.log(
      `Deregistering module: user_id=${user_id}, module_id=${mod_id}`
    );

    // Check if the module is registered
    const checkModule = await pool.query(
      "SELECT * FROM user_modules WHERE user_id = $1 AND mod_id = $2",
      [user_id, mod_id]
    );

    if (checkModule.rows.length === 0) {
      console.log("Module not found in user_modules table");
      return res.status(404).json({ error: "Module not registered" });
    }

    // Remove the module from user_modules
    await pool.query(
      "DELETE FROM user_modules WHERE user_id = $1 AND mod_id = $2",
      [user_id, mod_id]
    );

    console.log("Module successfully deregistered");

    return res.json({ message: "Module deregistered successfully" });
  } catch (err) {
    console.error("Error in module deregistration:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to create module timetable
app.get("/events/:mod_id", async (req, res) => {
  try {
    const { mod_id } = req.params;

    const events = await pool.query(
      `SELECT eventID, name, type, day, start_time, end_time, roomID, mod_id 
       FROM event 
       WHERE mod_id = $1
       ORDER BY 
          ARRAY_POSITION(ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], day), 
          start_time`,
      [mod_id]
    );

    res.json(events.rows);
  } catch (err) {
    console.error("Error fetching events:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * Start Express server on port 5001
 */
app.listen(5001, () => {
  console.log("Server has started on port 5001");
});
