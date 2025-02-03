import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const ManageModules = () => {
  const navigate = useNavigate();
  const [mod_name, setModName] = useState("");
  const [mod_cod, setModCode] = useState("");
  const [semester, setSemester] = useState("");
  const [description, setDescription] = useState("");

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing from localStorage");
        return;
      }

      if (!mod_name || !mod_cod || !semester || !description) {
        alert(
          "Please fill in all fields, including the semester and description."
        );
        return;
      }

      const body = { mod_name, mod_cod, semester, description };
      console.log("Submitting data:", body);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/modules`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify(body),
        }
      );

      const result = await response.json();
      console.log("Response from backend:", result);
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
          <option value="4">Year</option>
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
