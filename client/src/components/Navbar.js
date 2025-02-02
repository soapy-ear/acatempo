import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

const Navbar = ({ user_name }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">AcaTempo</div>
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
      </ul>
      <div className="navbar-user">Logged in as: {user_name}</div>
    </nav>
  );
};

export default Navbar;
