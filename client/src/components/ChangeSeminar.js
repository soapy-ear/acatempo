import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const ChangeSeminar = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [seminarGroups, setSeminarGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [loading, setLoading] = useState(false);

  const [swapType, setSwapType] = useState("semester"); // "semester" or "week"
  const [selectedWeek, setSelectedWeek] = useState(1);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    fetchStudentModules();
  }, []);

  const fetchStudentModules = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("❌ No token found!");

      const response = await fetch("http://localhost:5001/student-modules", {
        method: "GET",
        headers: { token },
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setModules(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Error fetching student modules:", err.message);
      setModules([]);
    }
  };

  const fetchSeminarGroups = async (mod_id) => {
    try {
      setLoading(true);
      setSelectedModule(mod_id);
      setSeminarGroups([]);
      setCurrentGroup(null);

      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5001/module-seminars/${mod_id}`,
        {
          method: "GET",
          headers: { token },
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setSeminarGroups(Array.isArray(data.groups) ? data.groups : []);
      setCurrentGroup(data.currentGroup || null);
    } catch (err) {
      console.error("Error fetching seminar groups:", err.message);
      setSeminarGroups([]);
      setCurrentGroup(null);
    } finally {
      setLoading(false);
    }
  };

  const swapSeminar = async (group_id) => {
    try {
      const token = localStorage.getItem("token");

      const body = {
        module_id: selectedModule,
        new_group_id: group_id,
        swap_type: swapType,
        week: swapType === "week" ? selectedWeek : null,
      };

      const response = await fetch("http://localhost:5001/swap-seminar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        // Show custom clash message if response contains clash info
        const message =
          result?.error || "Unable to swap seminar due to a clash on your timetable.";
        alert(message);
        return;
      }

      alert(result.message);

      if (result.success) {
        fetchStudentModules();
        setSelectedModule(null);
        setSeminarGroups([]);
        setCurrentGroup(null);
      }
    } catch (err) {
      console.error("Error swapping seminar:", err.message);
      alert("Something went wrong. Please try again later.");
    }
  };


  const groupedSeminars = daysOfWeek.reduce((acc, day) => {
    acc[day] = seminarGroups.filter(
      (group) =>
        group.day?.toLowerCase() === day.toLowerCase() &&
        group.start_time !== null
    );
    return acc;
  }, {});

  return (
    <div className="change-seminar-container">
      <h1>Change Seminar</h1>

      <div className="top-section" style={{ display: "flex", gap: "2rem" }}>
        {/* Module selection */}
        <div className="module-selection">
          <h2>Select a Module</h2>
          {modules.length > 0 ? (
            <ul>
              {modules.map((mod) => (
                <li key={mod.module_id}>
                  <button onClick={() => fetchSeminarGroups(mod.module_id)}>
                    {mod.module_name}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No registered modules found.</p>
          )}
        </div>

        {/* Current seminar box */}
        {selectedModule && currentGroup && (
          <div
            className="current-seminar-box"
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              maxWidth: "300px",
              height: "fit-content",
            }}
          >
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

      {/* Swap Options */}
      {selectedModule && (
        <div className="swap-options" style={{ marginTop: "2rem" }}>
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
      )}

      {/* Seminar list */}
      {selectedModule && (
        <div>
          <h2 style={{ marginTop: "2rem" }}>Available Seminars</h2>
          {loading ? (
            <p>Loading seminar groups...</p>
          ) : (
            <div className="seminar-grid">
              {daysOfWeek.map((day) => (
                <div key={day} className="seminar-day">
                  <h3>{day}</h3>
                  {groupedSeminars[day] && groupedSeminars[day].length > 0 ? (
                    <ul>
                      {groupedSeminars[day].map((group) => (
                        <li key={group.group_id}>
                          <p>
                            <strong>Group:</strong> {group.group_name} <br />
                            <strong>Room:</strong> {group.room_name || "TBA"}{" "}
                            <br />
                            <strong>Time:</strong>{" "}
                            {group.start_time && group.end_time
                              ? `${group.start_time} - ${group.end_time}`
                              : "TBA"}{" "}
                            <br />
                            <strong>Capacity:</strong> {group.current_students}{" "}
                            / 20
                          </p>
                          <button
                            disabled={
                              group.current_students >= 20 ||
                              group.group_id === currentGroup?.group_id
                            }
                            onClick={() => swapSeminar(group.group_id)}
                          >
                            {group.group_id === currentGroup?.group_id
                              ? "Current Group"
                              : "Swap to this Group"}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No seminars available on this day.</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => navigate("/dashboard")}
        style={{ marginTop: "2rem" }}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default ChangeSeminar;
