import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Timetable = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]); // ✅ Ensure correct state handling

  useEffect(() => {
    let isMounted = true; // ✅ Prevents state update after unmounting

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
              token: token, // ✅ Authenticate request
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch timetable data.");
        }

        const data = await response.json();
        console.log("Fetched Student Timetable Events:", data); // ✅ Debugging log

        if (isMounted && Array.isArray(data)) {
          const formattedEvents = data
            .filter((event) => event.group_name === null || event.group_name) // ✅ Include lectures + registered seminars
            .map((event) => ({
              id: event.eventid, // ✅ Ensure correct field name
              title: `${event.name} (${event.type})`,
              start: getDateTime(event.day, event.start_time),
              end: getDateTime(event.day, event.end_time),
              extendedProps: {
                room: event.room_name,
                group: event.group_name || "Lecture",
              },
            }));

          console.log("Formatted Events for FullCalendar:", formattedEvents); // ✅ Debugging log

          setEvents(formattedEvents); // ✅ Store all events correctly
        }
      } catch (err) {
        console.error("Error fetching timetable:", err.message);
      }
    };

    fetchTimetable();

    return () => {
      isMounted = false; // ✅ Cleanup function
    };
  }, [navigate]);

  // Function to map weekday names to actual dates for FullCalendar
  const getDateTime = (day, time) => {
    const daysMap = {
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
    };

    const today = new Date();
    const currentDay = today.getDay(); // Sunday = 0, Monday = 1, etc.
    const eventDay = daysMap[day];

    // Ensure event appears on the correct weekday in the current week
    const eventDate = new Date(today);
    eventDate.setDate(today.getDate() + ((eventDay - currentDay + 7) % 7));

    return new Date(
      `${eventDate.toISOString().split("T")[0]}T${time}`
    ).toISOString();
  };

  return (
    <div className="timetable-container">
      <h1>My Timetable</h1>
      <FullCalendar
        key={JSON.stringify(events)} // ✅ Ensures re-render when events update
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        events={events}
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
        allDaySlot={false}
        firstDay={1} // ✅ Ensures the week starts on Monday
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
