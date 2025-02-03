import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EditModule from "./EditModule";
import "../App.css";

const ListModules = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);

  // Function to delete a module
  async function deleteModule(id) {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/modules/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            token: token, // Add the token in the header
          },
        }
      );

      if (res.ok) {
        setModules(modules.filter((module) => module.mod_id !== id));
      } else {
        console.error("Failed to delete module");
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  // Function to get all modules
  async function getModules() {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/modules/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token, // Add the token in the header
          },
        }
      );

      if (res.ok) {
        const moduleArray = await res.json();
        setModules(moduleArray);
        console.log(moduleArray); // Log the fetched modules
      } else {
        console.error("Failed to fetch modules");
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    getModules(); // Fetch modules on component mount
  }, []);

  const viewModuleDetails = (module) => {
    navigate(`/module/${module.mod_id}`, { state: { module } });
  };

  return (
    <Fragment>
      <h1>List of Modules</h1>
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
              <td>
                <EditModule module={module} />
              </td>
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
      <div className="button-group">
        <button onClick={() => navigate(-1)} className="btn-back">
          Back to Dashboard
        </button>
      </div>
    </Fragment>
  );
};

export default ListModules;
