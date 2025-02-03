import React, { Fragment, useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Components
import Navbar from "./components/Navbar"; // Import Navbar
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
        return;
      }

      const response = await fetch("http://localhost:5001/auth/is-verify", {
        method: "GET",
        headers: { token: token },
      });

      const parseRes = await response.json();
      if (parseRes === true) {
        setIsAuthenticated(true);
        fetchUserName(); // Fetch user name once authenticated
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Error in isAuth:", err.message);
    }
  }

  async function fetchUserName() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/profile", {
        method: "GET",
        headers: { "Content-Type": "application/json", token: token },
      });

      const data = await response.json();
      setUserName(data.user_name);
    } catch (err) {
      console.error("Error fetching user name:", err.message);
    }
  }

  useEffect(() => {
    isAuth();
  }, []);

  return (
    <Fragment>
      <Router>
        {isAuthenticated && <Navbar userName={userName} />}{" "}
        {/* Show navbar when logged in */}
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
              element={
                isAuthenticated ? <Timetable /> : <Navigate to="/login" />
              }
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
              element={
                isAuthenticated ? <MyProfile /> : <Navigate to="/login" />
              }
            />
            <Route
              path="*"
              element={<Error code={404} message={"Page Not Found"} />}
            />
          </Routes>
        </div>
      </Router>
    </Fragment>
  );
}

export default App;
