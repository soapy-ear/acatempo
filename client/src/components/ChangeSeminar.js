import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

//https://www.freecodecamp.org/news/javascript-map-how-to-use-the-js-map-function-array-method/
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
//https://stackoverflow.com/questions/75401477/reasons-for-using-isloading-or-isfetching-in-react-query
//chatgpt.com (to help with semester swap / weekly swap html layout)

// Component: ChangeSeminar
// Allows students to view their current seminar group for a module and request to swap either for the whole semester or a specific week
const ChangeSeminar = () => {
  const navigate = useNavigate();

  // State to hold list of modules the student is registered to
  const [modules, setModules] = useState([]);

  // Stores selected module's ID
  const [selectedModule, setSelectedModule] = useState(null);

  // Holds seminar groups available for the selected module
  const [seminarGroups, setSeminarGroups] = useState([]);

  // Holds the current seminar group student is registered to
  const [currentGroup, setCurrentGroup] = useState(null);

  // Indicates whether data is being fetched
  const [loading, setLoading] = useState(false);

  // Determines if the student is swapping for the whole semester or a specific week
  const [swapType, setSwapType] = useState("semester");

  // Stores the week number selected for a weekly swap (default: week 1)
  const [selectedWeek, setSelectedWeek] = useState(1);

  // Defines the academic days for organising seminars
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Fetch student's registered modules on component mount
  useEffect(() => {
    fetchStudentModules();
  }, []);

  // Retrieves student modules from backend
  const fetchStudentModules = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5001/student-modules", {
        headers: { token },
      });
      const data = await res.json();
      setModules(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching student modules:", err);
    }
  };

  // Fetches seminar group options and the student’s current seminar group for a specific module
  const fetchSeminarGroups = async (mod_id) => {
    try {
      setLoading(true);
      setSelectedModule(mod_id);
      setSeminarGroups([]);
      setCurrentGroup(null);

      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5001/module-seminars/${mod_id}`,
        {
          headers: { token },
        }
      );

      const data = await res.json();
      setSeminarGroups(Array.isArray(data.groups) ? data.groups : []);
      setCurrentGroup(data.currentGroup || null);
    } catch (err) {
      console.error("Error fetching seminar groups:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetches a specific event ID for use in a weekly swap
  const fetchEventId = async (mod_id, group_id, week) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5001/event-id?mod_id=${mod_id}&group_id=${group_id}&week=${week}`,
        {
          headers: { token },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No event found.");
      return data.event_id;
    } catch (err) {
      console.error("Error fetching event ID:", err.message);
      return null;
    }
  };

  // Handles seminar swap submission depending on selected swap type
  const swapSeminar = async (group_id) => {
    try {
      const token = localStorage.getItem("token");

      if (swapType === "week") {
        // For a specific week swap
        const event_id = await fetchEventId(
          selectedModule,
          group_id,
          selectedWeek
        );
        if (!event_id) {
          alert("Could not find matching seminar event for that week.");
          return;
        }

        const res = await fetch("http://localhost:5001/swap-seminar-weekly", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token,
          },
          body: JSON.stringify({ event_id, group_id, week: selectedWeek }),
        });

        const result = await res.json();
        if (!res.ok) {
          alert(result.error || "Could not complete weekly swap.");
          return;
        }

        alert(result.message);
      } else {
        // For whole semester swap
        const res = await fetch("http://localhost:5001/swap-seminar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token,
          },
          body: JSON.stringify({
            module_id: selectedModule,
            new_group_id: group_id,
          }),
        });

        const result = await res.json();
        if (!res.ok) {
          alert(result.error || "Unable to swap seminar.");
          return;
        }

        alert(result.message);
      }

      // Reset UI and refresh module list
      fetchStudentModules();
      setSelectedModule(null);
      setSeminarGroups([]);
      setCurrentGroup(null);
    } catch (err) {
      console.error("Swap error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  // Groups seminar options by weekday for display
  const groupedSeminars = daysOfWeek.reduce((acc, day) => {
    acc[day] = seminarGroups.filter(
      (group) =>
        group.day?.toLowerCase() === day.toLowerCase() && group.start_time
    );
    return acc;
  }, {});

  return (
    <div className="change-seminar-container">
      <h1>Change Seminar</h1>

      {/* Module selection and current seminar display */}
      <div className="top-section" style={{ display: "flex", gap: "2rem" }}>
        {/* Left pane: list of modules */}
        <div className="module-selection">
          <h2>Select a Module</h2>
          {modules.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {modules.map((mod) => (
                <li key={mod.module_id} style={{ marginBottom: "1rem" }}>
                  <button
                    className="btn btn-outline-primary w-100"
                    onClick={() => fetchSeminarGroups(mod.module_id)}
                  >
                    {mod.module_name}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No registered modules found.</p>
          )}
        </div>

        {/* Right pane: current seminar group info */}
        {selectedModule && currentGroup && (
          <div className="current-seminar-box">
            <h3>Current Seminar</h3>
            <p>
              <strong>Group:</strong> {currentGroup.group_name}
            </p>
            <p>
              <strong>Room:</strong> {currentGroup.room_name || "TBA"}
            </p>
            <p>
              <strong>Day:</strong> {currentGroup.day || "TBA"}
            </p>
            <p>
              <strong>Time:</strong>{" "}
              {currentGroup.start_time && currentGroup.end_time
                ? `${currentGroup.start_time} - ${currentGroup.end_time}`
                : "TBA"}
            </p>
          </div>
        )}
      </div>

      {/* Swap options and seminar group list */}
      {selectedModule && (
        <>
          {/* Swap type radio buttons */}
          <div className="swap-options">
            <h2>Choose Swap Type</h2>
            <label>
              <input
                type="radio"
                value="semester"
                checked={swapType === "semester"}
                onChange={() => setSwapType("semester")}
              />
              Whole Semester
            </label>
            <label style={{ marginLeft: "1rem" }}>
              <input
                type="radio"
                value="week"
                checked={swapType === "week"}
                onChange={() => setSwapType("week")}
              />
              Specific Week
            </label>

            {/* Week dropdown shown only if "week" is selected */}
            {swapType === "week" && (
              <div style={{ marginTop: "0.5rem" }}>
                <label>Select Week:&nbsp;</label>
                <select
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Week {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Available seminar options organised by weekday */}
          <div>
            <h2>Available Seminars</h2>
            {loading ? (
              <p>Loading seminar groups...</p>
            ) : (
              <div className="seminar-grid">
                {daysOfWeek.map((day) => (
                  <div key={day} className="seminar-day">
                    <h3>{day}</h3>
                    {groupedSeminars[day]?.length > 0 ? (
                      <ul>
                        {groupedSeminars[day].map((group) => {
                          const isFull = group.current_students >= 20;
                          const isCurrent =
                            group.group_id === currentGroup?.group_id;

                          return (
                            <li key={group.group_id}>
                              <p>
                                <strong>Group:</strong> {group.group_name}
                                <br />
                                <strong>Room:</strong>{" "}
                                {group.room_name || "TBA"}
                                <br />
                                <strong>Time:</strong>{" "}
                                {group.start_time && group.end_time
                                  ? `${group.start_time} - ${group.end_time}`
                                  : "TBA"}
                                <br />
                                <strong>Capacity:</strong>{" "}
                                {group.current_students} / 20
                              </p>
                              {/* Disable button if group is full or current */}
                              <button
                                disabled={isFull || isCurrent}
                                onClick={() => swapSeminar(group.group_id)}
                              >
                                {isCurrent
                                  ? "Current Group"
                                  : isFull
                                  ? "Seminar Full"
                                  : "Swap to this Group"}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p>No seminars available on this day.</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Button to return to the dashboard */}
      <button
        onClick={() => navigate("/dashboard")}
        style={{ marginTop: "2rem" }}
        className="btn btn-secondary"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default ChangeSeminar;
