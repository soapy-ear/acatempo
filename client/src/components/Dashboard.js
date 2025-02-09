import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Dashboard = ({ setAuth }) => {
  const [name, setName] = useState("");
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
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState("");

  async function getName() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing from localStorage");
        return;
      }
      const response = await fetch("https://acatempo.onrender.com/dashboard/", {
        method: "GET",
        headers: { token: localStorage.getItem("token") },
      });

      const parseRes = await response.json();
      setName(parseRes.user_name);
      console.log(parseRes); // For testing
    } catch (err) {
      console.error(err.message);
    }
  }

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setAuth(false);
  };

  // useEffect(() => {
  //getName();
  // }, []);

  useEffect(() => {
    getName();
    const today = new Date();
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const formattedDate = today.toLocaleDateString("en-GB", options);
    setCurrentDate(formattedDate);
  }, []);

  return (
    <Fragment>
      <div className="dashboard-container">
        <h1 className="welcome-text">Welcome {name ? name : "Guest"}</h1>

        <div className="dashboard-content">
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

          <div className="schedule-box">
            <h2>Today's Schedule</h2>
            <p className="current-date">{currentDate}</p>
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
