import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../App.css";

const ModuleDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const [module, setModule] = useState(state?.module || null);

  useEffect(() => {
    if (!module) {
      fetchModuleDetails();
    }
  }, []);

  const fetchModuleDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage.");
        return;
      }

      const response = await fetch(`http://localhost:5001/modules/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setModule(data);
      } else {
        console.error("Failed to fetch module details");
      }
    } catch (err) {
      console.error("Error fetching module details:", err.message);
    }
  };

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
      <button onClick={() => navigate(-1)} className="btn-back">
        Back to List
      </button>
    </div>
  );
};

export default ModuleDetails;
