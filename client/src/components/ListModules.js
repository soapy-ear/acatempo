import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EditModule from "./EditModule"; // Import the EditModule component for inline editing
import "../App.css";

//Had the help of https://www.youtube.com/watch?v=5vF0FGfa0RQ throughout

const ListModules = () => {
  // Hook for programmatic navigation
  const navigate = useNavigate();
  // State to store the list of modules
  const [modules, setModules] = useState([]);

  // Function to delete a module
  async function deleteModule(id) {
    try {
      const token = localStorage.getItem("token"); // Retrieve authentication token
      const res = await fetch(`http://localhost:5001/modules/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: token, // Add the token in the header for authentication
        },
      });

      if (res.ok) {
        // Remove the deleted module from state to update UI
        setModules(modules.filter((module) => module.mod_id !== id));
      } else {
        console.error("Failed to delete module");
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  /**
   * Function to fetch all modules from the backend
   */
  async function getModules() {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token
      const res = await fetch("http://localhost:5001/modules", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token, // Add the token in the header
        },
      });

      if (res.ok) {
        const moduleArray = await res.json();
        // Update state with fetched modules
        setModules(moduleArray);
        console.log(moduleArray); // Debugging log, may need deleting later
      } else {
        console.error("Failed to fetch modules");
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  /**
   * Fetch modules when the component mounts
   */
  useEffect(() => {
    getModules();
  }, []);

  //Navigate to the module details page when a module name is clicked
  const viewModuleDetails = (module) => {
    navigate(`/module/${module.mod_id}`, { state: { module } });
  };

  return (
    <Fragment>
      <h1>List of Modules</h1>
      {/* Table to display modules */}
      <table className="table mt-5">
        <thead>
          <tr>
            <th>Module Code</th>
            <th>Module Name</th>
            <th>Edit Module</th>
            <th>Delete Module</th>
          </tr>
        </thead>
        <tbody>
          {modules.map((module) => (
            <tr key={module.mod_id}>
              <td>{module.mod_cod}</td>
              {/* Clickable module name to view details */}
              <td>
                <span
                  className="module-link"
                  onClick={() => viewModuleDetails(module)}
                  style={{
                    color: "blue",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  {module.mod_name}
                </span>
              </td>
              {/* Edit module using the EditModule component */}
              <td>
                <EditModule module={module} />
              </td>
              {/* Delete module button */}
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteModule(module.mod_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Back button to navigate to the dashboard */}
      <div className="button-group">
        <button onClick={() => navigate(-1)} className="btn-back">
          Back to Dashboard
        </button>
      </div>
    </Fragment>
  );
};

export default ListModules;
