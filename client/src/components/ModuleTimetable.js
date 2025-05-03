import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
//https://fullcalendar.io/docs
//including but not limited to specifically:
//https://fullcalendar.io/docs/timegrid-view
//https://fullcalendar.io/docs/daygrid-view

// Displays a timetable for a specific module using FullCalendar
const ModuleTimetable = ({ mod_id }) => {
  // State to store the list of events for the module
  const [events, setEvents] = useState([]);

  // Fetch events for the given module when the component mounts or mod_id changes
  useEffect(() => {
    let isMounted = true; // Flag to avoid setting state on an unmounted component

    const fetchEvents = async () => {
      try {
        const response = await fetch(`http://localhost:5001/events/${mod_id}`);
        const data = await response.json();

        console.log("Fetched Events:", data); // Debug log for verification

        if (isMounted) {
          // Transform raw event data into FullCalendar format
          setEvents(
            data.map((event) => ({
              id: event.eventID,
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
                roomID: event.roomID,
                groupID: event.group_id,
              },
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching events:", err.message);
      }
    };

    fetchEvents();

    // Cleanup function to prevent memory leaks if component unmounts
    return () => {
      isMounted = false;
    };
  }, [mod_id]);

  // Utility function to convert semester/week/day/time into an ISO date string
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

    // Define semester start dates based on institutional calendar
    const semesterStart =
      semester === 1
        ? new Date("2024-09-23") // Semester 1 starts on 23rd September 2024
        : new Date("2025-01-20"); // Semester 2 starts on 20th January 2025

    // Calculate date by adding the appropriate week and day offsets
    const baseDate = new Date(semesterStart);
    baseDate.setDate(baseDate.getDate() + (week - 1) * 7 + daysMap[day]);

    // Extract and apply time components (HH:MM[:SS])
    const [hours, minutes, seconds = "00"] = time.split(":");
    baseDate.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds));

    // Return the ISO string that FullCalendar expects for event times
    return baseDate.toISOString();
  };

  return (
    <div className="timetable-container">
      <h1>Module Timetable</h1>

      {/* FullCalendar component displays the module’s scheduled events */}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} // Enabled calendar views and interactions
        initialView="timeGridWeek" // Default view showing a weekly time grid
        events={events} // Event data loaded from backend
        slotMinTime="08:00:00" // Earliest time displayed on calendar
        slotMaxTime="20:00:00" // Latest time displayed on calendar
        allDaySlot={false} // Hide all-day event slot
        firstDay={1} // Set Monday as the first day of the week
        eventClick={(info) => alert(`Event: ${info.event.title}`)} // Simple alert on event click
      />
    </div>
  );
};

export default ModuleTimetable;
