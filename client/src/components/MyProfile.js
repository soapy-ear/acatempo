import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";

//Authentication code helped with https://www.youtube.com/watch?v=cjqfF5hyZFg 
//This page has a lot more constructing to do, the user name is fetching properly yet nor registered modules (need to adjust database)

const MyProfile = () => {
  //Hook for navigation
  const navigate = useNavigate();

  //Retrieve state passed from navigation
  const { state } = useLocation();

  // State to store selected modules, initialised from navigation state
  const [selectedModules, setSelectedModules] = useState(
    state?.selectedModules
  );

  // State to store the user's name
  const [userName, setUserName] = useState("");

  /**
   * Fetches the user's profile data when the component mounts.
   * Ensures the user is authenticated before making the request.
   */
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Retrieve authentication token
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Token is missing from localStorage");

          // Redirect to login if token is missing
          navigate("/login");
          return;
        }

        // Fetch user profile data from the backend API
        const response = await fetch("http://localhost:5001/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token, // Include authentication token
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Profile data fetched:", data); //For testing, may comment or delete later
          setUserName(data.user_name); // Assuming the response contains user_name
        } else {
          console.error("Failed to fetch profile data");
        }
      } catch (err) {
        console.error("Error fetching profile data:", err.message);
      }
    };

    fetchProfileData();
  }, [navigate]);

  /**
   * If no modules are registered, display a message with options to register.
   */
  if (!selectedModules) {
    return (
      <div className="profile-container">
        <h1>My Profile</h1>
        <h2>Name: {userName}</h2>
        <h2>No modules registered</h2>
        <button onClick={() => navigate("/modreg")} className="btn-back">
          Register Modules
        </button>
        <button onClick={() => navigate("/dashboard")} className="btn-back">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
      <h2>Name: {userName}</h2>
      <h2>Registered Modules</h2>
      {/* Display registered modules for each semester */}
      <div className="registered-modules">
        <p>
          <strong>Semester 1:</strong> {selectedModules.semester1.mod_name} (
          {selectedModules.semester1.mod_cod})
        </p>
        <p>
          <strong>Semester 2:</strong> {selectedModules.semester2.mod_name} (
          {selectedModules.semester2.mod_cod})
        </p>
      </div>
      {/* Button to navigate back to the dashboard */}
      <button onClick={() => navigate("/dashboard")} className="btn-back">
        Back to Dashboard
      </button>
    </div>
  );
};

export default MyProfile;
