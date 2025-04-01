import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const ModuleTimetable = ({ mod_id }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchEvents = async () => {
      try {
        const response = await fetch(`http://localhost:5001/events/${mod_id}`);
        const data = await response.json();
        console.log("Fetched Events:", data);

        if (isMounted) {
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

    return () => {
      isMounted = false;
    };
  }, [mod_id]);

  // Maps semester/week/day/time to actual date/time
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

  // Parse the start of the semester
  const semesterStart = semester === 1
    ? new Date("2024-09-23") // Semester 1 starts 23rd Sept 2024
    : new Date("2025-01-20"); // Semester 2 starts 20th Jan 2025

  // Calculate the base date of the event (start of week + day offset)
  const baseDate = new Date(semesterStart);
  baseDate.setDate(baseDate.getDate() + (week - 1) * 7 + daysMap[day]);

  // Safely extract time parts, defaulting to seconds = "00" if missing
  const [hours, minutes, seconds = "00"] = time.split(":");
  baseDate.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds));

  // Return ISO string FullCalendar can understand
 
    return baseDate.toISOString();
  };

  return (
    <div className="timetable-container">
      <h1>Module Timetable</h1>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        events={events}
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
        allDaySlot={false}
        firstDay={1} // Start week on Monday
        eventClick={(info) => alert(`Event: ${info.event.title}`)}
      />
    </div>
  );
};

export default ModuleTimetable;
