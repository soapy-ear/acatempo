const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const PORT = process.env.PORT || 5001;

// CORS configuration
const corsOptions = {
  origin: "https://acatempo1.onrender.com", // Allow frontend requests
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json()); // Allows access to req.body

// ✅ Fix: Default route to prevent 404 errors
app.get("/", (req, res) => {
  res.send("AcaTempo Backend is Running");
});

// ROUTES
app.use("/auth", require("./routes/jwtAuth"));
app.use("/dashboard", require("./routes/dashboard"));

// Module CRUD operations (Move to `crudModules.js` in the future)
app.get("/modules", async (req, res) => {
  try {
    const allModules = await pool.query("SELECT * FROM module");
    res.json(allModules.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/modules/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const module = await pool.query("SELECT * FROM module WHERE mod_id = $1", [
      id,
    ]);
    res.json(module.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/modules", async (req, res) => {
  try {
    const { mod_name, mod_cod, semester, description } = req.body;

    if (!mod_name || !mod_cod || !semester || !description) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newModule = await pool.query(
      "INSERT INTO module (mod_name, mod_cod, semester, description) VALUES ($1, $2, $3, $4) RETURNING *",
      [mod_name, mod_cod, semester, description]
    );

    res.json(newModule.rows[0]);
  } catch (err) {
    console.error("Error adding module:", err.message);
    res.status(500).send("Server Error");
  }
});

app.put("/modules/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { mod_cod, mod_name } = req.body;

    await pool.query(
      "UPDATE module SET mod_cod = $1, mod_name = $2 WHERE mod_id = $3",
      [mod_cod, mod_name, id]
    );

    res.json("Module was updated");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/modules/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM module WHERE mod_id = $1", [id]);
    res.json("Module was deleted");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
