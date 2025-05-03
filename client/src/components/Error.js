import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

// Error component to display an error code and message
const Error = ({ code, message }) => {
  const navigate = useNavigate(); // React Router navigation hook

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Error {code}</h1>
      <p>{message}</p>

      {/* Button to navigate back to the dashboard */}
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          border: "none",
          borderRadius: "5px",
          color: "white",
          cursor: "pointer",
        }}
      >
        Go Back to Dashboard
      </button>
    </div>
  );
};

export default Error;
