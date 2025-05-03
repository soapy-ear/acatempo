import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

//https://www.sitepoint.com/creating-a-navbar-in-react/ for template
// Provides top navigation links and displays the logged-in user's name
const Navbar = ({ user_name }) => {
  return (
    <nav className="navbar">
      {/* Application branding */}
      <div className="navbar-brand">AcaTempo</div>

      {/* Navigation links for key pages in the system */}
      <ul className="navbar-links">
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/timetable">Timetable</Link>
        </li>
        <li>
          <Link to="/modreg">Module Registration</Link>
        </li>
        <li>
          <Link to="/myprofile">My Profile</Link>
        </li>
        <li>
          <Link to="/change-seminar">Change Seminar</Link>
        </li>
      </ul>

      {/* Display the currently logged-in user's name */}
      <div className="navbar-user">Logged in as: {user_name}</div>
    </nav>
  );
};

export default Navbar;
