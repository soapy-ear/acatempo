import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EditModule from "./EditModule";
import "../App.css";

// Component: Displays a list of modules with options to view details, edit, or delete
const ListModules = () => {
  const navigate = useNavigate();

  // State to store the array of modules fetched from the backend
  const [modules, setModules] = useState([]);

  // Function to delete a module by its ID
  const deleteModule = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5001/modules/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: token, // Authorisation token from local storage
        },
      });

      if (res.ok) {
        // Remove the deleted module from the local state
        setModules(modules.filter((module) => module.mod_id !== id));
      } else {
        console.error("Failed to delete module");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  // Function to fetch the full list of modules from the backend
  const getModules = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5001/modules", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });

      if (res.ok) {
        const moduleArray = await res.json();
        setModules(moduleArray); // Update state with fetched module list
      } else {
        console.error("Failed to fetch modules");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  // Fetch modules when the component mounts
  useEffect(() => {
    getModules();
  }, []);

  // Navigate to the module detail page, passing module data via state
  const viewModuleDetails = (module) => {
    navigate(`/module/${module.mod_id}`, { state: { module } });
  };

  return (
    <Fragment>
      {/* Page title */}
      <div className="text-center my-4">
        <h1 className="welcome-text">AcaTempo</h1>
        <h2>List of Modules</h2>
      </div>

      {/* Responsive table containing module data */}
      <div className="table-responsive">
        <table className="table table-bordered align-middle text-center">
          <thead className="table-light">
            <tr>
              <th>Module Code</th>
              <th>Module Name</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {/* Render each module as a table row */}
            {modules.map((module) => (
              <tr key={module.mod_id}>
                <td>{module.mod_cod}</td>
                <td>
                  {/* Module name as clickable button to view details */}
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => viewModuleDetails(module)}
                  >
                    {module.mod_name}
                  </button>
                </td>
                <td>
                  {/* Reusable EditModule component allows inline editing */}
                  <EditModule module={module} />
                </td>
                <td>
                  {/* Button to delete the module */}
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
      </div>

      {/* Navigation button to return to the dashboard */}
      <div className="text-center mt-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="btn btn-secondary"
        >
          Back to Dashboard
        </button>
      </div>
    </Fragment>
  );
};

export default ListModules;
