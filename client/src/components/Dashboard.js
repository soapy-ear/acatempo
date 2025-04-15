import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Dashboard = ({ setAuth }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [schedule, setSchedule] = useState([]);

  // Fetch user name
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

  // Fetch and filter today's schedule
  async function fetchTodaysSchedule() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/student-timetable", {
        method: "GET",
        headers: { token },
      });

      const data = await response.json();
      const today = new Date().toDateString(); // e.g. "Mon Apr 15 2025"

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
            match: eventDay === today,
            time: `${event.start_time.substring(
              0,
              5
            )} - ${event.end_time.substring(0, 5)}`,
            course: `${event.name} (${event.type})`,
            room: event.room_name,
          };
        })
        .filter((event) => event.match);

      setSchedule(todaysEvents);
    } catch (err) {
      console.error("Error fetching today's schedule:", err.message);
    }
  }

  // Converts semester/week/day/time to a real calendar datetime
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

    const semesterStart =
      semester === 1 ? new Date("2024-09-23") : new Date("2025-01-20");

    const baseDate = new Date(semesterStart);
    baseDate.setDate(baseDate.getDate() + (week - 1) * 7 + daysMap[day]);

    const [hours, minutes, seconds = "00"] = time.split(":");
    baseDate.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds));

    return baseDate.toISOString();
  };

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
