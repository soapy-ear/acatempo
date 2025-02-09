import React, { Fragment, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import ModReg from "./components/ModReg";
import Error from "./components/Error";
import Timetable from "./components/Timetable";
import ManageModules from "./components/ManageModules";
import ListModules from "./components/ListModules";
import MyProfile from "./components/MyProfile";
import ModuleDetails from "./components/ModuleDetails";

// ✅ Set API URL dynamically (Local vs. Production)
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  async function isAuth() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage.");
        setIsAuthenticated(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/is-verify`, {
        method: "GET",
        headers: { token: token },
        credentials: "include", // ✅ Ensure authentication credentials are sent
      });

      const parseRes = await response.json();
      if (parseRes === true) {
        setIsAuthenticated(true);
        fetchUserName();
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Error in isAuth:", err.message);
      setIsAuthenticated(false);
    }
  }

  async function fetchUserName() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUserName("");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "GET",
        headers: { "Content-Type": "application/json", token: token },
        credentials: "include", // ✅ Ensure authentication credentials are sent
      });

      const data = await response.json();
      if (data.user_name) {
        setUserName(data.user_name);
      } else {
        setUserName("");
      }
    } catch (err) {
      console.error("Error fetching user name:", err.message);
      setUserName("");
    }
  }

  useEffect(() => {
    isAuth();
  }, []); // ✅ No unnecessary dependencies

  return (
    <Fragment>
      {isAuthenticated && <Navbar userName={userName} />}
      <div className="container">
        <Routes>
          <Route
            exact
            path="/login"
            element={
              !isAuthenticated ? (
                <Login setAuth={setAuth} />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            exact
            path="/register"
            element={
              !isAuthenticated ? (
                <Register setAuth={setAuth} />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            exact
            path="/dashboard"
            element={
              isAuthenticated ? (
                <Dashboard setAuth={setAuth} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            exact
            path="/modreg"
            element={isAuthenticated ? <ModReg /> : <Navigate to="/login" />}
          />
          <Route
            exact
            path="/timetable"
            element={isAuthenticated ? <Timetable /> : <Navigate to="/login" />}
          />
          <Route
            exact
            path="/managemodules"
            element={
              isAuthenticated ? <ManageModules /> : <Navigate to="/login" />
            }
          />
          <Route
            exact
            path="/listmodules"
            element={
              isAuthenticated ? <ListModules /> : <Navigate to="/login" />
            }
          />
          <Route
            exact
            path="/module/:id"
            element={
              isAuthenticated ? <ModuleDetails /> : <Navigate to="/login" />
            }
          />
          <Route
            exact
            path="/myprofile"
            element={isAuthenticated ? <MyProfile /> : <Navigate to="/login" />}
          />
          <Route
            path="*"
            element={<Error code={404} message={"Page Not Found"} />}
          />
        </Routes>
      </div>
    </Fragment>
  );
}

export default App;
