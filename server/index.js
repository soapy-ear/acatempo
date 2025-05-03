const express = require("express"); //Import Express framework
const app = express(); //initialise express application
const cors = require("cors"); //Import CORS middleware for handling cross-origin requests
const pool = require("./db"); //Import database connection
const authorisation = require("./middleware/authorisation");

//Had the help of https://www.youtube.com/watch?v=5vF0FGfa0RQ throughout for CRUD operations
// https://hightouch.com/sql-dictionary/sql-common-table-expression-cte CTE 
//www.w3schools.com/postgresql/index.php for postgresql syntax
//chatgpt.com to help with debugging


//middleware
https: app.use(cors()); // Enables backend to accept requests from frontend (Cross-Origin Resource Sharing)
app.use(express.json()); // Allows Express to parse incoming JSON data (for req.body)

//ROUTES

// Authentication routes (register & login)
app.use("/auth", require("./routes/jwtAuth"));

//dashboard route
app.use("/dashboard", require("./routes/dashboard"));

//THE FOLLOWING ROUTES NEED MOVING INTO NEW FILE crudModules.js
/**
 * route   GET /modules
 * desc    Retrieve all modules for module info page
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

//for module registration page
app.get("/modbylevel", authorisation, async (req, res) => {
  try {
    const user_id = req.user;

    // Get student level
    const studentRes = await pool.query(
      "SELECT level FROM students WHERE user_id = $1",
      [user_id]
    );

    if (studentRes.rows.length === 0) {
      return res.status(403).json({ error: "Student level not found." });
    }

    const level = studentRes.rows[0].level;

    // Get modules at that level
    const modulesRes = await pool.query(
      "SELECT * FROM module WHERE level = $1",
      [level]
    );

    res.json(modulesRes.rows);
  } catch (err) {
    console.error("Error fetching modules by level:", err.message);
    res.status(500).json({ error: "Server error" });
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
    const { mod_name, mod_cod, semester, description, status, level } =
      req.body;

    // Check if all required fields are provided
    if (
      !mod_name ||
      !mod_cod ||
      !semester ||
      !description ||
      !status ||
      !level
    ) {
      return res.status(400).json({
        message: "All fields, including status and level, are required.",
      });
    }

    // Insert new module into database
    const newModule = await pool.query(
      `INSERT INTO module (mod_name, mod_cod, semester, description, status, level)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [mod_name, mod_cod, semester, description, status, level]
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

    // Step 1: Get all groups for this module, ordered by name
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
      console.error("No available groups for this module.");
      return res
        .status(400)
        .json({ error: "All groups are full. Please select a different module." });
    }

    const assignedGroup = groupQuery.rows[0].group_id;
    console.log(`Assigning user ${user_id} to group ${assignedGroup}`);

    // Step 2: Register student in the module **AND** assign them a group
    const registerQuery = await pool.query(
      `INSERT INTO user_modules (user_id, mod_id, group_id) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (user_id, mod_id) 
       DO UPDATE SET group_id = EXCLUDED.group_id 
       RETURNING group_id;`,
      [user_id, mod_id, assignedGroup]
    );

    console.log("Successfully registered:", registerQuery.rows[0]);

    return res.json({
      message: `Module registered successfully! Assigned to group: ${assignedGroup}`,
      assignedGroup,
    });
  } catch (err) {
    console.error("Error registering module:", err.message);
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

/// Route to fetch all events for a given module ID, including semester & week
app.get("/events/:mod_id", async (req, res) => {
  try {
    const { mod_id } = req.params;

    const events = await pool.query(
  `SELECT e.eventID, e.name, e.type, e.day, e.start_time, e.end_time, 
          e.roomID, e.mod_id, e.week, m.semester
   FROM event e
   JOIN module m ON e.mod_id = m.mod_id
   WHERE e.mod_id = $1
   ORDER BY 
      m.semester::int,
      e.week,
      ARRAY_POSITION(ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], e.day),
      e.start_time`,
  [mod_id]
);


    res.json(events.rows);
  } catch (err) {
    console.error("Error fetching events:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});
//get student timetable
//https://hightouch.com/sql-dictionary/sql-common-table-expression-cte cte tutorial
app.get("/student-timetable", authorisation, async (req, res) => {
  try {
    const user_id = req.user;
    console.log("Fetching timetable for user:", user_id);

    const query = `
      WITH student_modules AS (
        SELECT mod_id, group_id
        FROM user_modules
        WHERE user_id = $1
      ),
      weekly_swaps AS (
        SELECT week, mod_id, event_id
        FROM student_event_swap
        WHERE student_id = $1
      ),
      base_events AS (
        SELECT 
          e.eventid, e.name, e.type, e.day, e.start_time, e.end_time,
          r.room_name, g.group_name, e.week, m.semester, e.mod_id, e.group_id
        FROM event e
        JOIN room r ON e.roomID = r.roomID
        LEFT JOIN group_table g ON e.group_id = g.group_id
        JOIN module m ON e.mod_id = m.mod_id
        JOIN student_modules sm ON e.mod_id = sm.mod_id
        WHERE 
          (e.group_id IS NULL OR e.group_id = sm.group_id)
          AND NOT EXISTS (
            SELECT 1 FROM weekly_swaps ws 
            WHERE ws.week = e.week AND ws.mod_id = e.mod_id
          )
      ),
      override_events AS (
        SELECT 
          e.eventid, e.name, e.type, e.day, e.start_time, e.end_time,
          r.room_name, g.group_name, e.week, m.semester, e.mod_id, e.group_id
        FROM weekly_swaps ws
        JOIN event e ON ws.event_id = e.eventid
        JOIN room r ON e.roomID = r.roomID
        LEFT JOIN group_table g ON e.group_id = g.group_id
        JOIN module m ON e.mod_id = m.mod_id
      )
      SELECT * FROM (
        SELECT * FROM base_events
        UNION ALL
        SELECT * FROM override_events
      ) AS all_events
      ORDER BY 
        semester::int,
        week,
        CASE 
          WHEN day = 'Monday' THEN 1
          WHEN day = 'Tuesday' THEN 2
          WHEN day = 'Wednesday' THEN 3
          WHEN day = 'Thursday' THEN 4
          WHEN day = 'Friday' THEN 5
        END,
        start_time;
    `;

    const events = await pool.query(query, [user_id]);
    console.log("Timetable events returned:", events.rows.length);
    res.json(events.rows);
  } catch (err) {
    console.error("Error fetching student timetable:", err.message);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});




// Get student modules
app.get("/student-modules", authorisation, async (req, res) => {
  try {
    console.log(" Extracted User from Token:", req.user);

    const user_id = req.user;
    if (!user_id) {
      console.error(" Authorization error: No user ID found.");
      return res.status(401).json({ error: "Unauthorised. No user ID provided." });
    }

    console.log("Fetching modules for user:", user_id);

    const result = await pool.query(
      `SELECT m.mod_id AS module_id, m.mod_name AS module_name
       FROM user_modules um 
       JOIN module m ON um.mod_id = m.mod_id 
       WHERE um.user_id = $1`,
      [user_id]
    );

    if (result.rows.length === 0) {
      console.warn(" No modules found for user:", user_id);
      return res.status(404).json({ error: "No registered modules found." });
    }

    console.log("Modules Retrieved:", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});




// Get available seminar groups for a module
app.get("/module-seminars/:mod_id", authorisation, async (req, res) => {
  try {
    const mod_id = req.params.mod_id;
    const user_id = req.user;

    console.log("🔍 Fetching seminar groups for mod_id:", mod_id);
    console.log("🔐 Current user ID:", user_id);

    // Fetch all unique seminar group summaries for this module
    const groupsResult = await pool.query(
      `SELECT DISTINCT ON (g.group_id)
              g.group_id,
              g.group_name,
              e.day,
              e.start_time,
              e.end_time,
              r.room_name,
              (
                SELECT COUNT(*) 
                FROM user_modules 
                WHERE group_id = g.group_id
              ) AS current_students
       FROM group_table g
       LEFT JOIN event e ON g.group_id = e.group_id AND e.mod_id = g.mod_id
       LEFT JOIN room r ON e.roomID = r.roomID
       WHERE g.mod_id = $1
       ORDER BY g.group_id, e.week ASC NULLS LAST`,
      [mod_id]
    );

    console.log("Groups found:", groupsResult.rowCount);

    // Fetch current seminar group for this user + module
    const currentGroupResult = await pool.query(
      `SELECT g.group_id, g.group_name, e.day, e.start_time, e.end_time, r.room_name
       FROM user_modules um
       JOIN group_table g ON um.group_id = g.group_id
       LEFT JOIN event e ON g.group_id = e.group_id AND e.mod_id = um.mod_id
       LEFT JOIN room r ON e.roomID = r.roomID
       WHERE um.user_id = $1 AND um.mod_id = $2
       ORDER BY e.week ASC NULLS LAST
       LIMIT 1`,
      [user_id, mod_id]
    );

    const currentGroup = currentGroupResult.rows[0] || null;

    if (!currentGroup) {
      console.log("⚠️ No current group found for this module.");
    } else {
      console.log("Current group:", currentGroup);
    }

    res.json({
      groups: groupsResult.rows,
      currentGroup,
    });
  } catch (err) {
    console.error("Error fetching seminar groups:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});


//swap seminar for whole semester
app.post("/swap-seminar", authorisation, async (req, res) => {
  try {
    const { module_id, new_group_id } = req.body;
    const user_id = req.user;

    console.log(
      `Semester swap for user ${user_id} → group ${new_group_id} in module ${module_id}`
    );

    // Step 1: Get current group
    const currentRes = await pool.query(
      `SELECT group_id FROM user_modules WHERE user_id = $1 AND mod_id = $2`,
      [user_id, module_id]
    );

    if (currentRes.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "You're not registered for this module." });
    }

    const current_group_id = currentRes.rows[0].group_id;

    if (current_group_id === new_group_id) {
      return res.status(400).json({ error: "You are already in this group." });
    }

    // Step 2: Check group capacity
    const capCheck = await pool.query(
      `SELECT COUNT(*) AS count FROM user_modules WHERE group_id = $1`,
      [new_group_id]
    );
    if (parseInt(capCheck.rows[0].count) >= 20) {
      return res.status(400).json({ error: "This group is full." });
    }

    // Step 3: Get semester of the module being swapped
    const semesterRes = await pool.query(
      `SELECT semester FROM module WHERE mod_id = $1`,
      [module_id]
    );
    const moduleSemester = semesterRes.rows[0].semester;

    // Step 4: Fetch new group events for that semester
    const newGroupEvents = await pool.query(
      `SELECT week, day, start_time, end_time 
       FROM event 
       WHERE group_id = $1 AND mod_id = $2 AND semester = $3`,
      [new_group_id, module_id, moduleSemester]
    );

    // Step 5: Fetch current user events (only same semester)
    const studentEvents = await pool.query(
      `SELECT e.week, e.day, e.start_time, e.end_time, m.mod_cod
       FROM event e
       JOIN user_modules um ON um.mod_id = e.mod_id
       JOIN module m ON m.mod_id = e.mod_id
       WHERE um.user_id = $1
         AND e.mod_id != $2
         AND m.semester = $3
         AND (e.group_id IS NULL OR e.group_id = um.group_id)`,
      [user_id, module_id, moduleSemester]
    );

    // Step 6: Clash detection
    for (const newEvent of newGroupEvents.rows) {
      for (const studentEvent of studentEvents.rows) {
        if (
          newEvent.week === studentEvent.week &&
          newEvent.day === studentEvent.day &&
          newEvent.start_time < studentEvent.end_time &&
          studentEvent.start_time < newEvent.end_time
        ) {
          return res.status(409).json({
            error: `Clash with ${studentEvent.mod_cod} on ${studentEvent.day} (week ${newEvent.week}) at ${studentEvent.start_time}`,
          });
        }
      }
    }

    // Step 7: Perform safe semester swap
    await pool.query(
      `UPDATE user_modules SET group_id = $1 WHERE user_id = $2 AND mod_id = $3`,
      [new_group_id, user_id, module_id]
    );

    console.log(`Semester swap complete for user ${user_id}`);
    return res.json({
      success: true,
      message: "Seminar swapped successfully!",
    });
  } catch (err) {
    console.error(" Semester swap error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

//weekly seminer swaps
app.post("/swap-seminar-weekly", authorisation, async (req, res) => {
  try {
    const { event_id, group_id, week } = req.body;
    const user_id = req.user;
    console.log("Weekly Swap Request Body:", { event_id, group_id, week });

    if (!event_id || !group_id || !week) {
      return res
        .status(400)
        .json({ error: "Missing event ID or week number for weekly swap." });
    }

    // Step 1: Confirm the event exists, matches week and group, and get mod_id
    const eventRes = await pool.query(
      `SELECT mod_id FROM event 
       WHERE eventid = $1 AND group_id = $2 AND week = $3`,
      [event_id, group_id, week]
    );

    if (eventRes.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Event not found for this group and week." });
    }

    const mod_id = eventRes.rows[0].mod_id;

    // Step 2: Ensure the student is actually registered for the module
    const registrationCheck = await pool.query(
      `SELECT * FROM user_modules 
       WHERE user_id = $1 AND mod_id = $2`,
      [user_id, mod_id]
    );

    if (registrationCheck.rows.length === 0) {
      return res
        .status(403)
        .json({ error: "You're not registered for this module." });
    }

    // Step 3: Prevent duplicate swaps
    const existingSwap = await pool.query(
      `SELECT * FROM student_event_swap 
       WHERE student_id = $1 AND mod_id = $2 AND week = $3`,
      [user_id, mod_id, week]
    );

    if (existingSwap.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "You’ve already swapped your seminar for this week." });
    }

    // Step 4: Insert the weekly swap
    await pool.query(
      `INSERT INTO student_event_swap (student_id, event_id, mod_id, group_id, week)
       VALUES ($1, $2, $3, $4, $5)`,
      [user_id, event_id, mod_id, group_id, week]
    );

    console.log(`Weekly swap recorded for user ${user_id} for week ${week}`);
    return res.json({
      success: true,
      message: `Seminar swapped for week ${week}.`,
    });
  } catch (err) {
    console.error(" Weekly swap error:", err);
    return res
      .status(500)
      .json({ error: "Server error", details: err.message });
  }
});

// Get event_id based on module_id, group_id, and week
app.get("/event-id", authorisation, async (req, res) => {
  try {
    const { mod_id, group_id, week } = req.query;

    if (!mod_id || !group_id || !week) {
      return res.status(400).json({ error: "Missing mod_id, group_id, or week in query." });
    }

    const result = await pool.query(
      `SELECT eventid 
       FROM event 
       WHERE mod_id = $1 AND group_id = $2 AND week = $3`,
      [mod_id, group_id, week]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No event found for that group and week." });
    }

    return res.json({ event_id: result.rows[0].eventid });
  } catch (err) {
    console.error(" Error fetching event_id:", err.message);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});



/**
 * Start Express server on port 5001
 */
app.listen(5001, () => {
  console.log("Server has started on port 5001");
});
