import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

//Had the help of https://www.youtube.com/watch?v=5vF0FGfa0RQ throughout
//AI also helped to split the semesters into columns

const ModReg = () => {
  // Hook for navigation
  const navigate = useNavigate();

  // State to track selected modules for each semester
  const [selectedModules, setSelectedModules] = useState({
    semester1: "",
    semester2: "",
  });

  // State to hold modules fetched from the database
  const [modules, setModules] = useState([]);

  // Fetch modules from the backend on component mount
  //The function retrieves the user's authentication token and sends a GET request.
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the JWT token

        // Fetch modules from the backend API
        const response = await fetch("http://localhost:5001/modbylevel", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        });

        if (response.ok) {
          const data = await response.json();

          // Update state with fetched modules
          setModules(data);

          console.log("Fetched modules:", data); //For testing, may comment or delete later
        } else {
          console.error("Failed to fetch modules");
        }
      } catch (err) {
        console.error("Error fetching modules:", err.message);
      }
    };

    fetchModules();
  }, []);

  // Handle module selection ensuring only one per semester
  const handleModuleChange = (semester, moduleId) => {
    setSelectedModules((prevState) => ({
      ...prevState,
      [semester]: moduleId,
    }));
  };

  // Function to handle form submission
  //Ensures that one module is selected for each semester before proceeding.
  //Navigates to the profile page with selected modules.
  const handleSubmit = async () => {
    if (!selectedModules.semester1 || !selectedModules.semester2) {
      alert("Please select one module for each semester.");
      return;
    }

    const token = localStorage.getItem("token");
    //register sem1 module
    try {
      const response1 = await fetch("http://localhost:5001/register-module", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({ mod_id: selectedModules.semester1 }),
      });
      // register sem2 module
      const response2 = await fetch("http://localhost:5001/register-module", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({ mod_id: selectedModules.semester2 }),
      });

      const result1 = await response1.json();
      const result2 = await response2.json();

      if (response1.ok && response2.ok) {
        alert(`Modules registered successfully! \n
      Semester 1 Group: ${result1.assignedGroup} \n
      Semester 2 Group: ${result2.assignedGroup}`);

        navigate("/myprofile");
      } else {
        alert("Module registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Error registering modules:", err);
      alert("An error occurred while registering modules.");
    }
  };

  /**
   * Filters modules based on semester.
   * Assumes semester values are stored as integers (1 = Semester 1, 2 = Semester 2).
   * This may need updating if we keep "year"
   */
  const semester1Modules = modules.filter((module) => module.semester === 1);
  const semester2Modules = modules.filter((module) => module.semester === 2);

  return (
    <Fragment>
      <div className="container">
        <h1 className="text-center mt-5">Module Registration</h1>
        <h2 className="text-center mt-5">
          Please pick one module from each semester
        </h2>

        <div className="module-grid">
          {/* Semester 1 Column */}
          <div className="semester">
            <h2>Semester 1</h2>
            <ul className="module-list">
              {semester1Modules.map((module) => (
                <li key={module.mod_id}>
                  <input
                    type="radio"
                    id={`s1-${module.mod_id}`}
                    name="semester1"
                    value={module.mod_id}
                    checked={selectedModules.semester1 === module.mod_id}
                    onChange={() =>
                      handleModuleChange("semester1", module.mod_id)
                    }
                  />
                  <label htmlFor={`s1-${module.mod_id}`}>
                    {module.mod_name} ({module.mod_cod})
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Semester 2 Column */}
          <div className="semester">
            <h2>Semester 2</h2>
            <ul className="module-list">
              {semester2Modules.map((module) => (
                <li key={module.mod_id}>
                  <input
                    type="radio"
                    id={`s2-${module.mod_id}`}
                    name="semester2"
                    value={module.mod_id}
                    checked={selectedModules.semester2 === module.mod_id}
                    onChange={() =>
                      handleModuleChange("semester2", module.mod_id)
                    }
                  />
                  <label htmlFor={`s2-${module.mod_id}`}>
                    {module.mod_name} ({module.mod_cod})
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Buttons for submission and navigation */}
        <div className="text-center mt-4">
          <button
            onClick={handleSubmit}
            className="btn btn-success"
            style={{ marginRight: "1rem" }}
          >
            Register Modules
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn btn-secondary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default ModReg;
