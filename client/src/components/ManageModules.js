import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

//Had the help of https://www.youtube.com/watch?v=5vF0FGfa0RQ throughout

const ManageModules = () => {
  const navigate = useNavigate(); //Hook for programmatic navigation

  //State variables to store module details
  const [mod_name, setModName] = useState(""); //Module name
  const [mod_cod, setModCode] = useState(""); //Module code
  const [semester, setSemester] = useState(""); //Semester
  const [description, setDescription] = useState(""); //Module description

  /**
   * Handles form submission for creating a new module
   * Sends a POST request to the backend with module details
   */

  const onSubmitForm = async (e) => {
    e.preventDefault(); // Prevent default form submission behaviour
    try {
      const token = localStorage.getItem("token"); // Retrieve authentication token
      if (!token) {
        console.error("Token is missing from localStorage");
        return;
      }

      // Ensure all fields are filled before submitting
      if (!mod_name || !mod_cod || !semester || !description) {
        alert(
          "Please fill in all fields, including the semester and description."
        );
        return;
      }

      // Create request body with module data
      const body = { mod_name, mod_cod, semester, description };
      console.log("Submitting data:", body); //Testing, may need deleting or commenting out later

      // Send a POST request to the backend to create a module
      const response = await fetch("http://localhost:5001/modules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token, // Include authentication token
        },
        body: JSON.stringify(body), // Convert data to JSON format
      });

      const result = await response.json(); // Parse server response
      console.log("Response from backend:", result); // Debugging log, may comment or delete later
    } catch (err) {
      console.error("Error submitting form:", err.message);
    }
  };

  return (
    <Fragment>
      <h1 className="text-center my-5">Create Module</h1>
      <form className="d-flex flex-column gap-3" onSubmit={onSubmitForm}>
        <input
          type="text"
          placeholder="Module name"
          className="form-control"
          value={mod_name}
          onChange={(e) => setModName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Module code"
          className="form-control"
          value={mod_cod}
          onChange={(e) => setModCode(e.target.value)}
        />

        {/* Semester Selection */}
        <select
          className="form-control"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        >
          <option value="" disabled>
            Select Semester
          </option>
          <option value="1">Semester 1</option>
          <option value="2">Semester 2</option>
          <option value="3">Semester 3</option>
          <option value="4">Year</option>{" "}
          {/* This option may need changing as database is set a INT for module not VARCHAR */}
        </select>

        {/* Description Input */}
        <textarea
          placeholder="Module description"
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
        />

        <button className="btn btn-success mt-3">Add module</button>
      </form>

      <div className="button-group mt-3">
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          Back to Dashboard
        </button>
      </div>
    </Fragment>
  );
};

export default ManageModules;
