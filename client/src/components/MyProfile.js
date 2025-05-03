import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

// Component: MyProfile
// Displays the logged-in user's name and the list of modules they are registered to
const MyProfile = () => {
  const navigate = useNavigate();

  // Stores the user's name
  const [userName, setUserName] = useState("");

  // Stores the list of modules the user is registered for
  const [registeredModules, setRegisteredModules] = useState([]);

  // useEffect runs once on component mount to fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");

        // If no token is found, redirect to login page
        if (!token) {
          console.error("Token is missing from localStorage");
          navigate("/login");
          return;
        }

        // Fetch the user’s profile data from the backend
        const response = await fetch("http://localhost:5001/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        });

        // If successful, store user name and module list in state
        if (response.ok) {
          const data = await response.json();
          setUserName(data.user_name);
          setRegisteredModules(data.registeredModules || []);
        } else {
          console.error("Failed to fetch profile data");
        }
      } catch (err) {
        console.error("Error fetching profile data:", err.message);
      }
    };

    fetchProfileData();
  }, [navigate]);

  // Deregisters the user from a module and updates state to reflect the change
  const handleDeregister = async (mod_id) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5001/deregister-module/${mod_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );

      // If deregistration is successful, remove the module from the list
      if (response.ok) {
        setRegisteredModules(
          registeredModules.filter((module) => module.mod_id !== mod_id)
        );
      } else {
        console.error("Failed to deregister module");
      }
    } catch (err) {
      console.error("Error deregistering module:", err.message);
    }
  };

  return (
    <div className="profile-container">
      <h1>My Profile</h1>

      {/* Display user's name */}
      <h2>Name: {userName}</h2>

      {/* Registered Modules Section */}
      <h2>Registered Modules</h2>

      {/* If no modules are registered, show a message and registration button */}
      {registeredModules.length === 0 ? (
        <>
          <h3>No modules registered</h3>
          <button
            onClick={() => navigate("/modreg")}
            className="btn btn-secondary"
            style={{ marginBottom: "1rem" }}
          >
            Register Modules
          </button>
        </>
      ) : (
        // If modules exist, display them in a styled list
        <div className="registered-modules">
          {registeredModules.map((module) => (
            <div
              key={module.mod_id}
              className="module-item"
              style={{
                marginBottom: "1rem",
                padding: "1rem",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            >
              <p>
                <strong>Semester {module.semester}:</strong> {module.mod_name} (
                {module.mod_cod})
              </p>
              {/* Button to allow user to deregister from this module */}
              <button
                className="btn btn-danger"
                onClick={() => handleDeregister(module.mod_id)}
              >
                Deregister
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Navigation button to return to the dashboard */}
      <button
        onClick={() => navigate("/dashboard")}
        className="btn btn-secondary"
        style={{ marginTop: "2rem" }}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default MyProfile;
