import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ChangeSeminar = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]); // ✅ Ensure `modules` is always an array
  const [selectedModule, setSelectedModule] = useState(null);
  const [seminarGroups, setSeminarGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudentModules();
  }, []);

const fetchStudentModules = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("❌ No token found in localStorage!");
      return;
    }

    console.log("🔍 Using Token:", token); // ✅ Debugging log

    const response = await fetch("http://localhost:5001/student-modules", {
      method: "GET",
      headers: { token },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Fetched Modules:", data);

    if (Array.isArray(data)) {
      setModules(data);
    } else {
      console.error("❌ Unexpected response format for student modules:", data);
      setModules([]);
    }
  } catch (err) {
    console.error("❌ Error fetching student modules:", err.message);
    setModules([]);
  }
};


  // ✅ Fetch available seminar groups for the selected module
  const fetchSeminarGroups = async (mod_id) => {
    try {
      setLoading(true);
      setSelectedModule(mod_id);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5001/module-seminars/${mod_id}`,
        {
          method: "GET",
          headers: { token },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched Seminar Groups:", data);

      if (Array.isArray(data)) {
        setSeminarGroups(data);
      } else {
        setSeminarGroups([]);
      }
    } catch (err) {
      console.error("Error fetching seminar groups:", err.message);
      setSeminarGroups([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle seminar swap
  const swapSeminar = async (group_id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/swap-seminar", {
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

      const result = await response.json();
      alert(result.message); // Show success/error message

      if (result.success) {
        fetchStudentModules(); // Refresh student modules
        setSelectedModule(null); // Reset selection
      }
    } catch (err) {
      console.error("Error swapping seminar:", err.message);
    }
  };

  return (
    <div className="change-seminar-container">
      <h1>Change Seminar</h1>

      {/* Step 1: Select a Module */}
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

      {/* Step 2: View Available Seminars */}
      {selectedModule && (
        <div>
          <h2>Available Seminars</h2>
          {loading ? (
            <p>Loading seminar groups...</p>
          ) : seminarGroups.length > 0 ? (
            <ul>
              {seminarGroups.map((group) => (
                <li key={group.group_id}>
                  <p>
                    <strong>Group:</strong> {group.group_name} <br />
                    <strong>Room:</strong> {group.room_name} <br />
                    <strong>Day:</strong> {group.day} <br />
                    <strong>Time:</strong> {group.start_time} - {group.end_time}{" "}
                    <br />
                    <strong>Capacity:</strong> {group.current_students} / 20
                  </p>
                  <button
                    disabled={group.current_students >= 20}
                    onClick={() => swapSeminar(group.group_id)}
                  >
                    Swap to this Group
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No available seminars for this module.</p>
          )}
        </div>
      )}

      <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
    </div>
  );
};

export default ChangeSeminar;
