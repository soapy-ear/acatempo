import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

// Had the help of https://www.youtube.com/watch?v=cjqfF5hyZFg throughout
// Allows new users to create an account and choose whether they are a student or staff member
const Register = ({ setAuth }) => {
  // State to store form input values
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    name: "",
    user_specialisation: "student", // Default role is student
    level: "", // Level only applies to students
  });

  // Destructure values from state for easy reference
  const { email, password, name, user_specialisation, level } = inputs;

  // Handle input field changes and update state
  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  // Submit the registration form to the backend
  const onSubmitForm = async (e) => {
    e.preventDefault(); // Prevent default form submission behaviour

    try {
      // Build request payload
      const body = { email, password, name, user_specialisation, level };

      // Send POST request to registration endpoint
      const response = await fetch("http://localhost:5001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body), // Convert data to JSON
      });

      const parseRes = await response.json();

      // If registration is successful, store token and update auth state
      if (response.ok && parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        setAuth(true); // Set logged-in state
      } else {
        // Show error message returned by the server or a default message
        alert(parseRes.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error(err.message); // Handle unexpected errors
    }
  };

  return (
    <Fragment>
      {/* AcaTempo branding and registration heading */}
      <div className="text-center my-4">
        <h1 className="welcome-text">AcaTempo</h1>
        <h2>Register</h2>
      </div>

      {/* Registration form */}
      <form onSubmit={onSubmitForm}>
        {/* Email input */}
        <input
          type="email"
          name="email"
          placeholder="email"
          className="form-control my-3"
          value={email}
          onChange={onChange}
        />

        {/* Password input */}
        <input
          type="password"
          name="password"
          placeholder="password"
          className="form-control my-3"
          value={password}
          onChange={onChange}
        />

        {/* Name input */}
        <input
          type="text"
          name="name"
          placeholder="name"
          className="form-control my-3"
          value={name}
          onChange={onChange}
        />

        {/* Dropdown to select user role (student or staff) */}
        <select
          name="user_specialisation"
          className="form-control my-3"
          value={user_specialisation}
          onChange={onChange}
          required
        >
          <option value="student">Student</option>
          <option value="staff">Staff</option>
        </select>

        {/* Show level selection only if the user is a student */}
        {user_specialisation === "student" && (
          <select
            name="level"
            className="form-control my-3"
            value={level}
            onChange={onChange}
            required
          >
            <option value="">Select Level</option>
            <option value="4">Level 4</option>
            <option value="5">Level 5</option>
            <option value="6">Level 6</option>
          </select>
        )}

        {/* Submit button */}
        <button className="btn btn-success w-100">Submit</button>
      </form>

      {/* Link to login page for users who already have an account */}
      <div className="text-center mt-3">
        <Link to="/login">Already have an account? Log in here</Link>
      </div>
    </Fragment>
  );
};

export default Register;
