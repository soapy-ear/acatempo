import React, { Fragment, useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

//Created with the help of https://www.youtube.com/watch?v=cjqfF5hyZFg 

// Import all Components
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
import ChangeSeminar from "./components/ChangeSeminar";

function App() {
  // State to track user authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // State to store the authenticated user's name
  const [userName, setUserName] = useState("");

  //Updates authentication state (true or false)
  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  /**
   * Checks if the user is authenticated by verifying their token.
   * If authenticated, fetches the user's name.
   */
  async function isAuth() {
    try {
      // Retrieve JWT token
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found in localStorage.");
        return;
      }

      // Send request to verify authentication
      const response = await fetch("http://localhost:5001/auth/is-verify", {
        method: "GET",
        headers: { token: token }, // Include authentication token
      });

      const parseRes = await response.json();

      // If token is valid, update authentication status and fetch user name
      if (parseRes === true) {
        setIsAuthenticated(true);

        // Fetch user name once authenticated
        fetchUserName();
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Error in isAuth:", err.message);
    }
  }

  /**
   * Fetches the authenticated user's name from the backend.
   */
  async function fetchUserName() {
    try {
      const token = localStorage.getItem("token"); // Retrieve JWT token
      const response = await fetch("http://localhost:5001/profile", {
        method: "GET",
        headers: { "Content-Type": "application/json", token: token },
      });

      const data = await response.json();

      // Set the user's name
      setUserName(data.user_name);
    } catch (err) {
      console.error("Error fetching user name:", err.message);
    }
  }

  /**
   * Runs authentication check when the component mounts.
   */
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
            <Route path="/change-seminar" element={<ChangeSeminar />} />

            {/* Default Route: Redirect to Login if not authenticated, else Dashboard */}
            <Route
              path="/"
              element={
                !isAuthenticated ? (
                  <Navigate to="/login" />
                ) : (
                  <Navigate to="/dashboard" />
                )
              }
            />
            {/* Error Route (404 Page Not Found) */}
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
