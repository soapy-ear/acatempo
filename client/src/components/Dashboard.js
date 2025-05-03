import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "../App.css";

// Dashboard component: displays welcome message, navigation buttons, and today's schedule
const Dashboard = ({ setAuth }) => {
  const navigate = useNavigate();

  // Stores logged-in user's name
  const [name, setName] = useState("");

  // Stores formatted version of today’s date (e.g. Monday, 3 March 2025)
  const [currentDate, setCurrentDate] = useState("");

  // Stores list of events scheduled for today
  const [schedule, setSchedule] = useState([]);

  // Fetch user’s name from the backend
  async function getName() {
    try {
      const token = localStorage.getItem("token"); // Get token from local storage
      const response = await fetch("http://localhost:5001/dashboard/", {
        method: "GET",
        headers: { token }, // Pass token for authentication
      });
      const parseRes = await response.json();
      setName(parseRes.user_name); // Set user's name from response
    } catch (err) {
      console.error(err.message);
    }
  }

  // Fetch timetable data and filter events occurring today
  async function fetchTodaysSchedule() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/student-timetable", {
        method: "GET",
        headers: { token },
      });

      const data = await response.json();
      const today = new Date().toDateString(); // Today's date in readable format

      // Map over events and filter those occurring today
      const todaysEvents = data
        .map((event) => {
          const eventDate = getEventDateTime(
            event.semester,
            event.week,
            event.day,
            event.start_time
          );
          const eventDay = new Date(eventDate).toDateString();

          return {
            match: eventDay === today, // Boolean: does this event occur today?
            time: `${event.start_time.substring(
              0,
              5
            )} - ${event.end_time.substring(0, 5)}`,
            course: `${event.name} (${event.type})`,
            room: event.room_name,
          };
        })
        .filter((event) => event.match); // Keep only today's events

      setSchedule(todaysEvents); // Store today's events in state
    } catch (err) {
      console.error("Error fetching today's schedule:", err.message);
    }
  }

  // Convert semester, week, day, and time into a calendar date and time (ISO format)
  const getEventDateTime = (semester, week, day, time) => {
    const daysMap = {
      Monday: 0,
      Tuesday: 1,
      Wednesday: 2,
      Thursday: 3,
      Friday: 4,
      Saturday: 5,
      Sunday: 6,
    };

    // Define semester start dates (must match academic calendar)
    const semesterStart =
      semester === 1 ? new Date("2024-09-23") : new Date("2025-01-20");

    const baseDate = new Date(semesterStart);
    baseDate.setDate(baseDate.getDate() + (week - 1) * 7 + daysMap[day]);

    const [hours, minutes, seconds = "00"] = time.split(":");
    baseDate.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds));

    return baseDate.toISOString(); // Return date in ISO string format
  };

  // Logout function: clears token and updates auth state
  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setAuth(false); // Update auth state in parent component
  };

  // On component mount, fetch user name and today’s schedule, and set current date
  useEffect(() => {
    getName();
    fetchTodaysSchedule();

    const today = new Date();
    // Format date in UK format (e.g. Monday, 3 March 2025)
    const formattedDate = today.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    setCurrentDate(formattedDate); // Store formatted date
  }, []);

  return (
    <Fragment>
      {/* Top navigation bar with user’s name */}
      <Navbar user_name={name} />

      <div className="dashboard-container">
        <h1 className="welcome-text">Welcome {name ? name : "Guest"}</h1>

        <div className="dashboard-content">
          {/* Navigation buttons to key areas of the app */}
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
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/change-seminar")}
            >
              Change Seminar
            </button>
            <button className="btn btn-primary" onClick={(e) => logout(e)}>
              Logout
            </button>
          </div>

          {/* Schedule section showing today's classes */}
          <div className="schedule-box">
            <h2>Today's Schedule</h2>
            <p className="current-date">{currentDate}</p>

            {/* If events exist, list them. Otherwise, display fallback message */}
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
