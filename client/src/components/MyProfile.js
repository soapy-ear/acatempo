import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const MyProfile = () => {
  const navigate = useNavigate();

  // State to store the user's name and registered modules
  const [userName, setUserName] = useState("");
  const [registeredModules, setRegisteredModules] = useState([]);

  /**
   * Fetches the user's profile data when the component mounts.
   */
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Token is missing from localStorage");
          navigate("/login");
          return;
        }

        // Fetch user profile data from the backend API
        const response = await fetch("http://localhost:5001/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Profile data fetched:", data);

          setUserName(data.user_name);
          setRegisteredModules(data.registeredModules || []); // Ensure array format
        } else {
          console.error("Failed to fetch profile data");
        }
      } catch (err) {
        console.error("Error fetching profile data:", err.message);
      }
    };

    fetchProfileData();
  }, [navigate]);

  // Function to deregister from a module
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

      if (response.ok) {
        console.log(`Module ${mod_id} deregistered successfully`);
        setRegisteredModules(
          registeredModules.filter((module) => module.mod_id !== mod_id)
        ); // Remove from state
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
      <h2>Name: {userName}</h2>
      <h2>Registered Modules</h2>

      {registeredModules.length === 0 ? (
        <>
          <h3>No modules registered</h3>
          <button onClick={() => navigate("/modreg")} className="btn-back">
            Register Modules
          </button>
        </>
      ) : (
        <div className="registered-modules">
          {registeredModules.map((module) => (
            <div key={module.mod_id} className="module-item">
              <p>
                <strong>Semester {module.semester}:</strong> {module.mod_name} (
                {module.mod_cod})
              </p>
              <button
                className="btn-remove"
                onClick={() => handleDeregister(module.mod_id)}
              >
                Deregister
              </button>
            </div>
          ))}
        </div>
      )}

      <button onClick={() => navigate("/dashboard")} className="btn-back">
        Back to Dashboard
      </button>
    </div>
  );
};

export default MyProfile;
