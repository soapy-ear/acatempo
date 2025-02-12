import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../App.css";


//Had the help of https://www.youtube.com/watch?v=5vF0FGfa0RQ throughout


const ModuleDetails = () => {
  //Hook for navigation
  const navigate = useNavigate();

  // Extract module ID from the URL parameters
  const { id } = useParams();

  // Retrieve module data passed via navigation state
  const { state } = useLocation();

  // State to store the module details
  const [module, setModule] = useState(state?.module || null);

  /**
   * Fetches module details from the backend if not provided via navigation state.
   * Runs when the component mounts.
   */
  useEffect(() => {
    if (!module) {
      fetchModuleDetails();
    }
  }, []);

  /**
   * Fetch module details from the backend using the module ID.
   * Uses authentication token for authorization.
   */
  const fetchModuleDetails = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve authentication token
      if (!token) {
        console.error("No token found in localStorage.");
        return;
      }

      // Fetch module details from the backend API
      const response = await fetch(`http://localhost:5001/modules/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token, // Include authentication token
        },
      });

      if (response.ok) {
        const data = await response.json();
        setModule(data); // Update state with fetched module details
      } else {
        console.error("Failed to fetch module details");
      }
    } catch (err) {
      console.error("Error fetching module details:", err.message);
    }
  };

  // Display loading message if module data is not yet available
  if (!module) {
    return (
      <div className="module-details-container">
        <h2>Loading module details...</h2>
        <button onClick={() => navigate(-1)} className="btn-back">
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="module-details-container">
      <h1>Module Details</h1>
      {/* Display module details */}
      <div className="module-info">
        <p>
          <strong>Module Code:</strong> {module.mod_cod}
        </p>
        <p>
          <strong>Module Name:</strong> {module.mod_name}
        </p>
        <p>
          <strong>Semester:</strong> {module.semester}
        </p>
        <p>
          <strong>Description:</strong> {module.description}
        </p>
      </div>
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="btn-back">
        Back to List
      </button>
    </div>
  );
};

export default ModuleDetails;
