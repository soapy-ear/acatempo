import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const ModuleTimetable = ({ mod_id }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    let isMounted = true; // ✅ Prevent setting state after unmounting

    const fetchEvents = async () => {
      try {
        const response = await fetch(`http://localhost:5001/events/${mod_id}`);
        const data = await response.json();
        console.log("Fetched Events:", data); // ✅ Debugging log

        if (isMounted) {
          setEvents((prevEvents) => [
            ...prevEvents,
            ...data.map((event) => ({
              id: event.eventID,
              title: `${event.name} (${event.type})`,
              start: getDateTime(event.day, event.start_time),
              end: getDateTime(event.day, event.end_time),
              extendedProps: { roomID: event.roomID },
            })),
          ]);
        }
      } catch (err) {
        console.error("Error fetching events:", err.message);
      }
    };

    fetchEvents();

    return () => {
      isMounted = false; // ✅ Cleanup function
    };
  }, [mod_id]);

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

    // Calculate date for the given weekday in the current week
    const eventDate = new Date(today);
    eventDate.setDate(today.getDate() + (eventDay - currentDay));

    return `${eventDate.toISOString().split("T")[0]}T${time}`;
  };

  return (
    <div className="timetable-container">
      <h1>Module Timetable</h1>
      <FullCalendar
        key={events.length}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        events={events}
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
        allDaySlot={false}
        eventClick={(info) => alert(`Event: ${info.event.title}`)}
      />
    </div>
  );
};

export default ModuleTimetable;
