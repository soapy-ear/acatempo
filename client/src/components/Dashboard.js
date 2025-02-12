import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Dashboard = ({ setAuth }) => {
  // State to store the user's name
  const [name, setName] = useState("");

  // State to hold a mock daily schedule (temporary hardcoded data, needs updating)
  const [schedule, setSchedule] = useState([
    {
      time: "09:00 - 11:00",
      course: "Trends in Computer Science - Seminar",
      room: "G.100",
    },
    {
      time: "11:00 - 13:00",
      course: "Mathematics for Computing - Lecture",
      room: "Large Lecture Theatre",
    },
    {
      time: "14:00 - 16:00",
      course: "Mathematics for Computing - Seminar",
      room: "2.112",
    },
  ]);

  // Hook for navigation within the app
  const navigate = useNavigate();

  // State to store the current date in a readable format
  const [currentDate, setCurrentDate] = useState("");

  /**
   * Fetch the user's name from the backend API
   * Uses the stored JWT token for authentication
   */

  async function getName() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing from localStorage");
        return;
      }
      // Fetch request to get user details
      const response = await fetch("http://localhost:5001/dashboard/", {
        method: "GET",
        headers: { token: localStorage.getItem("token") },
      });

      // Parse response as JSON
      const parseRes = await response.json();

      // Set the user's name in state
      setName(parseRes.user_name);

      console.log(parseRes); // For testing, may need removing later
    } catch (err) {
      console.error(err.message);
    }
  }

  /**
   * Logout function that clears the authentication token
   * and updates the authentication state
   */
  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token"); // Remove token from local storage
    setAuth(false); // Update authentication state
  };

  /**
   * useEffect Hook to fetch the user's name when the component mounts
   */
  useEffect(() => {
    getName();
  }, []);

  /**
   * useEffect Hook to update the current date and fetch the user name
   */
  //Current Date helped with code from https://www.shecodes.io/athena/7466-how-to-get-current-date-in-react

  useEffect(() => {
    getName(); //Do I need twice? Need to look into this
    const today = new Date(); // Get the current date

    // Format the date in a readable format
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    // Convert the date into a string format (e.g., "Monday, 12 February 2024")
    const formattedDate = today.toLocaleDateString("en-GB", options);
    // Store the formatted date in state
    setCurrentDate(formattedDate);
  }, []);

  return (
    <Fragment>
      <div className="dashboard-container">
        <h1 className="welcome-text">Welcome {name ? name : "Guest"}</h1>

        <div className="dashboard-content">
          {/* Navigation Buttons */}
          <div className="button-group">
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/timetable")}
            >
              Timetable
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/modreg")}
            >
              Module Registration
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/listmodules")}
            >
              List of Modules
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/managemodules")}
            >
              Create Modules
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/myprofile")}
            >
              My Profile
            </button>
            <button className="btn btn-primary" onClick={(e) => logout(e)}>
              Logout
            </button>
          </div>
          {/* Section displaying today's schedule */}
          <div className="schedule-box">
            <h2>Today's Schedule</h2>
            <p className="current-date">{currentDate}</p>
            {/* If schedule exists, display it; otherwise, show a no-class message */}
            {schedule.length > 0 ? (
              <ul>
                {schedule.map((item, index) => (
                  <li key={index}>
                    <strong>{item.time}</strong>: {item.course} - {item.room}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No classes scheduled for today.</p>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Dashboard;
