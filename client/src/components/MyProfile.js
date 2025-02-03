import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";

const MyProfile = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [selectedModules, setSelectedModules] = useState(
    state?.selectedModules
  );
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token is missing from localStorage");
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token: token,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Profile data fetched:", data);
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
      <button onClick={() => navigate("/dashboard")} className="btn-back">
        Back to Dashboard
      </button>
    </div>
  );
};

export default MyProfile;
