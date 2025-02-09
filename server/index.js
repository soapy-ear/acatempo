const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const PORT = process.env.PORT || 5001
const corsOptions = {
  origin: "https://acatempo1.onrender.com",
};

//middleware
app.use(cors(corsOptions)); //so backend can interact with front end


app.use(express.json()); //allows access to req.body

//ROUTES

//register and login routes
app.use("/auth", require("./routes/jwtAuth"));

//dashboard route
app.use("/dashboard", require("./routes/dashboard"));

//THE FOLLOWING ROUTES NEED MOVING INTO NEW FILE crudModules.js

//get all modules (mod info page? mod sem request page?)
app.get("/modules", async (req, res) => {
  try {
    const allModules = await pool.query("SELECT * FROM module"); // may not need to get all info from mod, name n code only to start w?
    res.json(allModules.rows); //.... then mod info page can get all info from one specific module (next route)
  } catch (err) {
    console.error(err.message);
  }
});

//get a module
app.get("/modules/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const module = await pool.query("SELECT * FROM module WHERE mod_id = $1", [
      id,
    ]); //get all info for one module matching id
    res.json(module.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//create a module?? admin only

app.post("/modules", async (req, res) => {
  try {
    const { mod_name, mod_cod, semester, description } = req.body;

    if (!mod_name || !mod_cod || !semester || !description) {
      return res
        .status(400)
        .json({ message: "All fields, including description, are required." });
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

//update a module?? admin only, descrip only (can add if needed)

app.put("/modules/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { mod_cod, mod_name } = req.body;

    const updateModule = await pool.query(
      "UPDATE module SET mod_cod = $1, mod_name = $2 WHERE mod_id = $3",
      [mod_cod, mod_name, id]
    );

    res.json("Module was updated");
  } catch (err) {
    console.error(err.message);
  }
});

//delete a module?? admin only
app.delete("/modules/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteModule = await pool.query(
      "DELETE FROM module WHERE mod_id = $1",
      [id]
    );
    res.json("Module was deleted");
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(PORT, () => {
  console.log("Server has started on port 5001");
});
