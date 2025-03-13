import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Dashboard = ({ setAuth }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [schedule, setSchedule] = useState([]);

  async function getName() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/dashboard/", {
        method: "GET",
        headers: { token },
      });
      const parseRes = await response.json();
      setName(parseRes.user_name);
    } catch (err) {
      console.error(err.message);
    }
  }

  async function fetchTodaysSchedule() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/student-timetable", {
        method: "GET",
        headers: { token },
      });

      const data = await response.json();
      const today = new Date();
      const todayDayName = today.toLocaleDateString("en-GB", {
        weekday: "long",
      });

      const todaysEvents = data
        .filter((event) => event.day === todayDayName)
        .map((event) => ({
          time: `${event.start_time.substring(
            0,
            5
          )} - ${event.end_time.substring(0, 5)}`,
          course: `${event.name} (${event.type})`,
          room: event.room_name,
        }));

      setSchedule(todaysEvents);
    } catch (err) {
      console.error("Error fetching today's schedule:", err.message);
    }
  }

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setAuth(false);
  };

  useEffect(() => {
    getName();
    fetchTodaysSchedule();

    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

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
