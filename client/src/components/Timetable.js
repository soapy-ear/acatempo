import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";
import "../App.css";

//https://fullcalendar.io/docs
//including but not limited to specifically:
//https://fullcalendar.io/docs/timegrid-view
//https://fullcalendar.io/docs/daygrid-view

// Displays the logged-in student's full timetable using FullCalendar
const Timetable = () => {
  const navigate = useNavigate();

  // State to hold the list of events to be shown on the calendar
  const [events, setEvents] = useState([]);

  // Fetch the student's timetable data when the component mounts
  useEffect(() => {
    let isMounted = true; // Ensures state is not set after unmounting

    const fetchTimetable = async () => {
      try {
        const token = localStorage.getItem("token");

        // If no token is present, redirect the user to the login page
        if (!token) {
          console.error("No token found. Redirecting to login.");
          navigate("/login");
          return;
        }

        // Make a request to fetch timetable data
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

        // Format data for FullCalendar and update state
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
                group: event.group_name || "Lecture", // Default to "Lecture" if no group
              },
            }));

          console.log("Formatted Events for FullCalendar:", formattedEvents);
          setEvents(formattedEvents); // Set the event data for rendering
        }
      } catch (err) {
        console.error("Error fetching timetable:", err.message);
      }
    };

    fetchTimetable();

    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  // Convert semester/week/day/time into an actual ISO-formatted date string
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

    // Define semester start dates according to academic calendar
    const semesterStart =
      semester === 1 ? new Date("2024-09-23") : new Date("2025-01-20");

    const baseDate = new Date(semesterStart);
    baseDate.setDate(baseDate.getDate() + (week - 1) * 7 + daysMap[day]);

    // Extract time components (hours, minutes, optional seconds)
    const [hours, minutes, seconds = "00"] = time.split(":");
    baseDate.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds));

    // Return a timestamp FullCalendar understands
    return baseDate.toISOString();
  };

  return (
    <div className="timetable-container">
      <h1>My Timetable</h1>

      {/* FullCalendar component to display weekly timetable */}
      <FullCalendar
        key={JSON.stringify(events)} // Ensures re-render when events change
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} // Enable views and interactivity
        initialView="timeGridWeek" // Default view showing a weekly grid with time slots
        events={events} // Events pulled from backend and formatted
        slotMinTime="08:00:00" // Earliest time shown on timetable
        slotMaxTime="20:00:00" // Latest time shown on timetable
        allDaySlot={false} // Remove "all-day" slot to focus on scheduled sessions
        firstDay={1} // Week starts on Monday
        eventClick={(info) =>
          alert(
            `Event: ${info.event.title}\nRoom: ${info.event.extendedProps.room}`
          )
        } // Simple event detail alert on click
      />

      {/* Navigation button to return to the dashboard */}
      <div className="button-group">
        <button onClick={() => navigate("/dashboard")} className="btn-back">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Timetable;
