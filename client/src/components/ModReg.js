import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const ModReg = () => {
  const navigate = useNavigate();

  // State to track selected modules for each semester
  const [selectedModules, setSelectedModules] = useState({
    semester1: "",
    semester2: "",
  });

  // State to hold modules fetched from the database
  const [modules, setModules] = useState([]);

  // Fetch modules from the backend on component mount
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the JWT token
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/modules`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token: token, // Include the token in the request
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setModules(data);
          console.log("Fetched modules:", data);
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
  const handleSubmit = () => {
    if (!selectedModules.semester1 || !selectedModules.semester2) {
      alert("Please select one module for each semester.");
      return;
    }

    const selectedModuleDetails = {
      semester1: modules.find(
        (module) => module.mod_id === selectedModules.semester1
      ),
      semester2: modules.find(
        (module) => module.mod_id === selectedModules.semester2
      ),
    };

    navigate("/myprofile", {
      state: { selectedModules: selectedModuleDetails },
    });
  };

  // Filter modules based on semester
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

        <div className="button-group">
          <button onClick={handleSubmit} className="btn-register">
            Register Modules
          </button>
          <button onClick={() => navigate(-1)} className="btn-back">
            Back to Dashboard
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default ModReg;
