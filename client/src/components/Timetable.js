import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Timetable = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchTimetable = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found. Redirecting to login.");
          navigate("/login");
          return;
        }

        const response = await fetch(
          "http://localhost:5001/student-timetable",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token: token,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch timetable data.");
        }

        const data = await response.json();
        console.log("Fetched Student Timetable Events:", data);

        if (isMounted && Array.isArray(data)) {
          const formattedEvents = data
            .filter((event) => event.group_name === null || event.group_name)
            .map((event) => ({
              id: event.eventid,
              title: `${event.name} (${event.type})`,
              start: getEventDateTime(
                event.semester,
                event.week,
                event.day,
                event.start_time
              ),
              end: getEventDateTime(
                event.semester,
                event.week,
                event.day,
                event.end_time
              ),
              extendedProps: {
                room: event.room_name,
                group: event.group_name || "Lecture",
              },
            }));

          console.log("Formatted Events for FullCalendar:", formattedEvents);
          setEvents(formattedEvents);
        }
      } catch (err) {
        console.error("Error fetching timetable:", err.message);
      }
    };

    fetchTimetable();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  // Converts semester + week + day + time into a real datetime
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

  return (
    <div className="timetable-container">
      <h1>My Timetable</h1>
      <FullCalendar
        key={JSON.stringify(events)}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        events={events}
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
        allDaySlot={false}
        firstDay={1}
        eventClick={(info) =>
          alert(
            `Event: ${info.event.title}\nRoom: ${info.event.extendedProps.room}`
          )
        }
      />
      <div className="button-group">
        <button onClick={() => navigate("/dashboard")} className="btn-back">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Timetable;
