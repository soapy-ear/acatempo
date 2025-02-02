import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Timetable = () => {
  const navigate = useNavigate();

  // Days of the week
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  // Time slots from 9 AM to 5 PM
  const hours = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ];

  return (
    <Fragment>
      <div className="container">
        <h1 className="text-center">University Timetable</h1>

        <div className="timetable-grid">
          {/* Empty cell for top-left corner */}
          <div className="grid-header"></div>
          {days.map((day, index) => (
            <div key={index} className="grid-header day">
              {day}
            </div>
          ))}

          {hours.map((hour, index) => (
            <Fragment key={index}>
              <div className="grid-hour">{hour}</div>
              {days.map((day) => (
                <div key={`${day}-${hour}`} className="grid-cell">
                  {/* Math lecture spanning 9 AM - 11 AM */}
                  {day === "Monday" && hour === "9:00 AM" ? (
                    <div
                      className="event math-lecture"
                      style={{ height: "120px" }}
                    >
                      Maths for Computing Lecture
                    </div>
                  ) : day === "Wednesday" && hour === "1:00 PM" ? (
                    <div className="event supervisor-meeting">
                      Supervisor Meeting
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </Fragment>
          ))}
        </div>

        <div className="button-group">
          <button onClick={() => navigate(-1)} className="btn-back">
            Back to Dashboard
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default Timetable;
